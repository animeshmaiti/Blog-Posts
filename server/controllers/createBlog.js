import aws from 'aws-sdk';
import { nanoid } from 'nanoid';
import Blog from '../Schema/Blog.js';
import User from '../Schema/User.js';
import Notification from '../Schema/Notification.js';
import Comment from '../Schema/Comment.js';

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
});

export const generateUploadURL = async (req, res) => {
    const date = new Date();
    const { contentType } = req.query; // <-- get contentType from query

    if (!contentType) {
        return res.status(400).json({ error: 'Missing contentType' });
    }

    const extension = contentType.split('/')[1]; // like 'jpeg' or 'png'
    const imageName = `${nanoid()}-${date.getTime()}.${extension}`;

    try {
        const imgUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'blogpost-resources-007',
            Key: imageName,
            Expires: 1000,
            ContentType: contentType
        });
        res.status(200).json({ url: imgUrl });
    } catch (error) {
        console.error('Error generating signed URL', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createBlog = async (req, res) => {
    const authorId = req.user._id;
    let { title, desc, banner, tags, content, draft, id } = req.body;
    if (!title.length || title.length > 100) {
        return res.status(403).json({ error: 'You must provide blog title under 100 characters' });
    }
    if (!draft) {
        if (!desc.length || desc.length > 200) {
            return res.status(403).json({ error: 'You must provide blog description under 200 characters' });

        }
        if (!banner.length) {
            return res.status(403).json({ error: 'You must provide blog banner to publish it' });

        }
        if (!content.blocks.length) {
            return res.status(403).json({ error: 'There must be some blog content to publish it' });
        }
        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ error: 'The blog should contain tags it can be maximum of 10' });
        }
    }
    tags = tags.map(tag => tag.toLowerCase());
    const blogId = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();

    const blog = new Blog({
        blog_id: blogId,
        title,
        desc,
        banner,
        content,
        tags,
        author: authorId,
        draft: Boolean(draft)
    })
    if (id) {
        const blog = await Blog.findOne({ blog_id: id });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (authorId.toString() !== blog.author.toString()) {
            return res.status(403).json({ error: 'You are not authorized to update this blog' });
        }
        try {
            await Blog.findOneAndUpdate({ blog_id: id }, { title, desc, banner, content, tags, draft: Boolean(draft) });
            return res.status(200).json({ message: 'Blog updated successfully' });
        } catch (error) {
            console.error('Error updating blog', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        try {
            await blog.save().then(blog => {
                let incrementVal = draft ? 0 : 1;
                User.findOneAndUpdate({ _id: authorId }, { $inc: { 'account_info.total_posts': incrementVal }, $push: { 'blogs': blog._id } }).then(user => {
                    res.status(200).json({ message: 'Blog created successfully', id: blog.blog_id });
                }).catch(err => {
                    res.status(500).json({ error: 'Internal server error' });
                    console.log(err);
                })
            })
        } catch (error) {
            console.error('Error creating blog', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export const getUserWrittenBlogs = async (req, res) => {
    const user_id = req.user._id;
    const { page, draft, query, deleteCount } = req.body;
    const limit = 5;
    const skip = (page - 1) * limit;
    if (deleteCount) {
        skip -= deleteCount;
    }
    try {
        const blogs = await Blog.find({ author: user_id, draft: Boolean(draft), title: new RegExp(query, 'i') })
            .skip(skip)
            .limit(limit)
            .sort({ 'publishedAt': -1 })
            .select('title banner publishedAt blog_id activity desc draft -_id');

        return res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching user blogs', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

export const getUserWrittenBlogsCount = async (req, res) => {
    const user_id = req.user._id;
    const { draft, query } = req.body;

    try {
        const count = await Blog.countDocuments({ author: user_id, draft: Boolean(draft), title: new RegExp(query, 'i') });
        return res.status(200).json({totalDocs: count });
    } catch (error) {
        console.error('Error fetching user blogs count', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteBlog = async (req, res) => {
    const user_id = req.user._id;
    const {blog_id}=req.body;
    try {
        const blog=await Blog.findOneAndDelete({blog_id});
        await Notification.deleteMany({blog:blog._id});
        await Comment.deleteMany({blog_id:blog._id});
        await User.findOneAndUpdate({_id:user_id},{$pull:{blogs:blog._id},$inc:{'account_info.total_posts':-1}}); 
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}