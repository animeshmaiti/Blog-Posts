import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { getLatestBlogs, getTrendingBlogs } from '../controllers/getBlog.js';


const router = express.Router();

router.get('/latest-blogs', getLatestBlogs);
router.get('/trending-blogs', getTrendingBlogs);

export default router;