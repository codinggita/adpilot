import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  priority: { type: String, enum: ['P1', 'P2', 'P3'] },
  type: { type: String, enum: ['NEGATIVE_KEYWORD', 'BID_INCREASE', 'BID_DECREASE', 'BUDGET_SHIFT', 'PAUSE_KEYWORD', 'RESUME_KEYWORD', 'PAUSE_CAMPAIGN', 'NEW_KEYWORD', 'AD_SCHEDULE', 'DEVICE_BID', 'GEOGRAPHIC_BID', 'QUALITY_SCORE'] },
  title: { type: String },
  description: { type: String },
  reasoning: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId },
  campaignName: { type: String },
  adGroupId: { type: String },
  keywordId: { type: mongoose.Schema.Types.ObjectId },
  keywordText: { type: String },
  currentValue: { type: mongoose.Schema.Types.Mixed },
  proposedValue: { type: mongoose.Schema.Types.Mixed },
  projectedImpact: {
    weeklySpendChange: { type: Number },
    weeklyRevenueChange: { type: Number },
    roasChange: { type: Number },
  },
  status: { type: String, enum: ['pending', 'applied', 'dismissed', 'failed'], default: 'pending' },
  appliedAt: { type: Date },
  dismissedAt: { type: Date },
  failureReason: { type: String },
});

const auditResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount', required: true, index: true },
  triggeredBy: { type: String, enum: ['manual', 'scheduled', 'onboarding'], default: 'manual' },
  status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  durationSeconds: { type: Number },
  summary: {
    totalWastedSpend: { type: Number },
    projectedROASGain: { type: Number },
    totalActions: { type: Number },
    highPriorityCount: { type: Number },
    medPriorityCount: { type: Number },
    lowPriorityCount: { type: Number },
    accountHealthScore: { type: Number },
  },
  recommendations: [recommendationSchema],
  rawGeminiResponse: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('AuditResult', auditResultSchema);
