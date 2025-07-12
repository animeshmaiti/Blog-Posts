import lightFullLogo from '@assets/full-logo-light.png';
import darkFullLogo from '@assets/full-logo-dark.png';
import { authContext } from '../context/authContext';
import { useContext } from 'react';

const About = () => {
    const { theme } = useContext(authContext);
    return (
        <section className='h-cover relative p-10 flex flex-col items-center gap-10 text-center'>
            <h1 className='text-4xl font-gelasio leading-7'>About Us</h1>
            <p className='max-w-2xl text-dark-grey'>
                <strong>Open Writer</strong> is a minimalist, distraction-free platform designed for writers and readers alike. Whether you're crafting personal blogs, sharing insights, or reading from a global community.
            </p>
            <p className='max-w-2xl text-dark-grey'>
                This Project is created for educational purposes, showcasing the use of React, Node.js, and MongoDB in building a full-stack application. It aims to provide a seamless user experience with features like blog management, user authentication, and real-time notifications. Currently this project allows only admin users to write and manage blogs, because it runs on free server with limited resources and uses aws s3 free tire for image storage, which is not free if limit exceeded.
            </p>
            <div className='flex flex-col items-center gap-2 mt-2'>
                <a
                    href='https://github.com/animeshmaiti/Blog-Posts'
                    target='_blank'
                    rel='noopener noreferrer'
                    title='GitHub'
                    className='flex items-center gap-2 hover:text-purple transition'
                >
                    <i className='fi fi-brands-github text-2xl'></i>
                    <span>Source Code</span>
                </a>

                <a
                    href='mailto:maitianimesh08@gmail.com'
                    title='Email'
                    className='flex items-center gap-2 hover:text-purple transition'
                >
                    <i className='fi fi-rr-envelope text-2xl'></i>
                    <span>maitianimesh08@gmail.com</span>
                </a>
            </div>
            <div className='mt-auto'>
                <img src={theme === 'light' ? darkFullLogo : lightFullLogo} className='h-14 object-contain block mx-auto select-none' />
                <p className='mt-5 text-dark-grey'>Read millions of stories written by people like you</p>
            </div>
        </section>
    )
}

export default About