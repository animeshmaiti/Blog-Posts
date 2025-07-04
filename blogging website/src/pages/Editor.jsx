import { useContext, useEffect } from 'react';
import { authContext } from '../context/authContext';
import { Navigate, useParams } from 'react-router-dom';
import { BlogEditor } from '../components/BlogEditor/BlogEditor';
import { PublishForm } from '../components/BlogEditor/PublishForm';
import { EditorContext } from '../context/editorContext';
import Loader from '../components/Loader';
import axios from 'axios';

export const Editor = () => {
    const { isValid, loading, setLoading } = useContext(authContext);
    const { editorState, setBlog } = useContext(EditorContext);
    const { blog_id } = useParams();
    useEffect(() => {
        setLoading(true);
        const fetchBlog = async () => {
            setLoading(true);
            if (!blog_id) {
                setLoading(false);
                return;
            }

            try {
                const { data: { blog } } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/get-blog`, {
                    blog_id,
                    draft: true,
                    mode: 'edit'
                });
                setBlog(blog);
            } catch (err) {
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blog_id]);
    if (loading) {
        return <Loader />
    }
    if (!isValid) {
        return <Navigate to='/signin' />
    }
    return (
        editorState === 'editor' ? (
            <BlogEditor />
        ) : (
            <PublishForm />
        )
    )
}
