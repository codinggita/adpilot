import mongoose from 'mongoose';

const automationRuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount' },
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  scope: {
    applyTo: { type: String, enum: ['all_campaigns', 'selected_campaigns', 'all_keywords', 'selected_ad_groups'], default: 'all_campaigns' },
    campaignIds: [{ type: mongoose.Schema.Types.ObjectId }],
    adGroupIds: [{ type: String }],
  },
  conditions: [{
    metric: { type: String },
    operator: { type: String, enum: ['gt', 'lt', 'gte', 'lte', 'eq', 'neq'] },
    value: { type: Number },
    timeWindow: { type: String, enum: ['1d', '7d', '14d', '30d'] },
  }],
  conditionLogic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  action: {
    type: { type: String, enum: ['PAUSE_KEYWORD', 'PAUSE_CAMPAIGN', 'ENABLE_KEYWORD', 'ENABLE_CAMPAIGN', 'INCREASE_BID', 'DECREASE_BID', 'SET_BID', 'INCREASE_BUDGET', 'DECREASE_BUDGET', 'SET_BUDGET', 'ADD_NEGATIVE_KEYWORD', 'SEND_ALERT'] },
    value: { type: mongoose.Schema.Types.Mixed },
    valueType: { type: String, enum: ['absolute', 'percentage'] },
  },
  schedule: {
    frequency: { type: String, enum: ['hourly', 'daily', 'weekly'], default: 'daily' },
    time: { type: String, default: '09:00' },
    dayOfWeek: { type: Number },
    timezone: { type: String, default: 'Asia/Kolkata' },
  },
  notification: {
    notifyOnFire: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
  },
  executionCount: { type: Number, default: 0 },
  lastExecutedAt: { type: Date },
  lastExecutionStatus: { type: String },
  nextExecutionAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('AutomationRule', automationRuleSchema);
