import { useParams } from 'react-router-dom';
import { InPageNavigation } from '../components/InPageNavigation';
import { AnimationWrapper } from '../common/page-animation';
import BlogPostCard from '../components/BlogPost/BlogPostCard';
import NoDataMessage from '../components/BlogPost/NoDataMessage';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import { filterPaginationData } from '../common/filterPaginationData';
import LoadMoreDataBtn from '../components/BlogPost/LoadMoreDataBtn';
import UserCard from '../components/UserCard';



const SearchPage = () => {

  const { query } = useParams()

  const [blogs, setBlogs] = useState(null);
  const [countData, setCountData] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/blog/search-blogs', {
        query: query,
        page: page
      });
      const blogsData = response.data.blogs;
      // console.log(blogsData);
      let formattedData = await filterPaginationData({
        create_new_arr,
        state: countData,
        data: blogsData,
        page,
        countRoute: '/api/blog/search-blogs-count',
        data_to_send: { query: query }
      });
      // console.log(formattedData);
      if (response.status === 200) {
        setBlogs(formattedData.results);
        setCountData(formattedData);
      } else {
        toast.error('Failed to fetch blogs by category');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const searchUsers = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/search-users', { query });
      const usersData = response.data.users;
      setUsers(usersData);
      console.log(usersData);
    } catch (error) {

    }
  }

  const UserCardWrapper = () => {
    return (
      <>
        {
          users === null ? <Loader /> :
            users.length ? users.map((user, index) => {
              return <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.8 }}>
                <UserCard user={user} />
              </AnimationWrapper>
            }) :
              <NoDataMessage message="No users matched" />
        }
      </>
    )
  }

  useEffect(() => {
    setBlogs(null);
    setUsers(null);
    searchBlogs({ page: 1, create_new_arr: true })
    searchUsers();
  }, [query])
  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for "${query}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
        >
          <>
            {blogs === null ? (
              <Loader />
            ) : blogs.length ? (
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
            ) : (
              <NoDataMessage message="No blogs published" />
            )}
            <LoadMoreDataBtn
              state={countData}
              fetchDataFun={searchBlogs}
            />
          </>
          <UserCardWrapper />
        </InPageNavigation>
      </div>
      <div className='min-w-[40%] lg:min-w-[250px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
        <h1 className='font-medium text-xl mb-8'>User related to search <i className='fi fi-rr-user mt-1'></i></h1>
        <UserCardWrapper/>
      </div>
    </section>
  )
}

export default SearchPage
