import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const blogContext = createContext();

export const BlogProvider = ({ children }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);

    const fetchLatestBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blog/latest-blogs');
            const blogs = response.data.blogs;
            console.log(blogs);
            if (response.status === 200) {
                setBlogs(blogs);
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

    const fetchBlogsByCategory = async (category) => {
        try {
            const response = await axios.post('http://localhost:3000/api/blog/search-blogs', {
                tag: category
            });
            const blogs = response.data.blogs;
            console.log(blogs);
            if (response.status === 200) {
                setBlogs(blogs);
            } else {
                toast.error('Failed to fetch blogs by category');
            }
        } catch (error) {
            toast.error('Failed to fetch blogs by category');
            console.error(error);
        }
    }

    return (
        <blogContext.Provider value={{ fetchLatestBlogs, fetchTrendingBlogs, fetchBlogsByCategory, setBlogs, blogs, trendingBlogs }}>
            {children}
        </blogContext.Provider>
    );
};

export const useBlog = () => useContext(blogContext);
