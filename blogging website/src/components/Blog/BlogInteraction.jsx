import { useContext, useEffect } from 'react'
import { useBlog } from '../../context/blogContext'
import { Link } from 'react-router-dom';
import { authContext } from '../../context/authContext';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const BlogInteraction = () => {
  const { blog: { _id, blog_id, title, tags, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, setCommentsWrapper } = useBlog();
  const { authUser, isValid } = useContext(authContext) || {};
  const username = authUser?.username || '';

  useEffect(()=>{
    if(isValid){
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/interaction/is-liked-by-user`,{_id},{
        withCredentials:true
      }).then(({data:{liked_by_user}})=>{
        setIsLikedByUser(Boolean(liked_by_user));
      }).catch((error)=>{
        console.error('Error fetching like status:', error);
        toast.error('Failed to fetch like status');
      });
    }
  },[])

  const handleLike = async () => {
    if (!isValid) {
      toast.error('Please login to like this blog');
      return;
    } else {
      if (isLikedByUser) {
        setIsLikedByUser(false);
        setBlog((prev) => ({
          ...prev,
          activity: {
            ...prev.activity,
            total_likes: prev.activity.total_likes - 1
          }
        }))
      } else {
        setIsLikedByUser(true);
        setBlog((prev) => ({
          ...prev,
          activity: {
            ...prev.activity,
            total_likes: prev.activity.total_likes + 1
          }
        }))
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/interaction/like-blog`, { _id, isLikedByUser }, {
          withCredentials: true
        });
        toast.success(response.data.message);
      } catch (error) {
        toast.error('Failed to update like status');
      }
    }

  }

  return (
    <>
      <Toaster />
      <hr className='border-grey my-2' />
      <div className='flex gap-6 justify-between'>
        <div className='flex gap-3 items-center'>
          <button
            onClick={handleLike}
            className={'w-10 h-10 rounded-full flex items-center justify-center ' + (isLikedByUser ? 'bg-red/20 text-red' : 'bg-grey/80')}
          >
            <i className={`fi fi-${isLikedByUser ? 'sr' : 'rr'}-heart`}></i>
          </button>
          <p className='text-xl text-dark-grey'>{total_likes}</p>
          <button
            onClick={() => setCommentsWrapper((prev) => !prev)}
            className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'
          >
            <i className='fi fi-rr-comment-dots'></i>
          </button>
          <p className='text-xl text-dark-grey'>{total_comments}</p>
        </div>
        <div className='flex gap-6 items-center'>
          {
            username === author_username ? <Link to={`/editor/${blog_id}`} className='underline hover:text-purple'>Edit</Link> : null
          }
          <Link to={`http://twitter.com/share?text=Read ${title}&url=${location.href}&hashtags=${tags[0]}`}><i className='fi fi-brands-twitter text-xl hover:text-twitter'></i></Link>
        </div>
      </div>
      <hr className='border-grey my-2' />
    </>
  )
}

export default BlogInteraction