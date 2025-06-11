import { useContext, useRef } from 'react';
import { AnimationWrapper } from '../common/page-animation';
import InputBox from '../components/InputBox';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { authContext } from '../context/authContext';

const ChangePassword = () => {
    const changePasswordForm = useRef();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(changePasswordForm.current);
        const formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        const { currentPassword, newPassword } = formData;
        if (!currentPassword || !newPassword) {
            toast.error('Please fill all fields');
            return;
        }
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            console.log('Password validation failed', formData);
            toast.error('Password must be 6-20 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }
        e.target.setAttribute('disabled', true);
        let loadingToast = toast.loading('Updating...');
        try {
            await axios.post('http://localhost:3000/api/auth/change-password', { oldPassword: currentPassword, newPassword }, {
                withCredentials: true
            })
            toast.success('Password changed successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        }finally{
            e.target.removeAttribute('disabled');
            toast.dismiss(loadingToast);
            changePasswordForm.current.reset();
        }
    }
    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePasswordForm}>
                <h1 className='max-md:hidden'>Change Password</h1>
                <div className='py-10 w-full md:max-w-[400px]'>
                    <InputBox name='currentPassword' type='password' placeholder='Current Password' icon='fi-rr-unlock' />
                    <InputBox name='newPassword' type='password' placeholder='New Password' icon='fi-rr-unlock' />
                    <button onClick={handleSubmit} className='btn-dark px-10 ' type='submit'>Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword