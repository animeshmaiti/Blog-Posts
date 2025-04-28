import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadImage } from '../common/aws';
import axios from 'axios';

export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
    const navigate = useNavigate();

    const blogStructure = {
        title: '',
        banner: '',
        content: [],
        tags: [],
        desc: ''
    };

    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState('editor');
    const [textEditor, setTextEditor] = useState({ isReady: false });

    const uploadBanner = async (imgFile) => {
        if (!imgFile) return;
        const imgURL = URL.createObjectURL(imgFile);
        const img = new Image();
        img.src = imgURL;

        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Failed to load image, try different image'));
            });
            const url = await uploadImage(imgFile);
            if (url) {
                toast.success('Image uploaded successfully');
                setBlog(prev => ({ ...prev, banner: url }));
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        } finally {
            URL.revokeObjectURL(imgURL);
        }
    };

    const publishBlog = async (e, isDraft) => {
        e.target.classList.add('disable');
        const loadingToast = toast.loading(isDraft ? 'Saving draft...' : 'Publishing...');
        const blogData = { ...blog, draft: isDraft };
        console.log(blogData);

        try {
            const response = await axios.post('http://localhost:3000/api/create/create-blog', blogData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success(isDraft ? 'Draft saved successfully!' : 'Blog published successfully!');
                setTimeout(() => navigate('/dashboard/blogs'), 500);
            } else {
                toast.error(isDraft?'Failed to save draft!':'Failed to publish blog!');
            }
        } catch (error) {
            toast.error(isDraft ? 'Error saving draft':'Error publishing blog');
            console.error(error);
        } finally {
            toast.dismiss(loadingToast);
            e.target.classList.remove('disable');
        }
    };

    return (
        <EditorContext.Provider value={{
            uploadBanner, publishBlog,
            blog, setBlog, editorState, setEditorState,
            textEditor, setTextEditor
        }}>
            {children}
        </EditorContext.Provider>
    );
};

// export const useEditor = () => useContext(EditorContext);
