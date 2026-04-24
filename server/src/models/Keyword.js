import mongoose from 'mongoose';

const metricsSubSchema = {
  spend: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  cpc: { type: Number, default: 0 },
  roas: { type: Number, default: 0 },
};

const keywordSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
  adGroupId: { type: String },
  adGroupName: { type: String },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  googleKeywordId: { type: String, index: true },
  text: { type: String, required: true },
  matchType: { type: String, enum: ['EXACT', 'PHRASE', 'BROAD'], default: 'BROAD' },
  status: { type: String, enum: ['ENABLED', 'PAUSED', 'REMOVED'], default: 'ENABLED' },
  bidAmount: { type: Number, default: 0 },
  finalUrls: [{ type: String }],
  qualityScore: { type: Number, min: 1, max: 10 },
  qualityScoreHistory: [{ date: { type: Date }, score: { type: Number } }],
  aiTag: { type: String, enum: ['TOP_PERFORMER', 'WASTING_BUDGET', 'LOW_VOLUME', 'OPPORTUNITY', 'NORMAL'], default: 'NORMAL' },
  metrics7d: metricsSubSchema,
  metrics30d: metricsSubSchema,
  isNegative: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Keyword', keywordSchema);
