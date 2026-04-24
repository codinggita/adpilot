import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    success(res, { user });
  } catch (err) { error(res, err.message, 500); }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return error(res, 'Both passwords required');
    if (newPassword.length < 8) return error(res, 'New password must be at least 8 characters');
    const user = await User.findById(req.user._id).select('+passwordHash');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return error(res, 'Current password is incorrect', 401);
    user.passwordHash = newPassword;
    await user.save();
    success(res, { message: 'Password changed' });
  } catch (err) { error(res, err.message, 500); }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    success(res, { user });
  } catch (err) { error(res, err.message, 500); }
};
