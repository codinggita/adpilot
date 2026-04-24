import mongoose from 'mongoose';
import GoogleAccount from '../models/GoogleAccount.js';
import Campaign from '../models/Campaign.js';
import CampaignMetrics from '../models/CampaignMetrics.js';
import Keyword from '../models/Keyword.js';
import AuditResult from '../models/AuditResult.js';
import AutomationRule from '../models/AutomationRule.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export async function seedDemoData(userId) {
  const existing = await GoogleAccount.findOne({ userId });
  if (existing) return existing;

  // 1. Google Ads Account
  const account = await GoogleAccount.create({
    userId,
    customerId: '948-291-5503',
    accountName: 'AdPilot Demo Account',
    currencyCode: 'INR',
    timeZone: 'Asia/Kolkata',
    accessToken: 'demo_access_token',
    refreshToken: 'demo_refresh_token',
    tokenExpiresAt: new Date(Date.now() + 86400000 * 365),
    isActive: true,
    lastSyncAt: new Date(),
    syncStatus: 'success',
    permissions: { canReadCampaigns: true, canWriteBids: true, canWriteBudgets: true, canWriteKeywords: true },
  });

  // 2. Campaigns
  const campaignDefs = [
    { name: 'Retargeting_Q3_All', status: 'ENABLED', type: 'SEARCH', dailyBudget: 1500, biddingStrategy: 'TARGET_CPA', aiScore: 92 },
    { name: 'Spring Sale_Broad', status: 'ENABLED', type: 'SEARCH', dailyBudget: 3000, biddingStrategy: 'MAXIMIZE_CLICKS', aiScore: 38 },
    { name: 'Brand Keywords Exact', status: 'ENABLED', type: 'SEARCH', dailyBudget: 800, biddingStrategy: 'TARGET_CPA', aiScore: 95 },
    { name: 'Lookalike_1%_Purchasers', status: 'PAUSED', type: 'DISPLAY', dailyBudget: 2000, biddingStrategy: 'TARGET_ROAS', aiScore: 71 },
    { name: 'Summer Collection', status: 'ENABLED', type: 'SEARCH', dailyBudget: 500, biddingStrategy: 'TARGET_CPA', aiScore: 98 },
    { name: 'Competitor Terms', status: 'ENABLED', type: 'SEARCH', dailyBudget: 1200, biddingStrategy: 'MANUAL_CPC', aiScore: 55 },
    { name: 'Video Awareness', status: 'PAUSED', type: 'VIDEO', dailyBudget: 5000, biddingStrategy: 'MAXIMIZE_CONVERSIONS', aiScore: 60 },
    { name: 'Shopping Feed Main', status: 'ENABLED', type: 'SHOPPING', dailyBudget: 2500, biddingStrategy: 'TARGET_ROAS', aiScore: 85 },
  ];

  const campaigns = [];
  for (const def of campaignDefs) {
    const c = await Campaign.create({
      accountId: account._id,
      userId,
      googleCampaignId: `gc_${rand(100000, 999999)}`,
      name: def.name,
      status: def.status,
      type: def.type,
      dailyBudget: def.dailyBudget,
      totalBudget: def.dailyBudget * 30,
      biddingStrategy: def.biddingStrategy,
      targetCPA: rand(20, 80),
      targetROAS: (rand(20, 60) / 10),
      startDate: new Date(Date.now() - 86400000 * rand(30, 180)),
      labels: [],
      aiScore: def.aiScore,
      aiScoreBreakdown: {
        keywordHealth: rand(40, 100),
        bidStrategy: rand(40, 100),
        budgetAllocation: rand(40, 100),
        adQuality: rand(40, 100),
        wasteScore: rand(20, 90),
      },
      lastAuditAt: new Date(Date.now() - 86400000 * rand(1, 7)),
    });
    campaigns.push(c);
  }

  // 3. Campaign Metrics (30 days for each campaign)
  const metricsToInsert = [];
  for (const campaign of campaigns) {
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.now() - 86400000 * d);
      const spend = campaign.status === 'PAUSED' ? 0 : rand(Math.floor(campaign.dailyBudget * 0.5), campaign.dailyBudget);
      const impressions = spend === 0 ? 0 : rand(500, 8000);
      const clicks = spend === 0 ? 0 : rand(20, Math.floor(impressions * 0.08));
      const conversions = spend === 0 ? 0 : rand(0, Math.floor(clicks * 0.15));
      const revenue = conversions * rand(200, 800);
      metricsToInsert.push({
        campaignId: campaign._id,
        accountId: account._id,
        userId,
        date,
        spend,
        revenue,
        impressions,
        clicks,
        conversions,
        conversionValue: revenue,
        ctr: impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0,
        cpc: clicks > 0 ? parseFloat((spend / clicks).toFixed(2)) : 0,
        cpa: conversions > 0 ? parseFloat((spend / conversions).toFixed(2)) : 0,
        roas: spend > 0 ? parseFloat((revenue / spend).toFixed(2)) : 0,
        qualityScoreAvg: rand(3, 9),
        searchImpressionShare: rand(20, 85),
      });
    }
  }
  await CampaignMetrics.insertMany(metricsToInsert);

  // 4. Keywords
  const kwDefs = [
    { text: 'running shoes online', matchType: 'EXACT', aiTag: 'TOP_PERFORMER' },
    { text: 'buy sneakers cheap', matchType: 'BROAD', aiTag: 'WASTING_BUDGET' },
    { text: 'sports shoes india', matchType: 'PHRASE', aiTag: 'OPPORTUNITY' },
    { text: 'best running shoes 2024', matchType: 'EXACT', aiTag: 'TOP_PERFORMER' },
    { text: 'footwear online sale', matchType: 'BROAD', aiTag: 'NORMAL' },
    { text: 'spring jackets', matchType: 'BROAD', aiTag: 'WASTING_BUDGET' },
    { text: 'sale dresses', matchType: 'PHRASE', aiTag: 'NORMAL' },
    { text: 'cheap clothes', matchType: 'BROAD', aiTag: 'WASTING_BUDGET' },
    { text: 'premium leather shoes', matchType: 'EXACT', aiTag: 'TOP_PERFORMER' },
    { text: 'discount sportswear', matchType: 'PHRASE', aiTag: 'LOW_VOLUME' },
    { text: 'running gear accessories', matchType: 'BROAD', aiTag: 'NORMAL' },
    { text: 'workout apparel men', matchType: 'EXACT', aiTag: 'OPPORTUNITY' },
    { text: 'free shipping shoes', matchType: 'BROAD', aiTag: 'WASTING_BUDGET' },
    { text: 'branded sneakers', matchType: 'PHRASE', aiTag: 'TOP_PERFORMER' },
    { text: 'athletic footwear', matchType: 'EXACT', aiTag: 'NORMAL' },
  ];

  for (const kw of kwDefs) {
    const campaign = pick(campaigns.filter(c => c.type === 'SEARCH'));
    const spend7d = kw.aiTag === 'WASTING_BUDGET' ? rand(500, 2000) : rand(50, 500);
    const clicks7d = rand(10, 200);
    const conv7d = kw.aiTag === 'WASTING_BUDGET' ? 0 : rand(1, 20);
    await Keyword.create({
      campaignId: campaign._id,
      adGroupId: `ag_${rand(1000, 9999)}`,
      adGroupName: `AG_${campaign.name.split(' ')[0]}`,
      accountId: account._id,
      userId,
      googleKeywordId: `gk_${rand(100000, 999999)}`,
      text: kw.text,
      matchType: kw.matchType,
      status: 'ENABLED',
      bidAmount: rand(5, 50),
      qualityScore: kw.aiTag === 'TOP_PERFORMER' ? rand(7, 10) : kw.aiTag === 'WASTING_BUDGET' ? rand(2, 5) : rand(4, 8),
      aiTag: kw.aiTag,
      metrics7d: { spend: spend7d, clicks: clicks7d, impressions: rand(500, 5000), conversions: conv7d, ctr: rand(1, 8), cpc: rand(3, 40), roas: conv7d > 0 ? rand(1, 8) : 0 },
      metrics30d: { spend: spend7d * 4, clicks: clicks7d * 4, impressions: rand(2000, 20000), conversions: conv7d * 4, ctr: rand(1, 8), cpc: rand(3, 40), roas: conv7d > 0 ? rand(1, 8) : 0 },
    });
  }

  // 5. Audit Results
  const auditDates = [
    new Date(Date.now() - 86400000 * 1),
    new Date(Date.now() - 86400000 * 8),
    new Date(Date.now() - 86400000 * 15),
  ];

  for (let a = 0; a < auditDates.length; a++) {
    const score = a === 0 ? 58 : a === 1 ? 71 : 84;
    await AuditResult.create({
      userId,
      accountId: account._id,
      triggeredBy: a === 0 ? 'manual' : 'scheduled',
      status: 'completed',
      startedAt: auditDates[a],
      completedAt: new Date(auditDates[a].getTime() + 90000),
      durationSeconds: 90,
      summary: {
        totalWastedSpend: rand(4000, 8000),
        projectedROASGain: rand(15, 35),
        totalActions: rand(8, 15),
        highPriorityCount: rand(2, 5),
        medPriorityCount: rand(3, 6),
        lowPriorityCount: rand(2, 4),
        accountHealthScore: score,
      },
      recommendations: [
        {
          priority: 'P1', type: 'PAUSE_KEYWORD', title: "Pause 'Spring Sale_Broad' to prevent further loss",
          description: "Shift ₹3,000 budget to 'Retargeting_Q3'.",
          reasoning: 'This campaign is spending ₹8,500/day but has only 1.8× ROAS — well below your account average of 3.91×.',
          campaignName: 'Spring Sale_Broad', currentValue: 'Active', proposedValue: 'Paused',
          projectedImpact: { weeklySpendChange: -3000, weeklyRevenueChange: 0, roasChange: 0.5 },
          status: a === 2 ? 'applied' : 'pending',
        },
        {
          priority: 'P1', type: 'NEGATIVE_KEYWORD', title: 'Add 14 negative keywords from search term report',
          description: 'Block irrelevant search terms draining ₹3,400/week.',
          reasoning: 'Search term analysis found 14 terms with zero conversions and high spend.',
          campaignName: 'Spring Sale_Broad', currentValue: '0 negatives', proposedValue: '14 negatives',
          projectedImpact: { weeklySpendChange: -3400, weeklyRevenueChange: 0, roasChange: 0.8 },
          status: 'pending',
        },
        {
          priority: 'P2', type: 'BID_INCREASE', title: 'Increase bid on top performing keywords',
          description: "Keywords 'running shoes online' and 'premium leather shoes' deserve higher bids.",
          reasoning: 'These keywords have 8+ quality scores and high conversion rates, but are losing impression share.',
          campaignName: 'Brand Keywords Exact', currentValue: '₹15', proposedValue: '₹25',
          projectedImpact: { weeklySpendChange: 700, weeklyRevenueChange: 2800, roasChange: 0.3 },
          status: 'pending',
        },
        {
          priority: 'P2', type: 'BUDGET_SHIFT', title: 'Reallocate budget from Video to Shopping',
          description: 'Move ₹2,000/day from Video Awareness to Shopping Feed Main.',
          reasoning: 'Shopping campaigns show 85 AI score vs 60 for Video. Better ROAS expected.',
          campaignName: 'Video Awareness', currentValue: '₹5,000/day', proposedValue: '₹3,000/day',
          projectedImpact: { weeklySpendChange: 0, weeklyRevenueChange: 5000, roasChange: 0.4 },
          status: 'pending',
        },
        {
          priority: 'P3', type: 'AD_SCHEDULE', title: 'Pause campaigns during midnight hours',
          description: 'No conversions between 12 AM — 6 AM but spending ₹1,200/week.',
          reasoning: 'Hour-of-day analysis shows zero conversions in midnight hours across all campaigns.',
          campaignName: 'All Campaigns', currentValue: '24hr schedule', proposedValue: '6AM-12AM',
          projectedImpact: { weeklySpendChange: -1200, weeklyRevenueChange: 0, roasChange: 0.15 },
          status: 'pending',
        },
      ],
    });
  }

  // 6. Automation Rules
  const ruleDefs = [
    { name: 'Pause zero-convert keywords', isActive: true, conditions: [{ metric: 'conversions', operator: 'eq', value: 0, timeWindow: '14d' }, { metric: 'spend', operator: 'gt', value: 500, timeWindow: '14d' }], action: { type: 'PAUSE_KEYWORD', value: null, valueType: 'absolute' }, schedule: { frequency: 'hourly', time: '09:00', timezone: 'Asia/Kolkata' } },
    { name: 'Boost high-ROAS ad groups', isActive: false, conditions: [{ metric: 'roas', operator: 'gt', value: 5, timeWindow: '7d' }, { metric: 'spend', operator: 'gt', value: 1000, timeWindow: '7d' }], action: { type: 'INCREASE_BID', value: 20, valueType: 'percentage' }, schedule: { frequency: 'daily', time: '09:00', timezone: 'Asia/Kolkata' } },
    { name: 'Alert on sudden CPA spike', isActive: false, conditions: [{ metric: 'cpa', operator: 'gt', value: 100, timeWindow: '1d' }], action: { type: 'SEND_ALERT', value: null, valueType: 'absolute' }, schedule: { frequency: 'hourly', time: '09:00', timezone: 'Asia/Kolkata' } },
    { name: 'Budget cap protection', isActive: true, conditions: [{ metric: 'spend', operator: 'gte', value: 90, timeWindow: '1d' }], action: { type: 'DECREASE_BUDGET', value: 10, valueType: 'percentage' }, schedule: { frequency: 'hourly', time: '09:00', timezone: 'Asia/Kolkata' } },
    { name: 'Low quality score alert', isActive: true, conditions: [{ metric: 'quality_score', operator: 'lt', value: 5, timeWindow: '7d' }], action: { type: 'SEND_ALERT', value: null, valueType: 'absolute' }, schedule: { frequency: 'daily', time: '09:00', timezone: 'Asia/Kolkata' } },
  ];

  for (const def of ruleDefs) {
    await AutomationRule.create({
      userId,
      accountId: account._id,
      name: def.name,
      description: `Automated rule: ${def.name}`,
      isActive: def.isActive,
      scope: { applyTo: 'all_campaigns', campaignIds: [], adGroupIds: [] },
      conditions: def.conditions,
      conditionLogic: 'AND',
      action: def.action,
      schedule: def.schedule,
      notification: { notifyOnFire: true, email: true, inApp: true },
      executionCount: rand(5, 50),
      lastExecutedAt: new Date(Date.now() - rand(600000, 86400000)),
      lastExecutionStatus: 'success',
      nextExecutionAt: new Date(Date.now() + rand(600000, 86400000)),
    });
  }

  // 7. Reports
  for (let w = 0; w < 4; w++) {
    const endDate = new Date(Date.now() - 86400000 * 7 * w);
    const startDate = new Date(endDate.getTime() - 86400000 * 7);
    await Report.create({
      userId,
      accountId: account._id,
      type: 'weekly',
      period: { startDate, endDate },
      status: 'ready',
      summary: {
        totalSpend: rand(35000, 50000),
        totalRevenue: rand(120000, 200000),
        totalRoas: parseFloat((rand(25, 45) / 10).toFixed(1)),
        totalImpressions: rand(100000, 200000),
        totalClicks: rand(3000, 8000),
        totalConversions: rand(200, 600),
        wastedSpend: rand(4000, 8000),
        aiActionsApplied: rand(3, 12),
        improvementVsLastPeriod: parseFloat((rand(-5, 20)).toFixed(1)),
      },
      aiNarrative: {
        executiveSummary: `Campaign efficiency ${w === 0 ? 'improved significantly' : 'remained stable'} this week.${w === 0 ? ' The Q4 Retargeting segment drove the highest ROAS at 4.2×.' : ''} AdPilot applied ${rand(3, 8)} automated optimizations, resulting in a ${rand(5, 20)}% reduction in wasted spend compared to the previous period.`,
        winsThisWeek: [
          `CPA decreased by ${rand(5, 15)}% across all search campaigns`,
          `${rand(3, 8)} under-performing keywords auto-paused, saving ₹${rand(1000, 3000)}/week`,
          `Retargeting campaign ROAS hit ${(rand(35, 55) / 10).toFixed(1)}× — best in 30 days`,
        ],
        actionsNextWeek: [
          `Consider increasing daily budget on Shopping Feed Main by 15%`,
          `Review ${rand(5, 12)} new negative keyword suggestions from AI`,
          `Test new ad copy variations for Spring Sale campaign`,
        ],
        insights: [
          'Mobile CPC dropped 12% during evening hours — opportunity to scale',
          'Competitor bid activity increased on brand terms — monitor closely',
          'Quality scores improving on exact match keywords (avg 7.2 → 7.8)',
        ],
      },
      pdfUrl: null,
      emailSentAt: new Date(startDate.getTime() + 86400000 * 7 + 32400000),
    });
  }

  // 8. Notifications
  const notifDefs = [
    { type: 'waste_alert', title: 'Wasted spend detected', message: "'Spring Sale' campaign is burning ₹2,840/day on irrelevant placements.", severity: 'critical', isRead: false },
    { type: 'rule_fired', title: 'Rule executed: Pause zero-convert keywords', message: "3 keywords paused automatically. Estimated weekly savings: ₹1,200.", severity: 'info', isRead: false },
    { type: 'audit_complete', title: 'AI Audit completed', message: "Found 14 optimization opportunities. Account health score: 58/100.", severity: 'warning', isRead: false },
    { type: 'report_ready', title: 'Weekly report ready', message: "Your weekly performance report for Apr 14-20 is ready to view.", severity: 'info', isRead: true },
    { type: 'roas_drop', title: 'ROAS drop alert', message: "'Competitor Terms' ROAS dropped below 2× (currently 1.4×).", severity: 'warning', isRead: true },
    { type: 'recommendation_applied', title: 'Fix applied successfully', message: "23 negative keywords added to Spring Sale campaign.", severity: 'info', isRead: true },
    { type: 'budget_cap', title: 'Budget cap warning', message: "'Shopping Feed Main' reached 90% of daily budget by 3 PM.", severity: 'warning', isRead: false },
    { type: 'account_error', title: 'Sync completed', message: "All campaign data synced successfully. 8 campaigns, 142 keywords.", severity: 'info', isRead: true },
  ];

  for (let n = 0; n < notifDefs.length; n++) {
    await Notification.create({
      userId,
      type: notifDefs[n].type,
      title: notifDefs[n].title,
      message: notifDefs[n].message,
      severity: notifDefs[n].severity,
      isRead: notifDefs[n].isRead,
      actionUrl: notifDefs[n].type === 'audit_complete' ? '/ai-optimizer' : notifDefs[n].type === 'report_ready' ? '/reports' : '/dashboard',
      createdAt: new Date(Date.now() - rand(60000, 86400000 * 3)),
    });
  }

  return account;
}
