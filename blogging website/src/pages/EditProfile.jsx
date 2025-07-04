import { useContext, useEffect, useRef, useState } from 'react';
import { authContext } from '../context/authContext';
import axios from 'axios';
import { AnimationWrapper } from '../common/page-animation';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/InputBox';
import { uploadImage } from '../common/aws';

const EditProfile = () => {
  const { authUser, setAuthUser, isValid } = useContext(authContext);
  let bioLimit = 200;
  const profileImgEle = useRef();
  const editProfileForm = useRef();
  const profileDataStructure = {
    personal_info: {
      fullname: '',
      email: '',
      username: '',
      bio: '',
      profile_img: '',
    },
    social_links: {
      youtube: '',
      instagram: '',
      facebook: '',
      x: '',
      github: '',
      website: '',
    },
    account_info: {
      total_posts: 0,
      total_reads: 0,
    },
    joinedAt: '',
  };
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updateProfileImg, setUpdateProfileImg] = useState(null);

  const {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profile;

  const handleBioChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/get-profile`,
        { username: authUser.username }
      );
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    profileImgEle.current.src = URL.createObjectURL(file);
    setUpdateProfileImg(file);
  };

  const handleImgUpload = async (e) => {
    e.preventDefault();
    if (!updateProfileImg) {
      toast.error('Please select an image to upload');
      return;
    }
    const loadingToast = toast.loading('Uploading image...');
    e.target.setAttribute('disabled', true);
    try {
      const imgUrl = await uploadImage(updateProfileImg);
      if (imgUrl) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile-img`, { url: imgUrl }, {
          withCredentials: true
        });
        const data = response.data;
        const newUserAuth = { ...authUser, profile_img: data.profile_img };
        sessionStorage.setItem('user', JSON.stringify(newUserAuth));
        setAuthUser(newUserAuth);
        setUpdateProfileImg(null);
        toast.dismiss(loadingToast);
      }
      e.target.removeAttribute('disabled');
      toast.success('Image updated successfully 👍!');
    } catch (error) {
      e.target.removeAttribute('disabled');
      toast.error('Failed to upload image');
      console.log('Error uploading image:', error);
    } finally {
      toast.dismiss(loadingToast);
      e.target.removeAttribute('disabled');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData(editProfileForm.current);
    const formData = {};
    form.forEach((value, key) => {
      formData[key] = value;
    });
    const { username, bio, youtube, facebook, x, github, instagram, website } = formData;
    if (username.length < 3 || username.length > 20) {
      toast.error('Username must be between 3 and 20 characters');
      return;
    }
    if (bio.length > bioLimit) {
      toast.error(`Bio must be less than ${bioLimit} characters`);
      return;
    }
    const loadingToast = toast.loading('Updating profile...');
    e.target.setAttribute('disabled', true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/update-profile`, {
        username, bio,
        social_links: {
          youtube,
          facebook,
          x,
          github,
          instagram,
          website
        }
      }, {
        withCredentials: true
      });
      const data = response.data;
      if(authUser.username !== data.username){
        const newUserAuth={...authUser,username:data.username};
        sessionStorage.setItem('user', JSON.stringify(newUserAuth));
        setAuthUser(newUserAuth);
      }
      toast.success('Profile updated successfully 👍!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      e.target.removeAttribute('disabled');
      toast.dismiss(loadingToast);
    }

  }

  useEffect(() => {
    if (isValid) {
      fetchUserProfile();
    }
  }, [isValid]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />
          <h1 className='max-md:hidden'>Edit Profile</h1>
          <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
            <div className='max-lg:center mb-5'>
              <label
                htmlFor='uploadImg'
                className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'
              >
                <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                  Upload Image
                </div>
                <img src={profile_img} alt='' ref={profileImgEle} />
              </label>
              <input
                type='file'
                id='uploadImg'
                accept='.jpeg, .png, .jpg'
                hidden
                onChange={handleImageChange}
              />
              <button className='btn-light mt-5 max-lg:center lg:w-full px-10' onClick={handleImgUpload}>
                Upload
              </button>
            </div>
            <div className='w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                <div>
                  <InputBox
                    name='fullname'
                    type='text'
                    value={fullname}
                    placeholder='Full Name'
                    disable={true}
                    icon='fi-rr-user'
                  />
                </div>
                <div>
                  <InputBox
                    name='email'
                    type='email'
                    value={email}
                    placeholder='Email'
                    disable={true}
                    icon='fi-rr-envelope'
                  />
                </div>
              </div>
              <InputBox
                type='text'
                name='username'
                value={profile_username}
                placeholder='Username'
                icon='fi-rr-at'
              />
              <p className='text-dark-grey -mt-3'>
                username will be used to search your profile, and it will be
                public.
              </p>
              <textarea name='bio' maxLength={bioLimit} defaultValue={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' placeholder='Bio' onChange={handleBioChange}></textarea>
              <p className='mt-1 text-dark-grey'>{charactersLeft} Characters Left</p>
              <p className='my-6 text-dark-grey'>Add Your Social handles bellow</p>
              <div className='md:grid md:grid-cols-2 gap-x-6'>
                {
                  Object.entries(social_links).map(([key, value]) => (
                    <InputBox
                      key={key}
                      name={key}
                      type='text'
                      value={value}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      icon={key === 'website' ? 'fi-rr-globe' : key === 'x' ? 'fi-brands-twitter' : `fi-brands-${key}`}
                    />
                  ))
                }
              </div>
              <button className='btn-dark w-auto px-10' type='submit' onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
