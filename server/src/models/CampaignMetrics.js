import mongoose from 'mongoose';

const campaignMetricsSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true, index: true },
  spend: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  conversionValue: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  cpc: { type: Number, default: 0 },
  cpa: { type: Number, default: 0 },
  roas: { type: Number, default: 0 },
  qualityScoreAvg: { type: Number },
  searchImpressionShare: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('CampaignMetrics', campaignMetricsSchema);
