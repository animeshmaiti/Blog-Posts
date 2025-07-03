import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { filterPaginationData } from '../common/filterPaginationData';
import { authContext } from '../context/authContext';
import { Toaster } from 'react-hot-toast';
import { InPageNavigation } from '../components/InPageNavigation';
import Loader from '../components/Loader';
import NoDataMessage from '../components/NoDataMessage';
import { AnimationWrapper } from '../common/page-animation';
import ManagePublishedBlogCard from '../components/ManagePublishedBlogCard';
import ManageDraftBlogPost from '../components/ManageDraftBlogPost';
import { useSearchParams } from 'react-router-dom';

const ManageBlogs = () => {
    const { isValid } = useContext(authContext);
    let redirectToTab = useSearchParams()[0].get('tab');
    const [activeTab, setActiveTab] = useState(0);
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState('');

    const getBlogs = async ({ page, draft, deleteCount = 0 }) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/create/user-written-blogs',
                { page, draft, query, deleteCount },
                {
                    withCredentials: true,
                }
            );
            const {
                data: { blogs: data },
            } = response;
            const formattedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data,
                page,
                countRoute: '/api/create/user-written-blogs-count',
                data_to_send: { draft, query },
                verify: true,
            });
            console.log(formattedData, draft);
            if (draft) {
                setDrafts(formattedData);
            } else {
                setBlogs(formattedData);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleSearch = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (e.key === 'Enter' && searchQuery.length > 0) {
            setBlogs(null);
            setDrafts(null);
        }
    };
    const handleChange = (e) => {
        if (e.target.value.length === 0) {
            setQuery('');
            setBlogs(null);
            setDrafts(null);
        }
    };
    const deleteBlog = async (blog, target) => {
        const { index, blog_id, setStateFun } = blog;
        target.setAttribute('disabled', true);
        try {
            await axios.post(
                'http://localhost:3000/api/create/delete-blog',
                { blog_id },
                {
                    withCredentials: true,
                }
            );
            target.removeAttribute('disabled');
            setStateFun(prev => {
                let { deletedDocCount, totalDocs, results } = prev;
                results.splice(index, 1);
                if (!deletedDocCount) {
                    deletedDocCount = 0;
                }
                console.log({
                    ...prev,
                    totalDocs: totalDocs - 1,
                    deletedDocCount: deletedDocCount + 1,
                });
                return {
                    ...prev,
                    totalDocs: totalDocs - 1,
                    deletedDocCount: deletedDocCount + 1,
                };
            })
        } catch (error) {
            console.error('Error deleting blog:', error);
            target.removeAttribute('disabled');
            return;
        }
    };
    useEffect(() => {
        if (redirectToTab === 'draft') {
            setActiveTab(1);
        }
        if (isValid) {
            getBlogs({ page: 1, draft: false });
            getBlogs({ page: 1, draft: true });
        }
    }, [isValid, query]);
    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>
            <Toaster />
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search blogs..."
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>
            <InPageNavigation routes={['Published Blogs', 'Drafts']} activeIndex={activeTab} onTabChange={setActiveTab}>
                {blogs === null ? (
                    <Loader />
                ) : blogs.results.length ? (
                    <>
                        {blogs.results.map((blog, i) => {
                            return (
                                <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                    <ManagePublishedBlogCard
                                        blog={{ ...blog, index: i, setStateFun: setBlogs }}
                                        deleteFun={deleteBlog}
                                    />
                                </AnimationWrapper>
                            );
                        })}
                    </>
                ) : (
                    <NoDataMessage message="No published blogs" />
                )}
                {
                    // Drafts Section
                    drafts === null ? (
                        <Loader />
                    ) : drafts.results.length ? (
                        <>
                            {drafts.results.map((blog, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                        <ManageDraftBlogPost
                                            blog={{ ...blog, index: i, setStateFun: setDrafts }}
                                            deleteFun={deleteBlog}
                                        />
                                    </AnimationWrapper>
                                );
                            })}
                        </>
                    ) : (
                        <NoDataMessage message="No draft blogs" />
                    )
                }
            </InPageNavigation>
        </>
    );
};

export default ManageBlogs;
