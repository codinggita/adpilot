import Report from '../models/Report.js';
import GoogleAccount from '../models/GoogleAccount.js';
import { success, error } from '../utils/apiResponse.js';

export const getReports = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    success(res, { reports, total });
  } catch (err) { error(res, err.message, 500); }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.reportId, userId: req.user._id });
    if (!report) return error(res, 'Report not found', 404);
    if (!report.viewedAt) { report.viewedAt = new Date(); await report.save(); }
    success(res, { report });
  } catch (err) { error(res, err.message, 500); }
};

export const generateReport = async (req, res) => {
  try {
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account', 404);
    const endDate = new Date();
    const startDate = new Date(Date.now() - 86400000 * 7);
    const r = n => Math.floor(Math.random() * n);

    const report = await Report.create({
      userId: req.user._id, accountId: account._id, type: 'weekly',
      period: { startDate, endDate }, status: 'ready',
      summary: {
        totalSpend: r(20000) + 30000, totalRevenue: r(80000) + 120000,
        totalRoas: parseFloat(((r(20) + 25) / 10).toFixed(1)),
        totalImpressions: r(100000) + 100000, totalClicks: r(5000) + 3000,
        totalConversions: r(400) + 200, wastedSpend: r(4000) + 4000,
        aiActionsApplied: r(10) + 3, improvementVsLastPeriod: parseFloat((r(25) - 5).toFixed(1)),
      },
      aiNarrative: {
        executiveSummary: 'This week saw improved campaign performance driven by AI-optimized bid adjustments and negative keyword additions. ROAS improved across search campaigns while CPA decreased by 12%.',
        winsThisWeek: ['CPA decreased by 12% across search campaigns', 'Added 23 negative keywords saving ₹3,400/week', 'Shopping campaign ROAS hit 4.8× — best this month'],
        actionsNextWeek: ['Consider increasing Shopping Feed Main budget by 20%', 'Review 8 new keyword opportunities identified by AI', 'Test new ad copy for Competitor Terms campaign'],
        insights: ['Mobile traffic converting 30% better than desktop during evenings', 'Competitor bids stabilizing — opportunity to reclaim impression share', 'Quality scores trending up across exact match keywords'],
      },
    });
    success(res, { report }, 201);
  } catch (err) { error(res, err.message, 500); }
};
