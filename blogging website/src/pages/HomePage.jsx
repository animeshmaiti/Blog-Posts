import React, { useEffect } from 'react'
import { AnimationWrapper } from '../common/page-animation'
import { InPageNavigation } from '../components/InPageNavigation'
import { useBlog } from '../context/blogContext'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPost/BlogPostCard'

export const HomePage = () => {
  const { fetchLatestBlogs, blogs } = useBlog()
  
  useEffect(() => {
    fetchLatestBlogs()
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
            <h1>Trending blogs</h1>
          </InPageNavigation>
        </div>
        {/* filters and trending */}
        <div></div>
      </section>
    </AnimationWrapper>
  )
}
