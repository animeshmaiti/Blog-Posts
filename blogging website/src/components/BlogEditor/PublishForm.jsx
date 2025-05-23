import React, { useContext } from 'react';
import { AnimationWrapper } from '../../common/page-animation';
import { Toaster } from 'react-hot-toast';
import { EditorContext } from '../../context/editorContext';
import { Tags } from './tags';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export const PublishForm = () => {
    const {blog_id}=useParams();
    const { blog, blog: { banner, title, tags, desc, content }, setEditorState, setBlog, publishBlog } = useContext(EditorContext);
    const characterLimit = 200;
    const tagLimit = 5;

    const handleCloseEvent = () => {
        setEditorState('editor');
    }
    const handleBlogTitleChange = (e) => {
        const input = e.target;
        setBlog((prev) => ({ ...prev, title: input.value }));
    }
    const handleBlogDesChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        const des = input.value;
        if (des.length > characterLimit) {
            input.value = des.slice(0, characterLimit);
            // toast.error('Description is too long!');
        }
        setBlog((prev) => ({ ...prev, desc: des }));
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Comma') {
            e.preventDefault();
            const tag = e.target.value;
            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
                }
            } else {
                toast.error(`you can maximum add ${tagLimit} tags`);
            }
            e.target.value = '';
        }
    }
    const handlePublishEvent = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            return toast.error("Write Blog title before publishing")
        }
        if (!desc.length || desc.length > characterLimit) {
            return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`)
        }
        if (!tags.length) {
            return toast.error("Enter at least 1 tag to help us rank your blog")
        }
        publishBlog(e, false, blog_id);
    }

    return (
        <AnimationWrapper>
            <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
                <Toaster />
                <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'
                    onClick={handleCloseEvent}
                >   <i className='fi fi-br-cross'></i>
                </button>
                <div className='max-w-[550px] center'>
                    <p className='text-dark-grey mb-1'>Preview</p>
                    <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
                        <img src={banner} />
                    </div>
                    <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
                    <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{desc}</p>
                </div>
                <div className='border-grey lg:border-1 pl-8'>
                    <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
                    <input type='text' placeholder='Blog Title' defaultValue={title}
                        className='input-box pl-4'
                        onChange={handleBlogTitleChange}
                    />
                    <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
                    <textarea
                        maxLength={characterLimit}
                        defaultValue={desc}
                        className='h-40 resize-none leading-7 input-box pl-4'
                        onChange={handleBlogDesChange}
                    // onKeyDown={handleTitlekeyDown}
                    ></textarea>
                    <p className='mt-1 text-dark-grey text-sm text-right'>
                        {characterLimit - desc.length} characters left
                    </p>
                    <p className='text-dark-grey mb-2 mt-9'> Topics -(Helps is searching and ranking your blog post)</p>
                    <div className='relative input-box pl-2 py-2 pb-4'>
                        <input type='text'
                            placeholder='Topic'
                            className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
                            onKeyDown={handleKeyDown}
                        />
                        {
                            tags.map((tag, index) => {
                                return <Tags key={index} tag={tag} tagIndex={index} />
                            })
                        }

                    </div>
                    <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit - tags.length} Tags left</p>
                    <button className='btn-dark px-8 mt-5'
                        onClick={handlePublishEvent}
                    >Publish</button>
                </div>
            </section>
        </AnimationWrapper>
    )
}
