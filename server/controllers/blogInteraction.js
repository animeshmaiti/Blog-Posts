import { populate } from 'dotenv';
import Blog from '../Schema/Blog.js';
import Comment from '../Schema/Comment.js';
import Notification from '../Schema/Notification.js';

export const likeBlog = async (req, res) => {
    const user_id = req.user._id;
    const { _id, isLikedByUser } = req.body;
    const incrementVal = !isLikedByUser ? 1 : -1;

    try {
        const blog = await Blog.findOneAndUpdate({ _id }, { $inc: { 'activity.total_likes': incrementVal } });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (!isLikedByUser) {
            const likeObj = new Notification({
                type: 'like',
                blog: _id,
                notification_for: blog.author,
                user: user_id
            })
            await likeObj.save();
            return res.status(200).json({ message: 'Blog liked successfully' });
        } else {
            await Notification.findOneAndDelete({ user: user_id, blog: _id, type: 'like' });
            return res.status(200).json({ message: 'Like Removed' });
        }

    } catch (error) {
        console.error('Error liking blog', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const isLikedByUser = async (req, res) => {
    const user_id = req.user._id;
    const { _id } = req.body;
    try {
        const response = await Notification.exists({ user: user_id, blog: _id, type: 'like' });
        return res.status(200).json({ liked_by_user: response });
    } catch (error) {
        console.error('Error checking if blog is liked by user', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const addComment = async (req, res) => {
    const user_id = req.user._id;
    const { _id, comment, blog_author, replying_to, notification_id } = req.body;
    if (!comment.length) {
        return res.status(403).json({ error: 'You must provide a comment' });
    }
    const commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
    };
    if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }
    try {
        const commentData = await new Comment(commentObj).save();
        const { comment, commentedAt, children } = commentData;
        await Blog.findByIdAndUpdate({ _id }, { $push: { 'comments': commentData._id }, $inc: { 'activity.total_comments': 1, 'activity.total_parent_comments': replying_to ? 0 : 1 } });

        const notificationObj = {
            type: replying_to ? 'reply' : 'comment',
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentData._id,
        }
        if (replying_to) {
            notificationObj.replied_on_comment = replying_to;
            const replyingToCommentDoc = await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentData._id } });
            notificationObj.notification_for = replyingToCommentDoc.commented_by;
            if (notification_id) {
                await Notification.findByIdAndUpdate({ _id: notification_id }, { reply: commentData._id });
            }
        }
        await new Notification(notificationObj).save();
        return res.status(200).json({
            message: 'Comment added successfully',
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

export const getBlogComments = async (req, res) => {
    const { blog_id, skip } = req.body;
    const limit = 5;
    try {
        const commentData = await Comment.find({ blog_id, isReply: false }).populate({ path: 'commented_by', select: 'personal_info.username personal_info.fullname personal_info.profile_img' }).sort({ commentedAt: -1 }).skip(skip).limit(limit);

        return res.status(200).json(commentData);

    } catch (error) {
        console.error('Error fetching comments', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getReplies = async (req, res) => {
    const { _id, skip } = req.body;
    const limit = 5;
    try {
        const replies = await Comment.findOne({ _id })
            .populate({
                path: 'children',
                options: {
                    limit: limit,
                    skip: skip,
                    sort: { 'commentedAt': -1 }
                },
                populate: {
                    path: 'commented_by',
                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                },
                select: '-blog_id -updatedAt'
            })
            .select('children');
        return res.status(200).json({ replies: replies.children });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteComments = async (_id) => {
    const comment = await Comment.findOneAndDelete({ _id });
    if (comment.parent) {
        await Comment.findByIdAndUpdate(comment.parent, { $pull: { children: _id } });
    }
    await Notification.findOneAndDelete({ comment: _id });
    await Notification.findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } });
    await Blog.findByIdAndUpdate(comment.blog_id, { $pull: { comments: _id }, $inc: { 'activity.total_comments': -1, 'activity.total_parent_comments': comment.isReply ? 0 : -1 } });
    if (comment.children.length) {
        comment.children.map(async (childId) => {
            await deleteComments(childId);
        });
    }
}

export const deleteComment = async (req, res) => {
    const user_id = req.user._id;
    const { _id } = req.body;

    try {
        const comment = await Comment.findById(_id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.commented_by.toString() !== user_id.toString() || comment.blog_author.toString() !== user_id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }
        await deleteComments(_id);
        return res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.error('Error deleting comment', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}