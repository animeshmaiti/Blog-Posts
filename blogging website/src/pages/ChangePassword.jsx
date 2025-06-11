import { useRef } from 'react';
import { AnimationWrapper } from '../common/page-animation';
import InputBox from '../components/InputBox';
import toast, { Toaster } from 'react-hot-toast';

const ChangePassword = () => {
    const changePasswordForm = useRef();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const handleSubmit = (e) => {
        e.preventDefault();
        const form=new FormData(changePasswordForm.current);
        const formData={};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        const {currentPassword, newPassword} = formData;
        if(!currentPassword || !newPassword){
            toast.error('Please fill all fields');
            return;
        }
        if (!passwordRegex.test(ChangePassword)|| !passwordRegex.test(newPassword)) {
            toast.error('Password must be 6-20 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }
    }
    return (
        <AnimationWrapper>
            <Toaster/>
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