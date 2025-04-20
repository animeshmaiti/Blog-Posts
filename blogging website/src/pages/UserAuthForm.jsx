import React from 'react'
import { SignUp } from '../components/InputForm/SignUp'
import google from '@assets/google.png'
import { Link } from 'react-router-dom'
import { SignIn } from '../components/InputForm/SignIn'
import { AnimationWrapper } from '../common/page-animation'

export const UserAuthForm = ({ type }) => {
    return (
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex items-center justify-center'>
                <form className='w-[80%] max-w-[400px]'>
                    <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
                        {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
                    </h1>
                    {
                        type !== 'sign-in' ?
                            <SignUp />
                            :
                            <SignIn />
                    }
                    <button
                        className='btn-dark center mt-14'
                        type='submit'
                    >
                        {type.replace('-', " ")}
                    </button>
                    <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black' />
                        <p>or</p>
                        <hr className='w-1/2 border-black' />
                    </div>
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                        <img src={google} alt="logo" className='w-5' />
                        Continue with google
                    </button>
                    {
                        type === 'sign-in' ?
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Don't have account?
                                <Link to='/signup' className='underline text-black text-xl ml-1'>Sign up here</Link>
                            </p>
                            :
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Already a member?
                                <Link to='/signin' className='underline text-black text-xl ml-1'>Sign in here</Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    )
}
