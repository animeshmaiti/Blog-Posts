import { useContext, useState } from 'react'
import { authContext } from '../../context/authContext'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useBlog } from '../../context/blogContext'

const CommentField = ({ action }) => {
  const {
    isValid,
    authUser: { username, fullname, profile_img },
  } = useContext(authContext)
  const {
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
  } = useBlog()
  const [comment, setComment] = useState('')
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
        },
        {
          withCredentials: true,
        }
      )
      // console.log(response.data)
      response.data.commented_by = {
        personal_info: { username, profile_img, fullname },
      }
      let newCommentArr = []
      response.data.childrenLevel = 0
      newCommentArr.push(response.data)
      let ParentCommentIncrementVal = 1
      setBlog({
        ...blog,
        comments: { ...comments, newCommentArr },
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parents_comments:
            total_parent_comments + ParentCommentIncrementVal,
        },
      })
      setTotalParentCommentsLoaded((prev) => prev + ParentCommentIncrementVal)
    } catch (error) {
      console.log(error)
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
