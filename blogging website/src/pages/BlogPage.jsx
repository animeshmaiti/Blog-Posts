import { Link, useParams } from 'react-router-dom'
import { useBlog } from '../context/blogContext'
import { useEffect, useState } from 'react'
import { AnimationWrapper } from '../common/page-animation'
import Loader from '../components/Loader'
import { getDay } from '../common/date'
import BlogInteraction from '../components/Blog/BlogInteraction'
import BlogPostCard from '../components/BlogPost/BlogPostCard'
import BlogContent from '../components/Blog/BlogContent'

const BlogPage = () => {
  const { blog_id } = useParams()
  const { fetchBlog, loading, blog, similarBlogs } = useBlog()

  const {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;
  useEffect(() => {
    fetchBlog(blog_id)
  }, [blog_id]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center pt-10 max-lg:px-[5vw]">
          <img src={banner} className="aspect-video" />
          <div className="mt-12">
            <h2>{title}</h2>
            <div className="flex max-sm:flex-col justify-between my-8">
              <div className="flex gap-5 items-start">
                <img src={profile_img} className="w-12 h-12 rounded-full" />
                <p className="capitalize">
                  {fullname} <br />@
                  <Link to={`/user/${author_username}`} className="underline">
                    {author_username}
                  </Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published on {getDay(publishedAt)}
              </p>
            </div>
          </div>

          <BlogInteraction />
          <div className='my-12 front-gelasio blog-page-content'>
            {
              content[0].blocks.map((block, index) => {
                return (
                  <div key={index} className='my-4 md:my-8'>
                    <BlogContent block={block} />
                  </div>
                )
              })
            }
          </div>
          <BlogInteraction />
          {similarBlogs && similarBlogs.length > 0 && (
            <>
              <h1 className="text-2xl mt-14 mb-10 font-medium">
                Similar Blogs
              </h1>
              {similarBlogs.map((blog, index) => {
                const {
                  author: { personal_info },
                } = blog
                return (
                  <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.08 }}>
                    <BlogPostCard content={blog} author={personal_info} />
                  </AnimationWrapper>
                )
              })}
            </>
          )}
        </div>
      )}
    </AnimationWrapper>
  )
}

export default BlogPage
