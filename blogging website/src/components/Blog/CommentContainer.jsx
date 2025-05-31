import { useBlog } from '../../context/blogContext';
import CommentField from './CommentField';
import { AnimationWrapper } from '../../common/page-animation';
import CommentCard from './CommentCard';
import NoDataMessage from '../BlogPost/NoDataMessage';

const CommentContainer = () => {
    const { setBlog,blog: { _id, title, comments: commentsArr, activity: { total_parent_comments } }, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, fetchComments } = useBlog();
    const loadMoreComments = async () => {
        let newCommentsArr = await fetchComments({ skip: totalParentCommentsLoaded , blog_id: _id, setParentCommentCount: setTotalParentCommentsLoaded, comment_array: commentsArr });
        setBlog((prev) => {
            return {
                ...prev,
                comments: newCommentsArr
            }
        });
    }
    // console.log(commentsArr);
    return (
        <div className={`max-sm:w-full fixed ${commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]'} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}>
            <div className='relative'>
                <h1 className='text-xl font-medium'>Comments</h1>
                <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>{title}</p>
                <button
                    onClick={() => setCommentsWrapper((prev) => !prev)}
                    className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'
                >
                    <i className='fi fi-br-cross text-2xl mt-1'></i>
                </button>
            </div>
            <hr className='border-grey my-8 w-[120%] -ml-10' />
            <CommentField action={'comment'} />
            {
                commentsArr && commentsArr.length ?
                    commentsArr.map((comment, i) => {
                        return <AnimationWrapper key={i}>
                            <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                        </AnimationWrapper>
                    }) : <NoDataMessage message='No comments yet!' />
            }
            {
                total_parent_comments > totalParentCommentsLoaded &&
                <button
                    onClick={loadMoreComments}
                    className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                >
                    Load More
                </button>
            }
        </div>
    )
}

export default CommentContainer