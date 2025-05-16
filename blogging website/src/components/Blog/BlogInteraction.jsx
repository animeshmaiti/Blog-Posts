import React, { useContext } from 'react'
import { useBlog } from '../../context/blogContext'
import { Link } from 'react-router-dom';
import { authContext } from '../../context/authContext';

const BlogInteraction = () => {
  const { blog: { blog_id, title,tags, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog } = useBlog();
  let {authUser:{username}}=useContext(authContext);
  return (
    <>
      <hr className='border-grey my-2' />
      <div className='flex gap-6 justify-between'>
        <div className='flex gap-3 items-center'>
          <button
            className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'
          >
            <i className='fi fi-rr-heart'></i>
          </button>
          <p className='text-xl text-dark-grey'>{total_likes}</p>
          <button
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