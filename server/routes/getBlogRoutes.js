import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { getLatestBlogs, getTrendingBlogs, searchBlogs, countLatestBlogs, countSearchBlogs } from '../controllers/getBlog.js';


const router = express.Router();

router.post('/latest-blogs', getLatestBlogs);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogs);
router.post('/all-latest-blogs-count', countLatestBlogs);
router.post('/search-blogs-count', countSearchBlogs);

export default router;