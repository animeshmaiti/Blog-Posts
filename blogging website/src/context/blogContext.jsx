import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { filterPaginationData } from '../common/filterPaginationData';

export const blogContext = createContext();

export const BlogProvider = ({ children }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [countData, setCountData] = useState(null);

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
            console.log(blogsData);
            let formattedData = await filterPaginationData({
                create_new_arr: page === 1,
                state: countData,
                data: blogsData,
                page,
                countRoute: '/api/blog/search-blogs-count',
                data_to_send: { tag: category }
            });
            console.log(formattedData);
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

    return (
        <blogContext.Provider value={{ fetchLatestBlogs, fetchTrendingBlogs, fetchBlogsByCategory, setBlogs, blogs, trendingBlogs, countData }}>
            {children}
        </blogContext.Provider>
    );
};

export const useBlog = () => useContext(blogContext);
