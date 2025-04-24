import express from 'express';
import { login, logout, signup,GoogleAuth } from '../controllers/authController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/validate', protectRoute, (req, res) => {
    const {
        personal_info: { fullname, username, email, profile_img },
        account_info,
        social_links
      } = req.user;
      res.status(200).json({
        fullname,
        username,
        email,
        profile_img,
        account_info,
        social_links
      });
});

router.post('/google-auth', GoogleAuth);

export default router;