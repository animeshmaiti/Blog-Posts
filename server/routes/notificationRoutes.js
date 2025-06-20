import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getNewNotifications } from '../controllers/notificationController.js';

const router=express.Router();

router.get('/new-notifications',protectRoute,getNewNotifications);

export default router;
