import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimationWrapper } from '../common/page-animation';
import Loader from '../components/Loader';
import { authContext } from '../context/authContext';
import AboutUser from '../components/AboutUser';
import { filterPaginationData } from '../common/filterPaginationData';
import { InPageNavigation } from '../components/InPageNavigation';
import NoDataMessage from '../components/NoDataMessage';
import LoadMoreDataBtn from '../components/BlogPost/LoadMoreDataBtn';
import BlogPostCard from '../components/BlogPost/BlogPostCard';
import PageNotFound from './PageNotFound'; 

const ProfilePage = () => {
  const { username } = useContext(authContext)?.authUser || {};
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
      x: "",
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
  const [profileLoaded, setProfileLoaded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [countData, setCountData] = useState(null);
  const { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

  const getBlogs = async ({ page = 1, user_id }) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/blog/search-blogs', { page, author: user_id });
      const blogsData = response.data.blogs;
      let formattedData = await filterPaginationData({
        create_new_arr: page === 1,
        state: countData,
        data: blogsData,
        page,
        countRoute: '/api/blog/search-blogs-count',
        data_to_send: { author: user_id }
      });
      if (response.status === 200) {
        // formattedData.user_id = user_id;
        setCountData(formattedData);
        setBlogs(formattedData.results);
        setLoading(false);
      } else {
        toast.error('Failed to fetch latest blogs');
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/get-profile', { username: profileID });
      console.log(response.data);
      const profileData = response.data;
      if (!profileData || !profileData._id) {
        setProfileLoaded(false);
        return;
      }
      setProfile(profileData);
      setProfileLoaded(profileData._id);
      await getBlogs({ user_id: profileData._id });
    } catch (err) {
      console.log(err);
      setProfileLoaded(false);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUserProfile();
  }, [profileID]);
  if (!loading && profileLoaded === false) {
    return (
      <AnimationWrapper>
        <PageNotFound/>
      </AnimationWrapper>
    );
  }
  return (
    <AnimationWrapper>
      {
        loading ? <Loader /> :
          <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
            <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] py-10'>
              <img src={profile_img} className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' referrerPolicy='no-referrer' />
              <h1 className='text-2xl font-medium'>@{profile_username}</h1>
              <p className='text-xl capitalize h-6'>{fullname}</p>
              <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} - Reads</p>
              <div className='flex gap-4 mt-2'>
                {
                  profileID === username ?
                    <Link to='/settings/edit-profile' className='btn-light rounded-md'>Edit Profile</Link> : ""
                }
              </div>
              <AboutUser className='max-md:hidden' bio={bio} social_links={social_links} joinedAt={joinedAt} />
            </div>
            <div className="max-md:mt-12 w-full">
              <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                <>
                  {
                    blogs == null ? (<Loader />) : (blogs.length ?
                      blogs.map((blog, i) => {

                        return (
                          <AnimationWrapper
                            key={i}
                            transition={{ duration: 1, delay: i * .1 }}
                          >
                            <BlogPostCard
                              content={blog}
                              author={blog.author.personal_info}
                            />
                          </AnimationWrapper>
                        );
                      })
                      : <NoDataMessage message="No Blogs Published" />
                    )}
                  <LoadMoreDataBtn state={countData} fetchDataFun={
                    ({ page }) =>
                      getBlogs({ user_id: profileLoaded, page })
                  }
                  />
                </>
                <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
              </InPageNavigation>
            </div>
          </section>
      }
    </AnimationWrapper>
  )
}

export default ProfilePage