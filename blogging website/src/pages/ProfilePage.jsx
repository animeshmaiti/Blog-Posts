import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimationWrapper } from '../common/page-animation';
import Loader from '../components/Loader';
import { authContext } from '../context/authContext';
import AboutUser from '../components/AboutUser';

const ProfilePage = () => {
  const { authUser:{username} } = useContext(authContext);
  const profileDataStructure = {
    personal_info: {
      fullname: "",
      email: "",
      username: "",
      bio: "",
      profile_img: ""
    },
    social_links: {
      youtube: "",
      instagram: "",
      facebook: "",
      twitter: "",
      github: "",
      website: ""
    },
    account_info: {
      total_posts: 0,
      total_reads: 0
    },
    joinedAt: "",
  }
  const { id: profileID } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/get-profile', { username: profileID });
      const profileData = response.data;
      setProfile(profileData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [profileID]);

  return (
    <AnimationWrapper>
      {
        loading ? <Loader /> :
          <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
            <div className='flex flex-col max-md:items-center gap-5 min-w-[250px]'>
              <img src={profile_img} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' referrerPolicy='no-referrer' />
              <h1 className='text-2xl font-medium'>@{profile_username}</h1>
              <p className='text-xl capitalize h-6'>{fullname}</p>
              <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} - Reads</p>
              <div className='flex gap-4 mt-2'>
                {
                  profileID===username?
                  <Link to='/settings/edit-profile' className='btn-light rounded-md'>Edit Profile</Link>:""
                }
              </div>
              <AboutUser className='max-md:hidden' bio={bio} social_links={social_links} joinedAt={joinedAt}/>
            </div>
          </section>
      }
    </AnimationWrapper>
  )
}

export default ProfilePage