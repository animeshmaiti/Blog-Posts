import React from 'react'

export const SignInInput = ({ email, password }) => {
    return (
        <>
            <div className='relative w-[100%] mb-4'>
                <input
                    name='email'
                    type='email'
                    placeholder='Email'
                    defaultValue={email}
                    className='input-box'
                />
                <i className='fi fi-rr-envelope input-icon'></i>
            </div>
            <div className='relative w-[100%] mb-4'>
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    defaultValue={password}
                    className='input-box'
                />
                <i className='fi fi-rr-key input-icon'></i>
            </div>
        </>
    )
}
