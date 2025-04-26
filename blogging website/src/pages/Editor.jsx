import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { BlogEditor } from '../components/BlogEditor/BlogEditor';
import { PublishForm } from '../components/BlogEditor/PublishForm';

export const Editor = () => {
    const { isValid } = useAuth();
    const [editor, setEditor] = useState('editor');
    if (!isValid) {
        return <Navigate to='/signin' />
    }
    return (
        editor === 'editor' ? (
            <BlogEditor/>
        ) : (
            <PublishForm/>
        )
    )
}
