import Blog from '../Schema/Blog.js';
import Comment from '../Schema/Comment.js';
import Notification from '../Schema/Notification.js';

export const likeBlog = async (req, res) => {
    const user_id = req.user._id;
    const { _id } = req.body;

    try {
        const blog = await Blog.findById(_id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const alreadyLiked = blog.activity.likedBy.includes(user_id);
        const update = {
            $inc: { 'activity.total_likes': alreadyLiked ? -1 : 1 },
            [alreadyLiked ? '$pull' : '$addToSet']: { 'activity.likedBy': user_id }
        };

        const updatedBlog = await Blog.findByIdAndUpdate(_id, update, { new: true });

        res.status(200).json({
            message: alreadyLiked ? "Like removed" : "Blog liked successfully",
            blog: updatedBlog,
        });

    } catch (error) {
        console.error('Error liking blog', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addComment = async (req, res) => {
    const user_id = req.user._id;
    const { _id, comment, blog_author } = req.body;
    if (!comment.length) {
        return res.status(403).json({ error: "You must provide a comment" });
    }
    const commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
    };
    try {
        const commentData = await new Comment(commentObj).save();
        const { comment, commentedAt, children } = commentData;
        await Blog.findByIdAndUpdate({ _id }, { $push: { 'comments': commentData._id }, $inc: { 'activity.total_comments': 1 }, 'activity.total_parent_comments': 1 });

        const notificationObj = {
            type: "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentData._id,
        }
        await new Notification(notificationObj).save();
        return res.status(200).json({
            message: "Comment added successfully",
            comment,
            commentedAt,
            _id: commentData._id,
            user_id,
            children
        });
    } catch (error) {
        console.error('Error adding comment', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}