import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOverviewQuery, useGetTrendsQuery } from '../store/api/analyticsApi';

const fmt = (n) => { if (!n) return '—'; if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`; if (n >= 1000) return `₹${(n/1000).toFixed(1)}K`; return `₹${n}`; };

const Analytics = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30');
  const periodOpts = [{ l: 'Last 7 Days', v: '7' }, { l: 'Last 30 Days', v: '30' }, { l: 'Last 90 Days', v: '90' }];

  const { data: ovData } = useGetOverviewQuery({ period });
  const { data: trendData } = useGetTrendsQuery({ period });
  const ov = ovData?.data || {};
  const trends = trendData?.data?.data || [];

  const metrics = [
    { label: 'TOTAL SPEND', value: fmt(ov.spend), change: `${ov.vsLastPeriod?.spend > 0 ? '+' : ''}${ov.vsLastPeriod?.spend || 0}%`, icon: ov.vsLastPeriod?.spend > 0 ? 'trending_up' : 'trending_down', color: ov.vsLastPeriod?.spend < 0 ? 'text-[#3ECF8E]' : 'text-error' },
    { label: 'REVENUE', value: fmt(ov.revenue), change: `${ov.vsLastPeriod?.revenue > 0 ? '+' : ''}${ov.vsLastPeriod?.revenue || 0}%`, icon: 'trending_up', color: 'text-[#3ECF8E]' },
    { label: 'BLENDED ROAS', value: `${ov.roas || 0}×`, change: `${ov.vsLastPeriod?.roas > 0 ? '+' : ''}${ov.vsLastPeriod?.roas || 0}×`, icon: 'trending_up', color: 'text-[#3ECF8E]' },
    { label: 'ACTIVE CAMPAIGNS', value: ov.activeCampaigns || 0, change: `${ov.pausedCampaigns || 0} paused`, icon: 'horizontal_rule', color: 'text-on-surface-variant' },
    { label: 'AVG CPC', value: `₹${ov.cpc || 0}`, change: 'per click', icon: 'trending_up', color: 'text-on-surface-variant' },
    { label: 'CONVERSION RATE', value: `${ov.conversionRate || 0}%`, change: `${ov.conversions || 0} total`, icon: 'trending_up', color: 'text-[#3ECF8E]' },
  ];

  const maxVal = Math.max(...trends.map(t => Math.max(t.revenue, t.spend)), 1);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Performance Analytics</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time telemetry across all active campaigns.</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-surface-container border border-outline-variant rounded-md px-3 py-1.5 text-sm text-on-surface-variant cursor-pointer">
          {periodOpts.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between h-[120px]">
            <span className="font-label-caps text-label-caps text-on-surface-variant">{m.label}</span>
            <div className="mt-auto">
              <div className="font-h2 text-[28px] leading-tight text-on-surface">{m.value}</div>
              <div className={`flex items-center gap-1 mt-1 ${m.color} text-xs font-medium`}>
                <span className="material-symbols-outlined text-[14px]">{m.icon}</span><span>{m.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div><h3 className="font-semibold text-lg text-on-surface">Revenue vs Spend</h3><p className="text-sm text-on-surface-variant">Daily aggregation</p></div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3ECF8E]"></div><span className="text-xs text-on-surface-variant">Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-outline-variant"></div><span className="text-xs text-on-surface-variant">Spend</span></div>
          </div>
        </div>
        <div className="h-[300px] flex items-end gap-1 border-b border-l border-outline-variant/30 pb-2 px-1">
          {trends.map((t, i) => (
            <div key={i} className="flex-1 flex items-end justify-center gap-[1px] group relative">
              <div className="w-1/3 bg-outline-variant rounded-t-sm transition-all group-hover:bg-outline" style={{ height: `${(t.spend / maxVal) * 270}px` }}></div>
              <div className="w-1/3 bg-[#3ECF8E] rounded-t-sm transition-all group-hover:brightness-110" style={{ height: `${(t.revenue / maxVal) * 270}px` }}></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10">
                R: {fmt(t.revenue)} · S: {fmt(t.spend)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant mt-2 px-1">
          {trends.filter((_, i) => i % Math.max(Math.floor(trends.length / 5), 1) === 0).slice(0, 5).map((t, i) => <span key={i}>{new Date(t.date).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</span>)}
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-surface-container border border-primary/40 rounded-xl p-4 relative overflow-hidden flex items-start gap-4">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-on-surface mb-1">AI Recommendations</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Based on the last {period} days of data, your campaigns show {ov.roas > 3 ? 'healthy ROAS' : 'room for improvement'}. {ov.wastedSpend > 0 ? `There is ${fmt(ov.wastedSpend)} in identified waste that can be recovered.` : 'No major waste detected.'}
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/ai-optimizer')} className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary-fixed transition-colors">Run AI Audit</button>
            <button onClick={() => navigate('/campaigns')} className="bg-transparent border border-outline-variant text-on-surface text-xs font-semibold px-4 py-2 rounded-full hover:bg-surface-variant transition-colors">View Campaigns</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
