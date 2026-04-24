import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['waste_alert', 'rule_fired', 'audit_complete', 'report_ready', 'budget_cap', 'roas_drop', 'account_error', 'recommendation_applied'] },
  title: { type: String, required: true },
  message: { type: String },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
