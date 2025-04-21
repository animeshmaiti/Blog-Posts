// login, logout, signup
import User from "../Schema/User.js";
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from "../utils/generateToken.js";


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const signup = async (req, res) => {
    try {

        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        if (fullname.length < 3) {
            return res.status(400).json({ error: "Full name must be at least 3 characters long" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email is not valid" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number" });
        }
        // check if user already exists
        const generateUsername = async (email) => {
            let username = email.split('@')[0];
            let existingUser = await User.findOne({ "personal_info.username": username });
            if (existingUser) {
                let i = 1;
                while (existingUser) {
                    username = `${username}${i}`;
                    existingUser = await User.findOne({ "personal_info.username": username });
                    i++;
                }
            }
            return username;
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
            console.log("User created successfully");
            return res.status(201).json({
                profile_img: newUser.personal_info.profile_img,
                username: newUser.personal_info.username,
                email: newUser.personal_info.email
            });
        } catch (err) {
            console.log("Error creating user", err);
            if (err.code === 11000) {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Internal server error" });
        }

    } catch (err) {
        console.log("Error in signup", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email is not valid" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Incorrect Password" });
    }
    try {
        const user = await User.findOne({ "personal_info.email": email });
        const isMatch = await bcrypt.compare(password, user.personal_info.password);
        if (!user || !isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
       
        generateTokenAndSetCookie(user._id, res);
        console.log("User logged in successfully");
        return res.status(200).json({
            profile_img: user.personal_info.profile_img,
            username: user.personal_info.username,
            email: user.personal_info.email
        });
    } catch (err) {
        console.log("Error in login", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = (req, res) => {

}
