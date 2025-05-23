import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { addComment, likeBlog, getBlogComments } from '../controllers/blogInteraction.js';

const router = express.Router();

router.post('/like-blog', protectRoute, likeBlog);
router.post('/add-comment', protectRoute, addComment);
router.post('/get-blog-comment', getBlogComments);

export default router;