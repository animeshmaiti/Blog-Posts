import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { UserAuthForm } from './pages/UserAuthForm';
import { Editor } from './pages/Editor';
import { HomePage } from './pages/HomePage';
import SearchPage from './pages/SearchPage';

const App = () => {
    return (
        <Routes>
            <Route path='/editor' element={<Editor/>}/>
            <Route path='/' element={<Navbar />}>
                <Route index element={<HomePage/>} />
                <Route path='signin' element={<UserAuthForm type='sign-in'/>} />
                <Route path='signup' element={<UserAuthForm type='sign-up'/>} />
                <Route path='search/:query' element={<SearchPage/>} />
            </Route>
        </Routes>
    )
}

export default App;