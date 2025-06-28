import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast"
import { authContext } from "../../context/authContext";
import axios from "axios";

const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined, setIsReplying, notification_id, notificationData }) => {
    const [comment, setComment] = useState('');
    
    // const { isValid } = useContext(authContext);
    const { notifications, notifications: { results }, setNotifications } = notificationData;
    const handleComment = async () => {
        if (!comment.length) {
            toast.error('Comment cannot be empty')
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:3000/api/interaction/add-comment',
                {
                    _id,
                    blog_author,
                    comment,
                    replying_to: replyingTo,
                    notification_id
                },
                {
                    withCredentials: true,
                }
            )
            let data = response.data;
            // console.log(data);
            setIsReplying(false);
            results[index].reply={comment,_id:data._id};
            setNotifications({...notifications,results});
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
                placeholder="Leave a reply..."
                className="input-box placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                Reply
            </button>
        </>
    );
}

export default NotificationCommentField