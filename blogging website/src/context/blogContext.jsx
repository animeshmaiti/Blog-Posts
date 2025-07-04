import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const blogContext = createContext();

export const BlogProvider = ({ children }) => {
    const blogDataStructure = {
        title: '',
        desc: '',
        content: [],

        author: { personal_info: {} },
        banner: '',
        publishedAt: '',
        comments: { results: [] },

        activity: {
            total_comments: [],
            total_likes: [],
        },
    }
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState(blogDataStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    const fetchBlog = async (blog_id) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/get-blog`, { blog_id }, {
                withCredentials: true
            });
            const blogData = response.data.blog;
            blogData.comments = await fetchComments({ blog_id: blogData._id, setParentCommentCount: setTotalParentCommentsLoaded });
            // console.log(blogData);
            const suggestedBlogs = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/search-blogs`, { tag: blogData.tags[0], limit: 5, exclude_blog: blog_id });
            if (response.status === 200 && suggestedBlogs.status === 200) {
                setLoading(false);
                setSimilarBlogs(suggestedBlogs.data.blogs);
                setBlog(blogData);
            } else {
                toast.error('Failed to fetch blog');
                navigate('/404');
            }
        } catch (error) {
            setLoading(false);
            toast.error('Failed to fetch blog');
            console.error(error);
            navigate('/404');
        }
    }

    const fetchComments = async ({ skip = 0, blog_id, setParentCommentCount, comment_array = null }) => {
        try {
            let res;
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/interaction/get-blog-comment`, {
                blog_id,
                skip
            });
            const commentsData = response.data;
            // console.log(commentsData,skip);
            commentsData.map((comment) => {
                comment.childrenLevel = 0;
            })
            setParentCommentCount(prev => prev + commentsData.length);
            if (comment_array == null) {
                res = commentsData;
            }
            else {
                res = [...comment_array, ...commentsData];
            }
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <blogContext.Provider value={{  fetchBlog, loading, blog, setBlog, similarBlogs, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, fetchComments }}>
            {children}
        </blogContext.Provider>
    );
};

export const useBlog = () => useContext(blogContext);
