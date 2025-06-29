import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { generateUploadURL, createBlog,getUserWrittenBlogs,getUserWrittenBlogsCount } from '../controllers/createBlog.js';

const router = express.Router();

router.get('/get-upload-url', generateUploadURL);
router.post('/create-blog', protectRoute, createBlog);
router.post('/user-written-blogs',protectRoute,getUserWrittenBlogs);
router.post('/user-written-blogs-count',protectRoute,getUserWrittenBlogsCount);

export default router;