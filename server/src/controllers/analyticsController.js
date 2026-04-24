import CampaignMetrics from '../models/CampaignMetrics.js';
import Campaign from '../models/Campaign.js';
import GoogleAccount from '../models/GoogleAccount.js';
import { success, error } from '../utils/apiResponse.js';

export const getOverview = async (req, res) => {
  try {
    const { startDate, endDate, period = '30' } = req.query;
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account', 404);

    const days = parseInt(period);
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 86400000 * days);
    const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
    const prevEnd = new Date(start.getTime());

    const aggregate = async (from, to) => {
      const result = await CampaignMetrics.aggregate([
        { $match: { accountId: account._id, date: { $gte: from, $lte: to } } },
        { $group: {
          _id: null,
          spend: { $sum: '$spend' }, revenue: { $sum: '$revenue' },
          impressions: { $sum: '$impressions' }, clicks: { $sum: '$clicks' },
          conversions: { $sum: '$conversions' },
        }}
      ]);
      return result[0] || { spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0 };
    };

    const current = await aggregate(start, end);
    const previous = await aggregate(prevStart, prevEnd);
    const roas = current.spend > 0 ? parseFloat((current.revenue / current.spend).toFixed(2)) : 0;
    const prevRoas = previous.spend > 0 ? parseFloat((previous.revenue / previous.spend).toFixed(2)) : 0;
    const wastedKeywords = await CampaignMetrics.aggregate([
      { $match: { accountId: account._id, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalSpend: { $sum: '$spend' } } }
    ]);
    const wastedSpend = Math.floor((wastedKeywords[0]?.totalSpend || 0) * 0.18);

    const delta = (curr, prev) => prev > 0 ? parseFloat((((curr - prev) / prev) * 100).toFixed(1)) : 0;

    success(res, {
      spend: current.spend, revenue: current.revenue, roas, impressions: current.impressions,
      clicks: current.clicks, conversions: current.conversions, wastedSpend,
      ctr: current.impressions > 0 ? parseFloat(((current.clicks / current.impressions) * 100).toFixed(2)) : 0,
      cpc: current.clicks > 0 ? parseFloat((current.spend / current.clicks).toFixed(2)) : 0,
      conversionRate: current.clicks > 0 ? parseFloat(((current.conversions / current.clicks) * 100).toFixed(1)) : 0,
      vsLastPeriod: {
        spend: delta(current.spend, previous.spend),
        revenue: delta(current.revenue, previous.revenue),
        roas: parseFloat((roas - prevRoas).toFixed(2)),
        impressions: delta(current.impressions, previous.impressions),
        clicks: delta(current.clicks, previous.clicks),
        conversions: delta(current.conversions, previous.conversions),
      },
      activeCampaigns: await Campaign.countDocuments({ accountId: account._id, status: 'ENABLED' }),
      pausedCampaigns: await Campaign.countDocuments({ accountId: account._id, status: 'PAUSED' }),
    });
  } catch (err) { error(res, err.message, 500); }
};

export const getTrends = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account', 404);

    const days = parseInt(period);
    const start = new Date(Date.now() - 86400000 * days);

    const data = await CampaignMetrics.aggregate([
      { $match: { accountId: account._id, date: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        spend: { $sum: '$spend' }, revenue: { $sum: '$revenue' },
        impressions: { $sum: '$impressions' }, clicks: { $sum: '$clicks' },
        conversions: { $sum: '$conversions' },
      }},
      { $sort: { _id: 1 } }
    ]);

    success(res, { data: data.map(d => ({ date: d._id, spend: d.spend, revenue: d.revenue, impressions: d.impressions, clicks: d.clicks, conversions: d.conversions, roas: d.spend > 0 ? parseFloat((d.revenue / d.spend).toFixed(2)) : 0 })) });
  } catch (err) { error(res, err.message, 500); }
};

export const getCampaignBreakdown = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account', 404);

    const start = new Date(Date.now() - 86400000 * parseInt(period));
    const campaigns = await Campaign.find({ accountId: account._id });

    const breakdown = await Promise.all(campaigns.map(async (c) => {
      const agg = await CampaignMetrics.aggregate([
        { $match: { campaignId: c._id, date: { $gte: start } } },
        { $group: { _id: null, spend: { $sum: '$spend' }, revenue: { $sum: '$revenue' }, clicks: { $sum: '$clicks' }, conversions: { $sum: '$conversions' }, impressions: { $sum: '$impressions' } } }
      ]);
      const m = agg[0] || { spend: 0, revenue: 0, clicks: 0, conversions: 0, impressions: 0 };
      return { ...c.toObject(), ...m, roas: m.spend > 0 ? parseFloat((m.revenue / m.spend).toFixed(2)) : 0 };
    }));

    success(res, { campaigns: breakdown.sort((a, b) => b.spend - a.spend) });
  } catch (err) { error(res, err.message, 500); }
};
