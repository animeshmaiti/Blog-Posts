import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { generateUploadURL,createBlog,likeBlog } from '../controllers/createBlog.js';

const router = express.Router();

router.get('/get-upload-url',generateUploadURL);
router.post('/create-blog',protectRoute, createBlog);
router.post('/like-blog',protectRoute, likeBlog);

export default router;