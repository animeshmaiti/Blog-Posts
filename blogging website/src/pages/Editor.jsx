import { useContext } from 'react';
import { authContext} from '../context/authContext';
import { Navigate } from 'react-router-dom';
import { BlogEditor } from '../components/BlogEditor/BlogEditor';
import { PublishForm } from '../components/BlogEditor/PublishForm';
import { EditorContext } from '../context/editorContext';

export const Editor = () => {
    const { isValid, loading } = useContext(authContext);
    const useEditor = useContext(EditorContext);
    const { editorState } = useEditor;
    if (loading) {
        return <div>Loading...</div>;
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
