import { Link } from 'react-router-dom';
import logo from '@assets/logo.png';
import { useContext, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import EditorJS from '@editorjs/editorjs';

import defaultBanner from '@assets/blog banner.png';
import { AnimationWrapper } from '../../common/page-animation';

import { tools } from './tools';
import { EditorContext } from '../../context/editorContext';

export const BlogEditor = () => {
    const { blog, blog: { title, banner, content, tags, desc }, uploadBanner, setBlog, textEditor, setTextEditor, setEditorState ,publishBlog} = useContext(EditorContext);

    useEffect(() => {
        setTextEditor(new EditorJS({
            holder: 'textEditor',
            data: content,
            tools: tools,
            placeholder: 'Write your blog content here...',
        }))
    }, []);

    const handleUploadBanner = async (e) => {
        const imgFile = e.target.files[0];
        uploadBanner(imgFile);
    }
    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        const title = input.value;
        if (title.length > 100) {
            input.value = title.slice(0, 100);
            toast.error('Title is too long!');
        }
        setBlog((prev) => ({ ...prev, title }));
    }
    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    }
    const handlePublishEvent = async () => {
        if (!title.length) {
            toast.error('Title is required!');
            return;
        }
        if (!banner.length) {
            toast.error('Banner is required!');
            return;
        }
        // console.log(textEditor);
        if (textEditor.isReady) {
            try {
                const data = await textEditor.save();
                console.log(data);
                if (data.blocks.length) {
                    setBlog((prev) => ({ ...prev, content: data }));
                    toast.success('Blog is ready to publish!');
                    setEditorState('publish');
                } else {
                    toast.error('Content is required!');
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            return toast.error("Write Blog title before saving draft")
        }
        publishBlog(e,true);
    }

    return (
        <>
            <nav className='navbar'>
                <Link to='/' className='flex-none w-10'>
                    <img src={logo} alt='img' />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length > 0 ? title : 'Blog Title'}
                </p>
                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2'
                        onClick={handlePublishEvent}
                    >
                        Publish
                    </button>
                    <button className='btn-light py-2'
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                </div>
            </nav>
            <AnimationWrapper>
                <section>
                    <Toaster />
                    <div className='mx-auto w-full max-w-[900px]'>
                        <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
                            <label>
                                <img
                                    src={banner}
                                    className='z-20'
                                    onError={handleError}
                                />
                                <input
                                    id='uploadBanner'
                                    type='file'
                                    accept='.png,.jpg,.jpeg,.webp'
                                    hidden
                                    onChange={handleUploadBanner}
                                />
                            </label>
                        </div>
                        <textarea
                            defaultValue={title}
                            placeholder='Blog Title'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading tight placeholder:opa city-40 bg-white'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        >

                        </textarea>
                        <hr className='w-full opacity-10 my-5' />
                        <div id='textEditor' className=' font-gelasio'>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}
