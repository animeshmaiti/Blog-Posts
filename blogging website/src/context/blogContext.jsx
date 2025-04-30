import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const blogContext = createContext();

export const BlogProvider = ({ children }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(null);

    const fetchLatestBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blog/latest-blogs');
            const blogs = response.data.blogs;
            console.log(blogs);
            if (response.status === 200) {
                setBlogs(blogs);
                toast.success('Latest blogs fetched successfully!');
            } else {
                toast.error('Failed to fetch latest blogs');
            }
        } catch (error) {
            toast.error('Failed to fetch latest blogs');
            console.error(error);
        }
    }

    return (
        <blogContext.Provider value={{fetchLatestBlogs,blogs}}>
            {children}
        </blogContext.Provider>
    );
};

export const useBlog = () => useContext(blogContext);
