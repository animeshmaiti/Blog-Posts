import { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/authContext'
import axios from 'axios';
import { AnimationWrapper } from '../common/page-animation';
import Loader from '../components/Loader';
import { Toaster } from 'react-hot-toast';
import InputBox from '../components/InputBox';


const EditProfile = () => {
    const { authUser, isValid } = useContext(authContext);
    const profileDataStructure = {
        personal_info: {
            fullname: '',
            email: '',
            username: '',
            bio: '',
            profile_img: ''
        },
        social_links: {
            youtube: '',
            instagram: '',
            facebook: '',
            twitter: '',
            github: '',
            website: ''
        },
        account_info: {
            total_posts: 0,
            total_reads: 0
        },
        joinedAt: '',
    }
    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const {personal_info:{fullname,username:profile_username,profile_img,email,bio},social_links}=profile;
    const fetchUserProfile = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/user/get-profile', { username: authUser.username });
            setProfile(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
    useEffect(() => {
        if (isValid) {
            fetchUserProfile();
        }
    }, [isValid]);
    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : (
                    <form action="">
                        <Toaster/>
                        <h1 className='max-md:hidden'>Edit Profile</h1>
                        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                            <div className='max-lg:center mb-5'>
                                <label htmlFor='uploadImg' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                    <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                                        Upload Image
                                    </div>
                                    <img src={profile_img} alt="" />
                                </label>
                                <input type='file' id='uploadImg' accept='.jpeg, .png, .jpg' hidden/>
                                <button className='btn-light mt-5 max-lg:center lg:w-full px-10'>Upload</button>
                            </div>
                            <div className='w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                    <div>
                                        <InputBox name='fullname' type='text' value={fullname} placeholder='Full Name' disable={true} icon='fi-rr-user'/>
                                    </div>
                                    <div>
                                        <InputBox name='email' type='email' value={email} placeholder='Email' disable={true} icon='fi-rr-envelope'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
        </AnimationWrapper>
    )
}

export default EditProfile