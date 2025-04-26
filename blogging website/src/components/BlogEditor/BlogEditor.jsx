import { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '@assets/logo.png';
import { AnimationWrapper } from '../../common/page-animation';
import defaultBanner from '@assets/blog banner.png';
import { uploadImage } from '../../common/aws';
import toast, { Toaster } from 'react-hot-toast';

export const BlogEditor = () => {
    const blogBannerRef = useRef();

    const handleUploadBanner = async (e) => {
        const imgFile = e.target.files[0];
        if (!imgFile) return;

        const imgURL = URL.createObjectURL(imgFile);
        const img = new Image();
        img.src = imgURL;

        try {
            await new Promise((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image, try different image'));
            });
            let loadingToast = toast.loading('Uploading...');
            const url = await uploadImage(imgFile);
            if (url) {
                toast.dismiss(loadingToast);
                toast.success('Image uploaded successfully');
                blogBannerRef.current.src = url;
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message);
        } finally {
            URL.revokeObjectURL(imgURL);
        }
    }
    const handleTitleKeyDown=(e)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }
    const handleTitleChange=(e)=>{
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        const title = input.value;
        if (title.length > 100) {
            input.value = title.slice(0, 100);
            toast.error('Title is too long!');
        }
    }

    return (
        <>
            <nav className='navbar'>
                <Link to='/' className='flex-none w-10'>
                    <img src={logo} alt='img' />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    New Blog
                </p>
                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2'>
                        Publish
                    </button>
                    <button className='btn-light py-2'>
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
                                    src={defaultBanner}
                                    ref={blogBannerRef}
                                    className='z-20'
                                />
                                <input
                                    id='uploadBanner'
                                    type='file'
                                    accept='.png,.jpg,jpeg'
                                    hidden
                                    onChange={handleUploadBanner}
                                />
                            </label>
                        </div>
                        <textarea
                            // defaultValue={title}
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
