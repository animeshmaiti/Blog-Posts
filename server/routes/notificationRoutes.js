import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getNewNotifications,getNotifications,allNotificationsCount } from '../controllers/notificationController.js';

const router=express.Router();

router.get('/new-notifications',protectRoute,getNewNotifications);
router.post('/notifications',protectRoute,getNotifications);
router.post('/all-notifications-count',protectRoute,allNotificationsCount);

export default router;
