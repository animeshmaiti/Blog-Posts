import { useContext, useState } from 'react'
import { authContext } from '../../context/authContext'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useBlog } from '../../context/blogContext'

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
  const {
    isValid,
    authUser
  } = useContext(authContext);
  const { username, fullname, profile_img } = authUser || {};

  const {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: commentsArr,
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useBlog();
  const [comment, setComment] = useState('');

  const handleComment = async () => {
    if (!isValid) {
      toast.error('Please login to leave a comment')
      return
    }
    if (!comment.length) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/interaction/add-comment',
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        {
          withCredentials: true,
        }
      )
      let data = response.data;
      // console.log(response.data)
      data.commented_by = {
        personal_info: { username, profile_img, fullname },
      }
      let newCommentArr = [];
      if (replyingTo) {
        commentsArr[index].children.push(data._id);
        data.childrenLevel = commentsArr[index].childrenLevel + 1;
        data.parentIndex = index;
        commentsArr[index].isReplyLoaded = true;
        commentsArr.splice(index + 1, 0, data);
        newCommentArr=commentsArr;
        setReplying(false);
      } else {
        response.data.childrenLevel = 0;
        newCommentArr.push(data);
      }
      let ParentCommentIncrementVal = replyingTo ? 0 : 1;
      setBlog({
        ...blog,
        comments: [...comments, ...newCommentArr],
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parents_comments:
            total_parent_comments + ParentCommentIncrementVal,
        },
      })
      setTotalParentCommentsLoaded((prev) => prev + ParentCommentIncrementVal);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.log(error);
    }
  }
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a comment..."
        className="input-box placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  )
}

export default CommentField
