import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetOverviewQuery, useGetTrendsQuery } from '../store/api/analyticsApi';
import { useGetCampaignsQuery } from '../store/api/campaignApi';
import { useGetAuditHistoryQuery } from '../store/api/auditApi';
import { useSeedDemoDataMutation, useGetAccountStatusQuery } from '../store/api/usersApi';

const fmt = (n) => {
  if (n === undefined || n === null) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const MainDashBoard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30');
  const [seeded, setSeeded] = useState(false);

  const { data: accountData, isLoading: accLoading } = useGetAccountStatusQuery();
  const [seedDemo, { isLoading: seeding }] = useSeedDemoDataMutation();

  useEffect(() => {
    if (!accLoading && accountData?.data?.hasAccount === false && !seeded) {
      seedDemo().then(() => setSeeded(true));
    }
  }, [accLoading, accountData, seeded, seedDemo]);

  const { data: overview, isLoading: ovLoading } = useGetOverviewQuery({ period });
  const { data: trendsData } = useGetTrendsQuery({ period });
  const { data: campData } = useGetCampaignsQuery({ limit: 5, sortBy: 'aiScore', sortOrder: 'desc' });
  const { data: auditData } = useGetAuditHistoryQuery({ limit: 1 });

  const ov = overview?.data || {};
  const trends = trendsData?.data?.data || [];
  const campaigns = campData?.data?.campaigns || [];
  const latestAudit = auditData?.data?.audits?.[0];

  const periods = [{ label: '7D', value: '7' }, { label: '30D', value: '30' }, { label: '90D', value: '90' }];

  const maxRevenue = Math.max(...trends.map(t => t.revenue), 1);
  const maxSpend = Math.max(...trends.map(t => t.spend), 1);

  if (seeding || accLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-on-surface-variant font-body-md text-body-md">Setting up your demo account...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Alert Bar */}
      {ov.wastedSpend > 0 && (
        <div className="bg-error-container border border-error rounded-lg p-4 flex items-start gap-3 w-full">
          <span className="material-symbols-outlined text-error mt-0.5">warning</span>
          <div className="flex-1">
            <p className="text-on-error-container font-body-md text-body-md">
              <strong className="font-semibold text-error">Wasted spend detected:</strong> {fmt(ov.wastedSpend)} identified in low-performing search terms and placements.
            </p>
          </div>
          <button onClick={() => navigate('/ai-optimizer')} className="text-error font-semibold hover:underline flex items-center gap-1 shrink-0">
            View fixes <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex items-end justify-between w-full mt-4">
        <div>
          <h1 className="font-h2 text-h2 text-on-surface m-0 leading-tight">Campaign Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-surface-container rounded-full border border-outline-variant">
            {periods.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`px-4 py-1 rounded-full font-medium transition-colors ${period === p.value ? 'bg-surface-variant text-on-surface border border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/ai-optimizer')} className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-full flex items-center gap-2 border border-primary hover:bg-primary-fixed transition-colors">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            RUN AI AUDIT
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-5 gap-4 w-full">
        <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Spend</span>
          <div className="font-h1 text-[28px] font-semibold text-on-surface mt-2">{fmt(ov.spend)}</div>
          {ov.vsLastPeriod && <span className={`text-xs ${ov.vsLastPeriod.spend > 0 ? 'text-error' : 'text-[#3ECF8E]'}`}>{ov.vsLastPeriod.spend > 0 ? '+' : ''}{ov.vsLastPeriod.spend}%</span>}
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Revenue</span>
          <div className="font-h1 text-[28px] font-semibold text-primary mt-2 flex items-center gap-2">
            {fmt(ov.revenue)}
            {ov.vsLastPeriod?.revenue > 0 && <span className="material-symbols-outlined text-[20px] text-primary">trending_up</span>}
          </div>
          {ov.vsLastPeriod && <span className="text-xs text-[#3ECF8E]">+{ov.vsLastPeriod.revenue}%</span>}
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">ROAS</span>
          <div className="font-h1 text-[28px] font-semibold text-on-surface mt-2">{ov.roas || 0}×</div>
        </div>
        <div className="bg-surface border border-error rounded-lg p-4 flex flex-col justify-between min-h-[100px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-error/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
          <span className="font-label-caps text-label-caps text-error uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span> Wasted Spend
          </span>
          <div className="font-h1 text-[28px] font-semibold text-error mt-2">{fmt(ov.wastedSpend)}</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between min-h-[100px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Impressions</span>
          <div className="font-h1 text-[28px] font-semibold text-on-surface mt-2">{ov.impressions ? `${(ov.impressions / 1000).toFixed(0)}K` : '—'}</div>
        </div>
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-12 md:col-span-8 bg-surface border border-outline-variant rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body-lg text-body-lg font-medium text-on-surface">Spend vs Revenue</h3>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-surface-container-highest"></div> Spend</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary/80"></div> Revenue</div>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-1 h-48 border-b border-outline-variant pb-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              <div className="w-full border-t border-outline-variant/30 h-0"></div>
              <div className="w-full border-t border-outline-variant/30 h-0"></div>
              <div className="w-full border-t border-outline-variant/30 h-0"></div>
            </div>
            {(trends.length > 0 ? trends.slice(-14) : [{spend:30,revenue:45},{spend:40,revenue:60},{spend:35,revenue:75},{spend:50,revenue:90},{spend:20,revenue:30}]).map((t, i) => (
              <div key={i} className="flex-1 flex items-end justify-center gap-[2px] relative z-10">
                <div className="w-1/3 bg-surface-container-highest rounded-t-sm transition-all" style={{ height: `${Math.max((t.spend / maxSpend) * 180, 4)}px` }}></div>
                <div className="w-1/3 bg-primary/80 rounded-t-sm transition-all" style={{ height: `${Math.max((t.revenue / maxRevenue) * 180, 4)}px` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-on-surface-variant px-4">
            {trends.slice(-5).map((t, i) => <span key={i}>{new Date(t.date).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</span>)}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface border border-outline-variant rounded-lg p-6 flex flex-col">
          <h3 className="font-body-lg text-body-lg font-medium text-on-surface mb-6">Quick Stats</h3>
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-on-surface font-medium">Active Campaigns</span><span className="text-primary font-semibold">{ov.activeCampaigns || 0}</span></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-on-surface font-medium">CTR</span><span className="text-on-surface font-semibold">{ov.ctr || 0}%</span></div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((ov.ctr || 0) * 15, 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-on-surface font-medium">Avg CPC</span><span className="text-on-surface font-semibold">₹{ov.cpc || 0}</span></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-on-surface font-medium">Conversion Rate</span><span className="text-[#3ECF8E] font-semibold">{ov.conversionRate || 0}%</span></div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full bg-[#3ECF8E] rounded-full" style={{ width: `${Math.min((ov.conversionRate || 0) * 10, 100)}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table & AI Recommendations Row */}
      <div className="grid grid-cols-12 gap-4 w-full mb-6">
        <div className="col-span-12 md:col-span-8 bg-surface border border-outline-variant rounded-lg overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-body-lg text-body-lg font-medium text-on-surface">Top Campaigns</h3>
            <button onClick={() => navigate('/campaigns')} className="text-xs font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 font-medium">Campaign Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Spend (7d)</th>
                  <th className="px-4 py-3 font-medium text-right">ROAS</th>
                  <th className="px-4 py-3 font-medium text-center">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-on-surface">
                {campaigns.map((c, i) => (
                  <tr key={c._id || i} onClick={() => navigate('/campaigns')} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'ENABLED' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ENABLED' ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                        {c.status === 'ENABLED' ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{fmt(c.weekSpend)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${c.roas < 2 ? 'text-error' : ''}`}>{c.roas}×</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-label-caps text-label-caps ${c.aiScore >= 80 ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20' : c.aiScore >= 50 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                        {c.aiScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface border-y border-r border-l-2 border-outline-variant border-l-primary rounded-lg p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="font-body-lg text-body-lg font-medium text-on-surface">AI Recommendations</h3>
          </div>
          {latestAudit ? (
            <div className="flex flex-col gap-4">
              <div className="text-xs text-on-surface-variant mb-1">Health Score: <span className="text-primary font-semibold">{latestAudit.summary?.accountHealthScore}/100</span></div>
              <div className="bg-surface-container border border-outline-variant rounded p-3 text-sm">
                <p className="text-on-surface mb-2">Your latest audit found <strong className="font-medium">{latestAudit.summary?.totalActions || 0}</strong> optimization opportunities with estimated savings of <strong className="text-[#3ECF8E]">{fmt(latestAudit.summary?.totalWastedSpend)}</strong>.</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/ai-optimizer')} className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-medium hover:bg-primary-fixed transition-colors">View All Fixes</button>
                </div>
              </div>
              <button onClick={() => navigate('/ai-optimizer')} className="bg-transparent border border-primary text-primary px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/10 transition-colors">
                View Full Audit Report
              </button>
            </div>
          ) : (
            <div className="text-on-surface-variant text-sm">Run your first AI audit to get recommendations.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainDashBoard;
