// login, logout, signup
import bcrypt from 'bcrypt';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

import User from '../Schema/User.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import { serviceAccount } from '../config/firebaseServiceAccountKey.js';


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const serviceAccountKey = serviceAccount();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let existingUser = await User.findOne({ 'personal_info.username': username });
    if (existingUser) {
        let i = 1;
        while (existingUser) {
            username = `${username}${i}`;
            existingUser = await User.findOne({ 'personal_info.username': username });
            i++;
        }
    }
    return username;
}

export const signup = async (req, res) => {
    try {

        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }
        if (fullname.length < 3) {
            return res.status(400).json({ error: 'Full name must be at least 3 characters long' });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email is not valid' });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            personal_info: {
                fullname,
                email,
                password: hashedPassword,
                username: await generateUsername(email)
            }
        });
        try {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            console.log('User created successfully');
            return res.status(201).json({
                profile_img: newUser.personal_info.profile_img,
                username: newUser.personal_info.username,
                email: newUser.personal_info.email,
                admin: newUser.admin
            });
        } catch (err) {
            console.log('Error creating user', err);
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }

    } catch (err) {
        console.log('Error in signup', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill all the fields' });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email is not valid' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Incorrect Password' });
    }
    try {
        const user = await User.findOne({ 'personal_info.email': email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        if (!user.google_auth) {
            const isMatch = await bcrypt.compare(password, user.personal_info.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            generateTokenAndSetCookie(user._id, res);
            console.log('User logged in successfully');
            return res.status(200).json({
                profile_img: user.personal_info.profile_img,
                username: user.personal_info.username,
                email: user.personal_info.email,
                admin: user.admin
            });
        } else {
            return res.status(403).json({
                error: 'This email was signed up with Google. Please log in with Google to access the account'
            });
        }
    } catch (err) {
        console.log('Error in login', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const GoogleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        const decodedUser = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedUser;
        picture = picture.replace('s96-c', 's384-c');

        let user = await User.findOne({ 'personal_info.email': email })
            .select('personal_info.fullname personal_info.username personal_info.profile_img google_auth');

        if (user) {
            if (!user.google_auth) {
                return res.status(403).json({
                    error: 'This email was signed up without Google. Please log in with a password to access the account'
                });
            }
            generateTokenAndSetCookie(user._id, res);
            console.log('User logged in successfully with Google auth');
        } else { //sign up
            const username = await generateUsername(email);
            user = new User({
                personal_info: { fullname: name, email, username, profile_img: picture },
                google_auth: true
            });
            await user.save();
            generateTokenAndSetCookie(user._id, res);
            console.log('User created successfully with Google auth');
        }

        return res.status(200).json({
            profile_img: picture,
            username: user.personal_info.username,
            email: user.personal_info.email,
            admin: user.admin
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message || 'Failed to authenticate with Google. Try with a different account.'
        });
    }
}

export const changePassword = async (req, res) => { 
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Please fill all the fields' });
    }
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    }
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.google_auth) {
            return res.status(403).json({ error: 'You cannot change the password for a Google authenticated user. Please log in with Google.' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.personal_info.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }
        const salt = await bcrypt.genSalt(10);
        user.personal_info.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        console.log('Password changed successfully');
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.log('Error in changing password', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: 'strict',
            path: '/',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('during logout', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
