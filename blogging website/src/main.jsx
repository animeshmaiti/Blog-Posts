import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.jsx'
import { EditorProvider } from './context/editorContext.jsx'
import { BlogProvider } from './context/blogContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <EditorProvider>
                <BlogProvider>
                    <App />
                </BlogProvider>
            </EditorProvider>
        </AuthProvider>
    </BrowserRouter>
    //</React.StrictMode>
)
