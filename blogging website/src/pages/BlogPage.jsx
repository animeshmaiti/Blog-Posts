import { Link, useParams } from 'react-router-dom';
import { useBlog } from '../context/blogContext';
import { useEffect, useState } from 'react';
import { AnimationWrapper } from '../common/page-animation';
import Loader from '../components/Loader';
import { getDay } from '../common/date';
import BlogInteraction from '../components/Blog/BlogInteraction';

const BlogPage = () => {
    const blogDataStructure = {
        title: '',
        desc: '',
        content: [],

        author: { personal_info: {} },
        banner: '',
        publishedAt: '',
        comments: { results: [] },

        activity: {
            total_comments: [],
            total_likes: [],
        },
    }
    const { blog_id } = useParams();
    const { fetchBlog,loading } = useBlog();
    const [blog, setBlog] = useState(blogDataStructure);
    const { title, content, banner, author: { personal_info: { fullname, username:author_username, profile_img } }, publishedAt } = blog;
    useEffect(() => {
        const fetchData = async () => {
            const blogData = await fetchBlog(blog_id);
            setBlog(blogData);
        }
        fetchData();
    }, [blog_id]);
    return (
        <AnimationWrapper>
            {
                loading ? <Loader/>:
                <div className='max-w-[900px] center pt-10 max-lg:px-[5vw]'>
                    <img src={banner} className='aspect-video' />
                    <div className='mt-12'>
                        <h2>{title}</h2>
                        <div className='flex max-sm:flex-col justify-between my-8'>
                            <div className='flex gap-5 items-start'>
                                <img src={profile_img} className='w-12 h-12 rounded-full' />
                                <p className='capitalize'>
                                    {fullname} <br />
                                    @
                                    <Link to={`/user/${author_username}`} className='underline'>{author_username}</Link>
                                </p>
                            </div>
                            <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
                        </div>
                    </div>

                    <BlogInteraction/>
                </div>
            }
        </AnimationWrapper>
    )
}

export default BlogPage