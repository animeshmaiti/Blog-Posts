

export const SignUpInput = ({ fullname, email, password, cPassword }) => {
    return (
        <>
            <div className='relative w-[100%] mb-4'>
                <input
                    name='fullname'
                    type='text'
                    placeholder='Full Name'
                    defaultValue={fullname}
                    className='input-box'
                />
                <i className='fi fi-rr-user input-icon'></i>
            </div>
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
            <div className='relative w-[100%] mb-4'>
                <input
                    name='cPassword'
                    type='password'
                    placeholder='Confirm Password'
                    defaultValue={cPassword}
                    className='input-box'
                />
                <i className='fi fi-rr-key input-icon'></i>
            </div>
        </>
    )
}
