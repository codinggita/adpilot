import express from 'express';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../controllers/notificationsController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
