import React, { useEffect, useState } from 'react'
import { AnimationWrapper } from '../common/page-animation'
import { InPageNavigation } from '../components/InPageNavigation'
import { useBlog } from '../context/blogContext'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPost/BlogPostCard'
import MinimalBlogPost from '../components/BlogPost/MinimalBlogPost'
import NoDataMessage from '../components/BlogPost/NoDataMessage'

export const HomePage = () => {
  const { fetchLatestBlogs, fetchTrendingBlogs, fetchBlogsByCategory, setBlogs, blogs, trendingBlogs } = useBlog()
  const categories = ['programming', 'hollywood', 'film making', 'social media', 'cooking', 'tech', 'finance', 'travel'];
  const [pageState, setPageState] = useState('home')
  useEffect(() => {
    if (pageState === 'home') {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory(pageState);
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState])

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState === category) {
      setPageState('home');
      return;
    }
    setPageState(category);
  }

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, 'trending']}
            defaultHidden={['trending']}
          >
            {blogs === null ? (
              <Loader />
            ) : (
              blogs.length ?
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
                }) : <NoDataMessage message='No blogs published' />
            )}
            {
              trendingBlogs === null ? (
                <Loader />
              ) : ( trendingBlogs.length ?
                trendingBlogs.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: index * 0.1 }}
                      key={index}
                    >
                      <MinimalBlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  )
                }): <NoDataMessage message='No trending blogs' />
              )
            }
          </InPageNavigation>
        </div>
        {/* filters and trending */}
        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
          <div className="flex flex-col gap-10">
            <div>
              <h1 className='font-medium text-xl mb-8'>Stories from all interests</h1>
              <div className='flex flex-wrap gap-3'>
                {
                  categories.map((category, index) => {
                    return (
                      <button
                        onClick={loadBlogByCategory}
                        key={index}
                        className={'tag' + (pageState === category ? ' bg-black text-white' : '')}
                      >
                        {category}
                      </button>
                    )
                  })
                }
              </div>
            </div>

            <div>
              <h1 className='font-medium text-xl mb-8'>
                Trending <i className='fi fi-rr-arrow-trend-up'></i>
              </h1>
              {
                trendingBlogs === null ? (
                  <Loader />
                ) : (
                  trendingBlogs.length ?
                    trendingBlogs.map((blog, index) => {
                      return (
                        <AnimationWrapper
                          transition={{ duration: 1, delay: index * 0.1 }}
                          key={index}
                        >
                          <MinimalBlogPost blog={blog} index={index} />
                        </AnimationWrapper>
                      )
                    }) : <NoDataMessage message='No trending blogs' />
                )
              }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}
