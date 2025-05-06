import User from "../Schema/User.js";

export const searchUsers = async (req, res) => {
    const {query}=req.body;
    if(!query) return res.status(400).json({error:"Query is required in search users"});
    try {
        const users = await User.find({'personal_info.username': new RegExp(query, 'i')})
            .select('personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .limit(10);
        if(users.length === 0) return res.status(404).json({error:"No users found"});
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}