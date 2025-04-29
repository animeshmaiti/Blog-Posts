import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { getLatestBlogs } from '../controllers/getBlog.js';


const router = express.Router();

router.get('/latest-blogs',getLatestBlogs);

export default router;