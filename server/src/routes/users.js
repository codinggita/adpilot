import express from 'express';
import { updateProfile, changePassword, getProfile } from '../controllers/usersController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.post('/me/change-password', changePassword);

export default router;
