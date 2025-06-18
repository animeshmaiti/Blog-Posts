import express from 'express';
import { searchUsers, getProfile, updateProfileImg, updateProfile } from '../controllers/getUserController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/search-users', searchUsers);
router.post('/get-profile', getProfile);
router.post('/update-profile-img', protectRoute, updateProfileImg);
router.post('/update-profile', protectRoute, updateProfile);

export default router;