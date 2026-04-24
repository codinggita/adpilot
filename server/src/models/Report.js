import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount' },
  type: { type: String, enum: ['weekly', 'monthly', 'audit', 'custom'], default: 'weekly' },
  period: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  status: { type: String, enum: ['generating', 'ready', 'failed'], default: 'generating' },
  summary: {
    totalSpend: { type: Number },
    totalRevenue: { type: Number },
    totalRoas: { type: Number },
    totalImpressions: { type: Number },
    totalClicks: { type: Number },
    totalConversions: { type: Number },
    wastedSpend: { type: Number },
    aiActionsApplied: { type: Number },
    improvementVsLastPeriod: { type: Number },
  },
  aiNarrative: {
    executiveSummary: { type: String },
    winsThisWeek: [{ type: String }],
    actionsNextWeek: [{ type: String }],
    insights: [{ type: String }],
  },
  pdfUrl: { type: String },
  emailSentAt: { type: Date },
  viewedAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Report', reportSchema);
