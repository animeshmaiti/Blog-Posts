import React from 'react';
import { getDay } from '../../common/date';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ content, author }) => {

  const { publishedAt, tags, title, desc, banner, activity: { total_likes }, blog_id: id } = content;
  const { fullname, profile_img, username } = author;
  return (
    <Link
      to={`/blog/${id}`}
      className='flex gap-8 items-center border-b border-grey pb-5 mb-4'
    >
      <div className='w-full'>
        <div className='flex gap-2 items-center mb-7'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clam-1'>
            {fullname} @{username}
          </p>
          <p className='min-w-fit'>{getDay(publishedAt)}</p>
        </div>
        <h1 className='blog-title'>{title}</h1>
        <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>
          {desc}
        </p>
        <div className='flex gap-4 mt-7'>
          {
              tags.map((tag, index) => {
                return (
                  <span key={index} className='btn-light py-1 px-4'>
                    {tag}
                  </span>
                )
              })
          }
          <span className='ml-3 flex items-center gap-2 text-dark-grey'>
            <i className='fi fi-rr-heart text-xl'></i>
            {total_likes}
          </span>
        </div>{' '}
      </div>
      <div className='h-28 aspect-square bg-grey'>
        <img
          src={banner}
          className='w-full h-full aspect-square object-cover'
          onError={(e) => console.error('Error loading image:', e)}
        />
      </div>
    </Link>
  )
}

export default BlogPostCard
