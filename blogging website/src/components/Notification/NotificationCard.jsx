import { Link } from 'react-router-dom';
import { getFullDay } from '../../common/date';
import { useContext, useState } from 'react';
import NotificationCommentField from './NotificationCommentField';
import { authContext } from '../../context/authContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    _id: notification_id,
    seen,
    type,
    reply,
    replied_on_comment,
    comment,
    createdAt,
    user,
    user: {
      personal_info: { fullname, username, profile_img },
    },
    blog: { _id, blog_id, title, author },
  } = data;
  const {
    authUser: { username: author_username, profile_img: author_profile_img },
    isValid,
  } = useContext(authContext);
  const { notifications: { results }, setNotifications } = notificationState;
  const [isReplying, setIsReplying] = useState(false);
  const handleReplyClick = () => {
    setIsReplying((prev) => !prev);
  };
  const handleDelete = async (comment_id, type, target) => {
    target.setAttribute('disabled', true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/interaction/delete-comment`, { _id: comment_id}, { withCredentials: true });
      if (type === 'comment') {
        results.splice(index, 1);
      } else {
        delete results[index].reply;
      }
      target.removeAttribute('disabled');
      setNotifications(prev => ({ ...prev, results, totalDocs: prev.totalDocs - 1 ,deleteDocCount:prev.deleteDocCount+1}));
      toast.success('Comment deleted successfully');
    } catch (error) {
      target.removeAttribute('disabled');
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', error);
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error(error.message);
      }
    }
  };
  return (
    <>
    <Toaster/>
    <div className={`p-6 border-b border-grey border-l-black ${!seen &&'border-l-2'}`}>
      <div className='flex gap-5 mb-3'>
        <img
          src={profile_img}
          referrerPolicy='no-referrer'
          className='w-14 h-14 flex-none rounded-full'
        />
        <div className='w-full'>
          <h1 className='font-medium text-xl text-dark-grey'>
            <span className=' lg:inline-block hidden capitalize'>
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className='mx-1 text-black underline'
            >
              @{username}
            </Link>
            <span className='font-normal'>
              {type === 'like'
                ? 'Liked your blog post'
                : type === 'comment'
                  ? 'Commented on'
                  : 'replied on'}
            </span>
          </h1>
          {type === 'reply' ? (
            <div className='p-4 mt-4 rounded-md bg-grey'>
              <p>{replied_on_comment.comment}</p>
            </div>
          ) : (
            <Link
              to={`/blog/${blog_id}`}
              className='font-medium text-dark-grey hover:underline line-clamp-1'
            >{`'${title}'`}</Link>
          )}
        </div>
      </div>
      {type !== 'like' && (
        <p className='ml-14 pl-5 font-gelasio text-xl my-5'>
          {comment.comment || 'No comment available'}
        </p>
      )}
      <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
        <p>{getFullDay(createdAt)}</p>
        {type !== 'like' && (
          <>
            {!reply && (
              <button
                className='underline hover:text-black'
                onClick={handleReplyClick}
              >
                Reply
              </button>
            )}
            <button
              className='underline hover:text-black'
              onClick={(e) => handleDelete(comment._id, 'comment', e.target)}
            >
              Delete
            </button>
          </>
        )}
      </div>
      {isReplying && type !== 'like' && (
        <div className='mt-8'>
          <NotificationCommentField
            _id={_id}
            blog_author={author}
            index={index}
            replyingTo={comment._id}
            setIsReplying={setIsReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      )}
      {reply && (
        <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
          <div className='flex gap-3 mb-3'>
            <img
              src={author_profile_img}
              referrerPolicy='no-referrer'
              className='w-8 h-8 rounded-full'
            />
            <div>
              <h1 className='font-medium text-xl text-dark-grey'>
                <Link
                  to={`/user/${author_username}`}
                  className='mx-1 text-black underline'
                >
                  @{author_username}
                </Link>
                <span className='font-normal'>replied to</span>
                <Link
                  to={`/user/${username}`}
                  className='mx-1 text-black underline'
                >
                  @{username}
                </Link>
              </h1>
            </div>
          </div>
          <p className='ml-14 font-gelasio text-xl my-2'>{reply.comment}</p>
          <button
            className='underline hover:text-black ml-14 mt-2'
            onClick={(e) => handleDelete(reply._id, 'reply', e.target)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default NotificationCard;
