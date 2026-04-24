import Campaign from '../models/Campaign.js';
import CampaignMetrics from '../models/CampaignMetrics.js';
import Keyword from '../models/Keyword.js';
import GoogleAccount from '../models/GoogleAccount.js';
import { success, error } from '../utils/apiResponse.js';

export const getCampaigns = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20, sortBy = 'aiScore', sortOrder = 'desc' } = req.query;
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    if (!account) return error(res, 'No connected account found', 404);

    const filter = { userId: req.user._id, accountId: account._id };
    if (status && status !== 'all') filter.status = status === 'active' ? 'ENABLED' : status === 'paused' ? 'PAUSED' : status;
    if (type) filter.type = type;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const total = await Campaign.countDocuments(filter);
    const campaigns = await Campaign.find(filter).sort(sort).skip((page - 1) * limit).limit(parseInt(limit));

    // Get today's metrics for each campaign
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const campaignsWithMetrics = await Promise.all(campaigns.map(async (c) => {
      const todayMetrics = await CampaignMetrics.findOne({ campaignId: c._id, date: { $gte: today } });
      const weekMetrics = await CampaignMetrics.aggregate([
        { $match: { campaignId: c._id, date: { $gte: new Date(Date.now() - 86400000 * 7) } } },
        { $group: { _id: null, spend: { $sum: '$spend' }, revenue: { $sum: '$revenue' }, clicks: { $sum: '$clicks' }, conversions: { $sum: '$conversions' }, impressions: { $sum: '$impressions' } } }
      ]);
      const wk = weekMetrics[0] || { spend: 0, revenue: 0, clicks: 0, conversions: 0, impressions: 0 };
      return {
        ...c.toObject(),
        todaySpend: todayMetrics?.spend || 0,
        weekSpend: wk.spend,
        weekRevenue: wk.revenue,
        weekClicks: wk.clicks,
        weekConversions: wk.conversions,
        weekImpressions: wk.impressions,
        ctr: wk.impressions > 0 ? parseFloat(((wk.clicks / wk.impressions) * 100).toFixed(2)) : 0,
        roas: wk.spend > 0 ? parseFloat((wk.revenue / wk.spend).toFixed(2)) : 0,
      };
    }));

    success(res, { campaigns: campaignsWithMetrics, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { error(res, err.message, 500); }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user._id });
    if (!campaign) return error(res, 'Campaign not found', 404);

    const recentMetrics = await CampaignMetrics.find({ campaignId: campaign._id })
      .sort({ date: -1 }).limit(30);
    const topKeywords = await Keyword.find({ campaignId: campaign._id }).sort({ 'metrics7d.spend': -1 }).limit(10);

    success(res, { campaign, recentMetrics, topKeywords });
  } catch (err) { error(res, err.message, 500); }
};

export const getCampaignMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { campaignId: req.params.id };
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

    const metrics = await CampaignMetrics.find(filter).sort({ date: 1 });
    success(res, { metrics });
  } catch (err) { error(res, err.message, 500); }
};

export const pauseCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'PAUSED' }, { new: true }
    );
    if (!campaign) return error(res, 'Campaign not found', 404);
    success(res, { campaign });
  } catch (err) { error(res, err.message, 500); }
};

export const enableCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'ENABLED' }, { new: true }
    );
    if (!campaign) return error(res, 'Campaign not found', 404);
    success(res, { campaign });
  } catch (err) { error(res, err.message, 500); }
};

export const updateBudget = async (req, res) => {
  try {
    const { dailyBudget } = req.body;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { dailyBudget, totalBudget: dailyBudget * 30 }, { new: true }
    );
    if (!campaign) return error(res, 'Campaign not found', 404);
    success(res, { campaign });
  } catch (err) { error(res, err.message, 500); }
};
