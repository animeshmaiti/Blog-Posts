import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { UserAuthForm } from './pages/UserAuthForm';
import { Editor } from './pages/Editor';
import { HomePage } from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PageNotFound from './pages/PageNotFound';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import SideNavbar from './components/SideNavbar';
import ChangePassword from './pages/ChangePassword';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import ManageBlogs from './pages/ManageBlogs';
import { BlogProvider } from './context/blogContext';
import { EditorProvider } from './context/editorContext';

const App = () => {
    return (
        <Routes>
            <Route path='/editor' element={
                <EditorProvider>
                    <Editor />
                </EditorProvider>
            } />
            <Route path='/editor/:blog_id' element={
                <EditorProvider>
                    <Editor />
                </EditorProvider>
            } />
            <Route path='/' element={<Navbar />}>
                <Route index element={<HomePage />} />
                <Route path='dashboard' element={<SideNavbar />}>
                    <Route path='blogs' element={<ManageBlogs />} />
                    <Route path='notifications' element={<Notifications />} />
                </Route>
                <Route path='settings' element={<SideNavbar />}>
                    <Route path='edit-profile' element={<EditProfile />} />
                    <Route path='change-password' element={<ChangePassword />} />
                </Route>
                <Route path='signin' element={<UserAuthForm type='sign-in' />} />
                <Route path='signup' element={<UserAuthForm type='sign-up' />} />
                <Route path='search/:query' element={<SearchPage />} />
                <Route path='user/:id' element={<ProfilePage />} />
                <Route path='blog/:blog_id' element={
                    <BlogProvider>
                        <BlogPage />
                    </BlogProvider>
                } />
                <Route path='*' element={<PageNotFound />} />
            </Route>
        </Routes>
    )
}

export default App;