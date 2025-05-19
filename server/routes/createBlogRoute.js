import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { generateUploadURL, createBlog } from '../controllers/createBlog.js';

const router = express.Router();

router.get('/get-upload-url', generateUploadURL);
router.post('/create-blog', protectRoute, createBlog);

export default router;