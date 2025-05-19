import { useContext, useState } from 'react';
import { authContext } from '../../context/authContext';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useBlog } from '../../context/blogContext';

const CommentField = ({ action }) => {
  const { isValid } = useContext(authContext);
  const {blog:{_id,author:{_id:blog_author}}}=useBlog();
  const [comment, setComment] = useState('');
  const handleComment = async () => {
    if (!isValid) {
      toast.error('Please login to leave a comment');
      return;
    }
    if (!comment.length) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response=await axios.post('http://localhost:3000/api/interaction/add-comment',{
        _id,blog_author,comment
      },{
        withCredentials: true
      });
      console.log(response.data);
      // response.data.commented_by={}
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder='Leave a comment...'
        className='input-box placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button className='btn-dark mt-5 px-10' onClick={handleComment}>{action}</button>
    </>
  )
}

export default CommentField