import User from "../Schema/User.js";

export const searchUsers = async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required in search users" });
    try {
        const users = await User.find({ 'personal_info.username': new RegExp(query, 'i') })
            .select('personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .limit(10);
        if (users.length === 0) return res.status(404).json({ error: "No users found" });
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getProfile = async (req, res) => {
    const { username } = req.body;
    try {
        const profile = await User.findOne({ 'personal_info.username': username })
            .select('-personal_info.password -google_auth -updatedAt -blogs');
        if (!profile) return res.status(404).json({ error: "User not found" });
        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateProfileImg = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Image URL is required" });
    try {
        await User.findOneAndUpdate({ _id: req.user._id }, { 'personal_info.profile_img': url });
        return res.status(200).json({ profile_img: url });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    const bioLimit = 150;
    const { username, bio, social_links } = req.body;
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }
    if (bio.length > bioLimit) {
        return res.status(400).json({ error: `Bio must be less than ${bioLimit} characters` });
    }
    const socialLinksArr = Object.keys(social_links);
    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                const hostname = new URL(social_links[socialLinksArr[i]]).hostname;
                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] !== 'website') {
                    return res.status(400).json({ error: `Invalid URL for ${socialLinksArr[i]}` });
                }
            }
        }
        const updateObj = {
            'personal_info.username': username,
            'personal_info.bio': bio,
            social_links: social_links
        }
        await User.findOneAndUpdate(
            { _id: req.user._id },
            updateObj,
            { runValidators: true }
        );
        return res.status(200).json({ username });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already exists' });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
}