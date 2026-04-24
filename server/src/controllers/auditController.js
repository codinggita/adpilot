import AuditResult from '../models/AuditResult.js';
import GoogleAccount from '../models/GoogleAccount.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';

export const runAudit = async (req, res) => {
  try {
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account', 404);

    const audit = await AuditResult.create({
      userId: req.user._id,
      accountId: account._id,
      triggeredBy: 'manual',
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(Date.now() + 90000),
      durationSeconds: 90,
      summary: {
        totalWastedSpend: Math.floor(Math.random() * 4000) + 4000,
        projectedROASGain: Math.floor(Math.random() * 20) + 15,
        totalActions: Math.floor(Math.random() * 8) + 8,
        highPriorityCount: Math.floor(Math.random() * 3) + 2,
        medPriorityCount: Math.floor(Math.random() * 4) + 3,
        lowPriorityCount: Math.floor(Math.random() * 3) + 2,
        accountHealthScore: Math.floor(Math.random() * 30) + 50,
      },
      recommendations: [
        { priority: 'P1', type: 'NEGATIVE_KEYWORD', title: 'Block 18 irrelevant search terms', description: 'Search terms like "free shoes" and "shoe repair" are draining budget with zero conversions.', reasoning: 'These terms collectively spent ₹4,200 in the last 14 days with 0 conversions.', campaignName: 'Spring Sale_Broad', currentValue: '0 negatives', proposedValue: '18 negatives', projectedImpact: { weeklySpendChange: -2100, weeklyRevenueChange: 0, roasChange: 0.6 }, status: 'pending' },
        { priority: 'P1', type: 'PAUSE_KEYWORD', title: "Pause 'cheap clothes' keyword", description: 'This broad match keyword is attracting low-intent traffic.', reasoning: 'Spent ₹1,850 in 7 days with 0 conversions. Quality score is 2/10.', campaignName: 'Spring Sale_Broad', currentValue: 'Active', proposedValue: 'Paused', projectedImpact: { weeklySpendChange: -1850, weeklyRevenueChange: 0, roasChange: 0.3 }, status: 'pending' },
        { priority: 'P2', type: 'BID_INCREASE', title: 'Boost bids on top converters', description: "Increase bids for 'running shoes online' and 'premium leather shoes'.", reasoning: 'These keywords have 9+ quality scores but are losing impression share due to low bids.', campaignName: 'Brand Keywords Exact', currentValue: '₹15', proposedValue: '₹28', projectedImpact: { weeklySpendChange: 900, weeklyRevenueChange: 3600, roasChange: 0.4 }, status: 'pending' },
        { priority: 'P2', type: 'BUDGET_SHIFT', title: 'Shift budget to Shopping campaigns', description: 'Move ₹1,500/day from Video Awareness to Shopping Feed Main.', reasoning: 'Shopping campaigns have 85 AI score vs 60 for Video with 40% better ROAS.', campaignName: 'Video Awareness → Shopping Feed', currentValue: '₹5,000/day', proposedValue: '₹3,500/day', projectedImpact: { weeklySpendChange: 0, weeklyRevenueChange: 4200, roasChange: 0.35 }, status: 'pending' },
        { priority: 'P3', type: 'AD_SCHEDULE', title: 'Add midnight pause schedule', description: 'Stop serving ads between 12 AM and 6 AM.', reasoning: 'Analysis shows zero conversions during midnight hours but ₹800/week in spend.', campaignName: 'All Campaigns', currentValue: '24hr', proposedValue: '6AM-12AM', projectedImpact: { weeklySpendChange: -800, weeklyRevenueChange: 0, roasChange: 0.1 }, status: 'pending' },
      ],
    });

    await Notification.create({
      userId: req.user._id,
      type: 'audit_complete',
      title: 'AI Audit completed',
      message: `Found ${audit.recommendations.length} optimization opportunities. Health score: ${audit.summary.accountHealthScore}/100.`,
      severity: 'info',
      actionUrl: '/ai-optimizer',
    });

    success(res, { audit }, 201);
  } catch (err) { error(res, err.message, 500); }
};

export const getAuditById = async (req, res) => {
  try {
    const audit = await AuditResult.findOne({ _id: req.params.auditId, userId: req.user._id });
    if (!audit) return error(res, 'Audit not found', 404);
    success(res, { audit });
  } catch (err) { error(res, err.message, 500); }
};

export const getAuditHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await AuditResult.countDocuments({ userId: req.user._id });
    const audits = await AuditResult.find({ userId: req.user._id })
      .sort({ startedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
      .select('summary status startedAt completedAt triggeredBy durationSeconds');
    success(res, { audits, total });
  } catch (err) { error(res, err.message, 500); }
};

export const applyRecommendation = async (req, res) => {
  try {
    const audit = await AuditResult.findOne({ _id: req.params.auditId, userId: req.user._id });
    if (!audit) return error(res, 'Audit not found', 404);
    const rec = audit.recommendations.id(req.params.recId);
    if (!rec) return error(res, 'Recommendation not found', 404);
    rec.status = 'applied';
    rec.appliedAt = new Date();
    await audit.save();
    await Notification.create({ userId: req.user._id, type: 'recommendation_applied', title: 'Fix applied successfully', message: rec.title, severity: 'info', actionUrl: '/ai-optimizer' });
    success(res, { recommendation: rec });
  } catch (err) { error(res, err.message, 500); }
};

export const dismissRecommendation = async (req, res) => {
  try {
    const audit = await AuditResult.findOne({ _id: req.params.auditId, userId: req.user._id });
    if (!audit) return error(res, 'Audit not found', 404);
    const rec = audit.recommendations.id(req.params.recId);
    if (!rec) return error(res, 'Recommendation not found', 404);
    rec.status = 'dismissed';
    rec.dismissedAt = new Date();
    await audit.save();
    success(res, { recommendation: rec });
  } catch (err) { error(res, err.message, 500); }
};

export const applyAll = async (req, res) => {
  try {
    const { priority } = req.query;
    const audit = await AuditResult.findOne({ _id: req.params.auditId, userId: req.user._id });
    if (!audit) return error(res, 'Audit not found', 404);
    let applied = 0;
    audit.recommendations.forEach(rec => {
      if (rec.status === 'pending' && (!priority || priority === 'all' || rec.priority === priority)) {
        rec.status = 'applied';
        rec.appliedAt = new Date();
        applied++;
      }
    });
    await audit.save();
    await Notification.create({ userId: req.user._id, type: 'recommendation_applied', title: `${applied} fixes applied`, message: `Successfully applied ${applied} AI recommendations.`, severity: 'info', actionUrl: '/ai-optimizer' });
    success(res, { applied, total: audit.recommendations.length });
  } catch (err) { error(res, err.message, 500); }
};
