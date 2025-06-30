import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const ManagePublishedBlogCard = ({blog}) => {
    const{banner,blog_id,title,publishedAt}=blog||{};
  return (
   <>
    <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
        <img src={banner} className='max-md:hidden lg:hidden xl:block w-28 flex-none object-cover' />
        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
            <div>
                <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline'>{title}</Link>
                <p className='line-clamp-1'>Published On {getDay(publishedAt)} </p>
            </div>
        </div>
    </div>
   </>
  )
}

export default ManagePublishedBlogCard