import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { filterPaginationData } from "../common/filterPaginationData";
import { authContext } from "../context/authContext";

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
                state:draft?drafts:blogs,
                data,
                page,
                countRoute:'/api/create/user-written-blogs-count',
                data_to_send: { draft, query },
                verify: true
            })
            console.log(formattedData,draft);
            if (draft) {
                setDrafts(formattedData);
            } else {
                setBlogs(formattedData);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }
    useEffect(()=>{
        if (isValid) {
            if (!blogs) {
                getBlogs({ page: 1, draft: false });
            }
            if (!drafts) {
                getBlogs({ page: 1, draft: true });
            }
        }
    },[isValid,blogs,drafts,query]);
    return (
        <div>ManageBlogs</div>
    )
}

export default ManageBlogs