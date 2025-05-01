import React, { useEffect } from 'react'
import { AnimationWrapper } from '../common/page-animation'
import { InPageNavigation } from '../components/InPageNavigation'
import { useBlog } from '../context/blogContext'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPost/BlogPostCard'
import MinimalBlogPost from '../components/BlogPost/MinimalBlogPost'

export const HomePage = () => {
  const { fetchLatestBlogs, fetchTrendingBlogs, blogs, trendingBlogs } = useBlog()

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, [])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={['home', 'trending']}
            defaultHidden={['trending']}
          >
            {blogs === null ? (
              <Loader />
            ) : (
              blogs.map((blog, index) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: index * 0.1 }}
                    key={index}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                )
              })
            )}
            {
              trendingBlogs === null ? (
                <Loader />
              ) : (
                trendingBlogs.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: index * 0.1 }}
                      key={index}
                    >
                      <MinimalBlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  )
                })
              )
            }
          </InPageNavigation>
        </div>
        {/* filters and trending */}
        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
          <div className="flex flex-col gap-10">
            <h1 className=''></h1>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}
