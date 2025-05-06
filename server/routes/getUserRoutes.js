import express from 'express';
import { searchUsers } from '../controllers/getUserController.js';

const router = express.Router();

router.post('/search-users',searchUsers);

export default router;