import Blog from "../Schema/Blog.js"
import User from "../Schema/User.js";

export const getLatestBlogs = async (req, res) => {
    let { page } = req.body;
    let maxLimit = 5;
    try {
        const blogs = await Blog.find({ draft: false })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'publishedAt': -1 })
            .select('blog_id title desc banner activity tags publishedAt -_id')
            .skip((page - 1) * maxLimit)
            .limit(maxLimit);

        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const countLatestBlogs = async (req, res) => {
    try {
        const count = await Blog.countDocuments({ draft: false });
        return res.status(200).json({ totalDocs: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getTrendingBlogs = async (req, res) => {
    let maxLimit = 5;
    try {
        const blogs = await Blog.find({ draft: false })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'activity.total_read': -1, 'activity.total_likes': -1, 'publishedAt': -1 })
            .select('blog_id title publishedAt -_id')
            .limit(maxLimit);

        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const searchBlogs = async (req, res) => {
    let { tag, query, author, page } = req.body;
    let findQuery;
    if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    } else if (tag) {
        tag = tag.toLowerCase();
        findQuery = { draft: false, tags: tag };
    } else if (author) {
        findQuery = { draft: false, author: author };
    } else {
        return res.status(400).json({ error: "Tag or query or author is required in search blogs" });
    }

    try {
        const blogs = await Blog.find(findQuery)
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
            .sort({ 'publishedAt': -1 })
            .select('blog_id title desc banner activity tags publishedAt -_id')
            .skip((page - 1) * 5)
            .limit(5);

        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const countSearchBlogs = async (req, res) => {
    let { tag, author, query } = req.body;
    let findQuery;
    if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
    } else if (tag) {
        tag = tag.toLowerCase();
        findQuery = { draft: false, tags: tag };
    } else if (author) {
        findQuery = { draft: false, author: author };
    } else {
        return res.status(400).json({ error: "Tag or query or author is required in search blogs" });
    }

    try {
        const count = await Blog.countDocuments(findQuery);
        return res.status(200).json({ totalDocs: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getBlogById = async (req, res) => {
    const { blog_id } = req.body;
    try {
        const blog = await Blog.findOneAndUpdate({ blog_id: blog_id }, { $inc: { 'activity.total_reads': 1 } }, { new: true })
            .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
            .select('blog_id title desc content banner activity tags publishedAt');
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        await User.findOneAndUpdate(
            { _id: blog.author },
            { $inc: { 'account_info.total_reads': 1 } },
            { new: true }
        )
        return res.status(200).json({ blog });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}