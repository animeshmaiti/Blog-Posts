import express from 'express';


import optionalAuth from '../middleware/optionalAuth.js';
import { getLatestBlogs, getTrendingBlogs, searchBlogs, countLatestBlogs, countSearchBlogs, getBlogById } from '../controllers/getBlog.js';


const router = express.Router();

router.post('/latest-blogs', getLatestBlogs);
router.get('/trending-blogs', getTrendingBlogs);
router.post('/search-blogs', searchBlogs);
router.post('/all-latest-blogs-count', countLatestBlogs);
router.post('/search-blogs-count', countSearchBlogs);
router.post('/get-blog', optionalAuth, getBlogById);

export default router;