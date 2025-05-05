import Blog from "../Schema/Blog.js"

export const getLatestBlogs = async (req, res) => {
    let{ page } = req.body;
    let maxLimit = 5;
    try {
        const blogs = await Blog.find({ draft: false })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'publishedAt': -1 })
            .select('blog_id title desc banner activity tags publishedAt -_id')
            .skip((page - 1) * maxLimit)
            .limit(maxLimit);

        return res.status(200).json({blogs});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const countLatestBlogs = async (req, res) => {
    try {
        const count= await Blog.countDocuments({ draft: false });
        return res.status(200).json({totalDocs:count});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const getTrendingBlogs = async (req, res) => {
    let maxLimit = 5;
    try {
        const blogs = await Blog.find({ draft: false })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'activity.total_read': -1,'activity.total_likes':-1,'publishedAt': -1 })
            .select('blog_id title publishedAt -_id')
            .limit(maxLimit);

        return res.status(200).json({blogs});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const searchBlogs = async (req, res) => {
    let {tag,page}=req.body;
    if(!tag) return res.status(400).json({error:"Tag is required"});
    tag = tag.toLowerCase();
    try {
        const blogs = await Blog.find({ draft: false, tags: tag })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'publishedAt': -1 })
            .select('blog_id title desc banner activity tags publishedAt -_id')
            .skip((page - 1) * 5)
            .limit(5);

        return res.status(200).json({blogs});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const countSearchBlogs=async (req,res)=>{
    let {tag}=req.body;
    if(!tag) return res.status(400).json({error:"Tag is required in count search blogs"});
    tag = tag.toLowerCase();
    try {
        const count= await Blog.countDocuments({ draft: false, tags: tag });
        return res.status(200).json({totalDocs:count});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}
