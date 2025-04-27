import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { BlogEditor } from '../components/BlogEditor/BlogEditor';
import { PublishForm } from '../components/BlogEditor/PublishForm';
import { useEditor } from '../context/editorContext';

export const Editor = () => {
    const { isValid } = useAuth();
    const {editorState}=useEditor();

    if (!isValid) {
        return <Navigate to='/signin' />
    }
    return (
        editorState === 'editor' ? (
            <BlogEditor/>
        ) : (
            <PublishForm/>
        )
    )
}
