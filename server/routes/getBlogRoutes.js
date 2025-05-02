import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { getLatestBlogs, getTrendingBlogs, searchBlogs } from '../controllers/getBlog.js';


const router = express.Router();

router.get('/latest-blogs', getLatestBlogs);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogs);

export default router;