import { useContext, useState } from "react";
import { getDay } from "../../common/date";
import { authContext } from "../../context/authContext";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { useBlog } from "../../context/blogContext";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
    const {
        commented_by: {
            personal_info: { profile_img, fullname, username: commented_by_username },
        },
        commentedAt, comment, _id, children
    } = commentData;
    const { blog,
        blog: {
            comments,
            activity,
            activity: { total_parent_comments },
            comments: commentsArr,
            author: {
                personal_info: { username: blog_author },
            },
        },
        setBlog,
        setTotalParentCommentsLoaded,
    } = useBlog();
    const { isValid, authUser: { username } } = useContext(authContext);
    const [isReplying, setReplying] = useState(false);

    const getParentIndex = () => {
        let startingIndex = index - 1;
        console.log(startingIndex);
        while (startingIndex >= 0 && commentsArr[startingIndex].childrenLevel >= commentData.childrenLevel) {
            startingIndex--;
        }
        return startingIndex;
    }

    const removeCommentCards = (startIndex, isDelete = false) => {
        if (commentsArr[startIndex]) {
            while (commentsArr[startIndex].childrenLevel > commentData.childrenLevel) {
                commentsArr.splice(startIndex, 1);
                if (!commentsArr[startIndex]) {
                    break;
                }
            }
        }

        if (isDelete) {
            const parentIndex = getParentIndex();
            console.log(parentIndex)
            if (parentIndex !== -1) {
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter((id) => id !== _id);
                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }
            commentsArr.splice(index, 1);
        }
        if (commentData.childrenLevel === 0 && isDelete) {
            setTotalParentCommentsLoaded((prev) => prev - 1);
        }

        setBlog((prev) => {
            return {
                ...prev,
                comments: commentsArr,
                activity: {
                    ...prev.activity,
                    total_comments: prev.activity.total_comments - 1,
                    total_parent_comments: prev.activity.total_parent_comments - (commentData.childrenLevel === 0 && isDelete ? 1 : 0)
                }
            }
        });
    }
    const loadReplies = async ({ skip = 0 }) => {
        if (children.length) {
            hideReplies();
            try {
                const response = await axios.post('http://localhost:3000/api/interaction/get-replies', { _id, skip });
                const { data: { replies } } = response;
                commentData.isReplyLoaded = true;
                for (let i = 0; i < replies.length; i++) {
                    replies[i].childrenLevel = commentData.childrenLevel + 1;
                    commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                }
                setBlog((prev) => {
                    return {
                        ...prev,
                        comments: commentsArr
                    }
                });
                console.log(blog);
            } catch (error) {
                console.error("Error loading replies:", error);
                toast.error('Failed to load replies');
            }

        }
    }
    const hideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentCards(index + 1);
    }
    const handleReplyClick = () => {
        if (!isValid) {
            toast.error('Please login to reply to comments');
            return;
        }
        setReplying((prev) => !prev);
    }
    const deleteComment = async (e) => {
        e.target.setAttribute("disabled", true);
        try {
            await axios.post('http://localhost:3000/api/interaction/delete-comment', { _id }, {
                withCredentials: true
            });
            e.target.removeAttribute("disabled");
            removeCommentCards(index + 1, true);
        } catch (error) {
            e.target.removeAttribute("disabled");
            console.error("Error deleting comment:", error);
            toast.error('Failed to delete comment');
            return;
        }
    }
    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{commented_by_username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>
                <p className="font-gelasio text-xl ml-3">{comment}</p>
                <div className="flex gap-5 items-center mt-5">
                    {
                        commentData.isReplyLoaded ? (
                            <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}>
                                <i className="fi fi-rs-comment-dots"> Hide Reply</i>
                            </button>
                        ) : (
                            <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReplies}>
                                <i className="fi fi-rs-comment-dots">{children.length} Reply</i>
                            </button>
                        )
                    }
                    <button className="underline" onClick={handleReplyClick}>Reply</button>
                    {
                        username === commented_by_username || username === blog_author ? (
                            <button className="p-2 px-3 rounded-md border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComment}>
                                <i className="fi fi-rr-trash pointer-events-none"></i>
                            </button>
                        ) : ""
                    }
                </div>
                {
                    isReplying && (
                        <div className="mt-8">
                            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default CommentCard
