import { SignUpInput } from '../components/InputForm/SignUpInput'
import google from '@assets/google.png'
import { Link, Navigate } from 'react-router-dom'
import { SignInInput } from '../components/InputForm/SignInInput'
import { AnimationWrapper } from '../common/page-animation'
import { Toaster, toast } from 'react-hot-toast'
import { useAuth } from '../context/authContext'

export const UserAuthForm = ({ type }) => {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const { Login, SignUp, isValid, GoogleAuth } = useAuth();

    const handleSubmitLogin = async () => {
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        // console.log(data);
        const { email, password } = data;
        if (!email || !password) {
            return toast.error('Please fill the all fields');
        }
        if (!emailRegex.test(email)) {
            return toast.error('Email is not valid');
        }
        if (!passwordRegex.test(password)) {
            return toast.error('Incorrect Password');
        }
        Login(data);

    }


    const handleSubmitSignUp = async () => {
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        // console.log(data);
        const { fullname, email, password, cPassword } = data;
        if (!fullname || !email || !password || !cPassword) {
            return toast.error('Please fill the all fields');
        }
        if (fullname.length < 3) {
            return toast.error("Full name must be at least 3 characters long");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Email is not valid");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password must be at least 6 characters and at least one uppercase letter, one lowercase letter, and one number");
        }
        if (password !== cPassword) {
            return toast.error("Passwords do not match");
        }
        delete data.cPassword;
        console.log(data);
        SignUp(data);
    }

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        GoogleAuth();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(type);
        if (type === 'sign-in') {
            handleSubmitLogin();
        } else {
            handleSubmitSignUp();
        }
    }

    return (isValid ? Navigate('/') :
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex items-center justify-center'>
                <Toaster />
                <form id='formElement' className='w-[80%] max-w-[400px]'>
                    <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
                        {type === 'sign-in' ? 'Welcome back' : 'Join us today'}
                    </h1>
                    {
                        type !== 'sign-in' ?
                            <SignUpInput />
                            :
                            <SignInInput />
                    }
                    <button
                        className='btn-dark center mt-14'
                        type='submit'
                        onClick={handleSubmit}
                    >
                        {type.replace('-', ' ')}
                    </button>
                    <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black' />
                        <p>or</p>
                        <hr className='w-1/2 border-black' />
                    </div>
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' on onClick={handleGoogleAuth}>
                        <img src={google} alt='logo' className='w-5' />
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
