import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { filterPaginationData } from '../common/filterPaginationData';
import { authContext } from '../context/authContext';
import { Toaster } from 'react-hot-toast';
import { InPageNavigation } from '../components/InPageNavigation';
import Loader from '../components/Loader';
import NoDataMessage from '../components/NoDataMessage';
import { AnimationWrapper } from '../common/page-animation';
import ManagePublishedBlogCard from '../components/ManagePublishedBlogCard';

const ManageBlogs = () => {
    const { isValid } = useContext(authContext);
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState('');

    const getBlogs = async ({ page, draft, deleteCount = 0 }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/create/user-written-blogs', { page, draft, query, deleteCount }, {
                withCredentials: true
            });
            const { data: { blogs: data } } = response;
            const formattedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data,
                page,
                countRoute: '/api/create/user-written-blogs-count',
                data_to_send: { draft, query },
                verify: true
            })
            console.log(formattedData, draft);
            if (draft) {
                setDrafts(formattedData);
            } else {
                setBlogs(formattedData);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (e.key === 'Enter' && searchQuery.length > 0) {
            setBlogs(null);
            setDrafts(null);
        }
    }
    const handleChange = (e) => {
        if (e.target.value.length === 0) {
            setQuery('');
            setBlogs(null);
            setDrafts(null);
        }
    }
    useEffect(() => {
        if (isValid) {
            if (!blogs) {
                getBlogs({ page: 1, draft: false });
            }
            if (!drafts) {
                getBlogs({ page: 1, draft: true });
            }
        }
    }, [isValid, blogs, drafts, query]);
    return (
        <>
            <h1 className='max-md:hidden'>Manage Blogs</h1>
            <Toaster />
            <div className='relative max-md:mt-5 md:mt-8 mb-10'>
                <input
                    type='search'
                    className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
                    placeholder='Search blogs...'
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>
            <InPageNavigation routes={['Published Blogs', 'Drafts']}>
                {
                    blogs === null ? <Loader /> :
                        blogs.results.length ?
                            <>
                                {
                                    blogs.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                                <ManagePublishedBlogCard blog={blog}/>
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                            </>
                            : <NoDataMessage message='No published blogs' />
                }
            </InPageNavigation>
        </>
    )
}

export default ManageBlogs