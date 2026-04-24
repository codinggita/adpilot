import AutomationRule from '../models/AutomationRule.js';
import RuleExecutionLog from '../models/RuleExecutionLog.js';
import GoogleAccount from '../models/GoogleAccount.js';
import { success, error } from '../utils/apiResponse.js';

export const getRules = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = { userId: req.user._id };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const rules = await AutomationRule.find(filter).sort({ updatedAt: -1 });
    success(res, { rules });
  } catch (err) { error(res, err.message, 500); }
};

export const createRule = async (req, res) => {
  try {
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    const rule = await AutomationRule.create({
      ...req.body,
      userId: req.user._id,
      accountId: account?._id,
    });
    success(res, { rule }, 201);
  } catch (err) { error(res, err.message, 500); }
};

export const getRuleById = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ _id: req.params.ruleId, userId: req.user._id });
    if (!rule) return error(res, 'Rule not found', 404);
    const recentExecutions = await RuleExecutionLog.find({ ruleId: rule._id }).sort({ executedAt: -1 }).limit(5);
    success(res, { rule, recentExecutions });
  } catch (err) { error(res, err.message, 500); }
};

export const updateRule = async (req, res) => {
  try {
    const rule = await AutomationRule.findOneAndUpdate(
      { _id: req.params.ruleId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!rule) return error(res, 'Rule not found', 404);
    success(res, { rule });
  } catch (err) { error(res, err.message, 500); }
};

export const toggleRule = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ _id: req.params.ruleId, userId: req.user._id });
    if (!rule) return error(res, 'Rule not found', 404);
    rule.isActive = req.body.isActive !== undefined ? req.body.isActive : !rule.isActive;
    await rule.save();
    success(res, { rule });
  } catch (err) { error(res, err.message, 500); }
};

export const deleteRule = async (req, res) => {
  try {
    const rule = await AutomationRule.findOneAndDelete({ _id: req.params.ruleId, userId: req.user._id });
    if (!rule) return error(res, 'Rule not found', 404);
    success(res, { message: 'Rule deleted' });
  } catch (err) { error(res, err.message, 500); }
};

export const runNow = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ _id: req.params.ruleId, userId: req.user._id });
    if (!rule) return error(res, 'Rule not found', 404);
    const log = await RuleExecutionLog.create({
      ruleId: rule._id, userId: req.user._id, accountId: rule.accountId,
      executedAt: new Date(), status: 'success',
      itemsEvaluated: Math.floor(Math.random() * 50) + 10,
      itemsMatched: Math.floor(Math.random() * 10) + 1,
      itemsActedOn: Math.floor(Math.random() * 5) + 1,
      actions: [{ entityType: 'keyword', entityName: 'Sample keyword', actionTaken: rule.action.type, success: true }],
      durationMs: Math.floor(Math.random() * 3000) + 500,
    });
    rule.executionCount += 1;
    rule.lastExecutedAt = new Date();
    rule.lastExecutionStatus = 'success';
    await rule.save();
    success(res, { executionLog: log });
  } catch (err) { error(res, err.message, 500); }
};

export const getRuleLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const logs = await RuleExecutionLog.find({ ruleId: req.params.ruleId })
      .sort({ executedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await RuleExecutionLog.countDocuments({ ruleId: req.params.ruleId });
    success(res, { logs, total });
  } catch (err) { error(res, err.message, 500); }
};

export const getTemplates = async (req, res) => {
  const templates = [
    { id: 'tpl_1', name: 'Pause zero-convert keywords', description: 'Automatically pause keywords with zero conversions over 14 days and spend > ₹500', conditions: [{ metric: 'conversions', operator: 'eq', value: 0, timeWindow: '14d' }, { metric: 'spend', operator: 'gt', value: 500, timeWindow: '14d' }], action: { type: 'PAUSE_KEYWORD', value: null, valueType: 'absolute' }, schedule: { frequency: 'daily', time: '09:00' }, category: 'Cost Control' },
    { id: 'tpl_2', name: 'Boost high-ROAS ad groups', description: 'Increase bids by 20% on ad groups with ROAS > 5×', conditions: [{ metric: 'roas', operator: 'gt', value: 5, timeWindow: '7d' }, { metric: 'spend', operator: 'gt', value: 1000, timeWindow: '7d' }], action: { type: 'INCREASE_BID', value: 20, valueType: 'percentage' }, schedule: { frequency: 'daily', time: '09:00' }, category: 'Scaling' },
    { id: 'tpl_3', name: 'Budget cap protection', description: 'Alert and reduce budget when utilization exceeds 90%', conditions: [{ metric: 'spend', operator: 'gte', value: 90, timeWindow: '1d' }], action: { type: 'DECREASE_BUDGET', value: 10, valueType: 'percentage' }, schedule: { frequency: 'hourly', time: '09:00' }, category: 'Protection' },
    { id: 'tpl_4', name: 'Low quality score alert', description: 'Send alert when keyword quality score drops below 5', conditions: [{ metric: 'quality_score', operator: 'lt', value: 5, timeWindow: '7d' }], action: { type: 'SEND_ALERT', value: null, valueType: 'absolute' }, schedule: { frequency: 'daily', time: '09:00' }, category: 'Monitoring' },
    { id: 'tpl_5', name: 'CPA spike detection', description: 'Alert when CPA exceeds 150% of target', conditions: [{ metric: 'cpa', operator: 'gt', value: 100, timeWindow: '1d' }], action: { type: 'SEND_ALERT', value: null, valueType: 'absolute' }, schedule: { frequency: 'hourly', time: '09:00' }, category: 'Anomaly' },
  ];
  success(res, { templates });
};
