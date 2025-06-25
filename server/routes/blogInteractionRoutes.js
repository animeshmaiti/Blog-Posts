import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { addComment, likeBlog, getBlogComments,getReplies,deleteComment,isLikedByUser } from '../controllers/blogInteraction.js';

const router = express.Router();

router.post('/like-blog', protectRoute, likeBlog);
router.post('/is-liked-by-user', protectRoute, isLikedByUser);
router.post('/add-comment', protectRoute, addComment);
router.post('/get-blog-comment', getBlogComments);
router.post('/get-replies',getReplies);
router.post('/delete-comment',protectRoute,deleteComment);

export default router;