import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';

export const getNotifications = async (req, res) => {
  try {
    const { isRead, type, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    success(res, { notifications, unreadCount, total });
  } catch (err) { error(res, err.message, 500); }
};

export const markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }, { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    success(res, { notification });
  } catch (err) { error(res, err.message, 500); }
};

export const markAllRead = async (req, res) => {
  try {
    const result = await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    success(res, { updated: result.modifiedCount });
  } catch (err) { error(res, err.message, 500); }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    success(res, { message: 'Deleted' });
  } catch (err) { error(res, err.message, 500); }
};
