import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { filterPaginationData } from '../common/filterPaginationData';

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
    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [countData, setCountData] = useState(null);
    const [blog, setBlog] = useState(blogDataStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    const fetchLatestBlogs = async ({ page = 1 }) => {
        // console.log(page);
        try {
            const response = await axios.post('http://localhost:3000/api/blog/latest-blogs', { page });
            const blogsData = response.data.blogs;
            // console.log(blogsData);
            let formattedData = await filterPaginationData({
                create_new_arr: page === 1,  // force reset if it's the first page
                state: countData,
                data: blogsData,
                page,
                countRoute: '/api/blog/all-latest-blogs-count'
            });
            // console.log(formattedData);
            if (response.status === 200) {
                setCountData(formattedData);
                setBlogs(formattedData.results);
            } else {
                toast.error('Failed to fetch latest blogs');
            }
        } catch (error) {
            toast.error('Failed to fetch latest blogs');
            console.error(error);
        }
    }

    const fetchTrendingBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blog/trending-blogs');
            const blogs = response.data.blogs;
            // console.log(blogs);
            if (response.status === 200) {
                setTrendingBlogs(blogs);
            } else {
                toast.error('Failed to fetch trending blogs');
            }
        } catch (error) {
            toast.error('Failed to fetch trending blogs');
            console.error(error);
        }
    }

    const fetchBlogsByCategory = async ({ category, page = 1 }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/blog/search-blogs', {
                tag: category,
                page: page
            });
            const blogsData = response.data.blogs;
            // console.log(blogsData);
            let formattedData = await filterPaginationData({
                create_new_arr: page === 1,
                state: countData,
                data: blogsData,
                page,
                countRoute: '/api/blog/search-blogs-count',
                data_to_send: { tag: category }
            });
            // console.log(formattedData);
            if (response.status === 200) {
                setBlogs(formattedData.results);
                setCountData(formattedData);
            } else {
                toast.error('Failed to fetch blogs by category');
            }
        } catch (error) {
            toast.error('Failed to fetch blogs by category');
            console.error(error);
        }
    }

    const fetchBlog = async (blog_id) => {
        try {
            const response = await axios.post('http://localhost:3000/api/blog/get-blog', { blog_id }, {
                withCredentials: true
            });
            const blogData = response.data.blog;
            blogData.comments = await fetchComments({ blog_id: blogData._id, setParentCommentCount: setTotalParentCommentsLoaded });
            // console.log(blogData);
            const suggestedBlogs = await axios.post('http://localhost:3000/api/blog/search-blogs', { tag: blogData.tags[0], limit: 5, exclude_blog: blog_id });
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
            const response = await axios.post('http://localhost:3000/api/interaction/get-blog-comment', {
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
        <blogContext.Provider value={{ fetchLatestBlogs, fetchTrendingBlogs, fetchBlogsByCategory, fetchBlog, setBlogs, blogs, trendingBlogs, countData, loading, blog, setBlog, similarBlogs, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, fetchComments }}>
            {children}
        </blogContext.Provider>
    );
};

export const useBlog = () => useContext(blogContext);
