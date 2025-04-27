import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { uploadImage } from '../common/aws';
import axios from 'axios';

export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {

    const blogStructure = {
        title: '',
        banner: '',
        content: [],
        tags: [],
        desc: '',
        author: { personal_info: {} }
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
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image, try different image'));
            });
            const url = await uploadImage(imgFile);
            // console.log(url);
            if (url) {
                toast.success('Image uploaded successfully');
                setBlog((prev) => ({ ...prev, banner: url }));
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        } finally {
            URL.revokeObjectURL(imgURL);
        }
    }

    const saveDraft = async () => {
        try {
            const response = await axios.post('/api/blogs/draft', blog);
            if (response.status === 200) {
                toast.success('Draft saved successfully');
            } else {
                toast.error('Failed to save draft');
            }
        } catch (error) {
            toast.error('Error saving draft: ' + error.message);
        }
    }

    return (
        <EditorContext.Provider value={{ uploadBanner, blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    return useContext(EditorContext);
};
