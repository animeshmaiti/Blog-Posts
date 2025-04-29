import Blog from "../Schema/Blog.js"

export const getLatestBlogs = async (req, res) => {
    let maxLimit = 5;
    const blogs = await Blog.find({ draft: false });
    return res.status(200).json({ blogs });
        
}