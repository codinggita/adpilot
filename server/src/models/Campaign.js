import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  googleCampaignId: { type: String, index: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['ENABLED', 'PAUSED', 'REMOVED'], default: 'ENABLED' },
  type: { type: String, enum: ['SEARCH', 'DISPLAY', 'SHOPPING', 'VIDEO'], default: 'SEARCH' },
  dailyBudget: { type: Number, default: 0 },
  totalBudget: { type: Number, default: 0 },
  biddingStrategy: { type: String },
  targetCPA: { type: Number },
  targetROAS: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  labels: [{ type: String }],
  aiScore: { type: Number, min: 0, max: 100 },
  aiScoreBreakdown: {
    keywordHealth: { type: Number },
    bidStrategy: { type: Number },
    budgetAllocation: { type: Number },
    adQuality: { type: Number },
    wasteScore: { type: Number },
  },
  lastAuditAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
