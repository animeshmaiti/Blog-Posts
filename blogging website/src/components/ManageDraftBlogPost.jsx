import { Link } from "react-router-dom";

const ManageDraftBlogPost = ({ blog, index }) => {
    const { title, desc,blog_id } = blog || {};
    return (
        <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? '0' + index : index}</h1>
            <div>
                <h1 className='blog-title mb-3'>{title}</h1>
                <p className='line-clamp-2 font-gelasio'>{desc.length?desc:'No Description'}</p>
                <div className='flex gap-6 mt-3'>
                    <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">Edit</Link>
                    <button className="pr-4 py-2 underline text-red">Delete</button>
                </div>
            </div>
        </div>
    )
}

export default ManageDraftBlogPost