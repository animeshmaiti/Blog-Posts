import React, { useEffect, useState } from 'react'
import { AnimationWrapper } from '../common/page-animation'
import { InPageNavigation } from '../components/InPageNavigation'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPost/BlogPostCard'
import MinimalBlogPost from '../components/BlogPost/MinimalBlogPost'
import NoDataMessage from '../components/NoDataMessage'
import LoadMoreDataBtn from '../components/BlogPost/LoadMoreDataBtn'
import axios from 'axios'
import { filterPaginationData } from '../common/filterPaginationData'

export const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [countData, setCountData] = useState(null);
  const [pageState, setPageState] = useState('home');
  const categories = ['programming', 'hollywood', 'film making', 'social media', 'cooking', 'tech', 'finance', 'travel'];
  const fetchLatestBlogs = async ({ page = 1 }) => {
    // console.log(page);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/latest-blogs`, { page });
      const blogsData = response.data.blogs;
      // console.log(blogsData);
      let formattedData = await filterPaginationData({
        create_new_arr: page === 1,  // force reset if it's the first page
        state: countData,
        data: blogsData,
        page,
        countRoute: '/blog/all-latest-blogs-count'
      });
      // console.log(formattedData);
      setCountData(formattedData);
      setBlogs(formattedData.results);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchBlogsByCategory = async ({ category, page = 1 }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/blog/search-blogs`, {
        tag: category,
        page: page
      });
      const blogsData = response.data.blogs;
      // console.log(blogsData);
      let formattedData = await filterPaginationData({
        create_new_arr: page === 1,
        state: countData,
        data: blogsData,
        page,
        countRoute: '/blog/search-blogs-count',
        data_to_send: { tag: category }
      });
      setBlogs(formattedData.results);
      setCountData(formattedData);

    } catch (error) {
      console.error(error);
    }
  }
  const fetchTrendingBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/trending-blogs`);
      const blogs = response.data.blogs;
      // console.log(blogs);
      setTrendingBlogs(blogs);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    setBlogs(null);
  }, [pageState]);

  useEffect(() => {
    if (pageState === 'home') {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ category: pageState, page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState])

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();
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
            <>
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
              <LoadMoreDataBtn state={countData} fetchDataFun={({ page }) =>
                pageState === 'home'
                  ? fetchLatestBlogs({ page })
                  : fetchBlogsByCategory({ category: pageState, page })} />
            </>
            {
              trendingBlogs === null ? (
                <Loader />
              ) : (trendingBlogs.length ?
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
