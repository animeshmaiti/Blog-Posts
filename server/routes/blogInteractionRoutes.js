import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { addComment,likeBlog } from '../controllers/blogInteraction.js';

const router = express.Router();

router.post('/like-blog', protectRoute, likeBlog);
router.post('/add-comment', protectRoute, addComment);

export default router;