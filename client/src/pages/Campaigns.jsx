import React, { useState } from 'react';
import { useGetCampaignsQuery, usePauseCampaignMutation, useEnableCampaignMutation, useGetCampaignByIdQuery } from '../store/api/campaignApi';

const fmt = (n) => { if (!n) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`; return `₹${n}`; };

const Campaigns = () => {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useGetCampaignsQuery({ status: filter, limit: 20, sortBy: 'weekSpend', sortOrder: 'desc' });
  const { data: detailData } = useGetCampaignByIdQuery(selectedId, { skip: !selectedId });
  const [pauseCamp, { isLoading: pausing }] = usePauseCampaignMutation();
  const [enableCamp, { isLoading: enabling }] = useEnableCampaignMutation();


  const campaigns = data?.data?.campaigns || [];
  const detail = detailData?.data?.campaign;

  const detailKeywords = detailData?.data?.topKeywords || [];
  const showPanel = !!selectedId && !!detail;

  const typeIcons = { SEARCH: 'search', DISPLAY: 'display_settings', SHOPPING: 'shopping_cart', VIDEO: 'videocam' };

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-h2 text-h2 text-white">Campaigns</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and optimize your ad spend</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant">
              {['all', 'active', 'paused'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded font-body-md text-body-md capitalize transition-colors ${filter === f ? 'bg-surface-container-high text-white shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active', value: campaigns.filter(c => c.status === 'ENABLED').length, icon: 'play_circle', color: 'text-[#3ECF8E]' },
            { label: 'Paused', value: campaigns.filter(c => c.status === 'PAUSED').length, icon: 'pause_circle', color: 'text-on-surface-variant' },
            { label: 'Avg ROAS', value: campaigns.length ? (campaigns.reduce((a, c) => a + (c.roas || 0), 0) / campaigns.length).toFixed(1) + '×' : '—', icon: 'payments', color: 'text-[#3ECF8E]' },
            { label: 'Total Spend', value: fmt(campaigns.reduce((a, c) => a + (c.weekSpend || 0), 0)), icon: 'account_balance_wallet', color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-outline-variant">
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{stat.label}</span>
                <span className={`material-symbols-outlined ${stat.color} text-[20px]`}>{stat.icon}</span>
              </div>
              <div className="font-h2 text-h2 text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface rounded-xl border border-outline-variant flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-outline-variant bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase">
            <div>Campaign Name</div><div>Status</div><div className="text-right">Budget/day</div><div className="text-right">Spend (7d)</div><div className="text-right">CTR</div><div className="text-right">ROAS</div><div className="text-center">AI Score</div><div className="w-10" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : campaigns.map((c) => (
              <div key={c._id} onClick={() => setSelectedId(c._id)}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 p-4 border-b items-center font-body-md text-body-md cursor-pointer group transition-colors ${c.aiScore < 50 ? 'border-error hover:bg-[#3d1818] bg-[#2a1313] relative' : 'border-outline-variant hover:bg-surface-container-high'} ${selectedId === c._id ? 'bg-surface-container-high' : ''}`}>
                {c.aiScore < 50 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${c.aiScore < 50 ? 'bg-[#3d1818] border border-error text-error' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[18px]">{typeIcons[c.type] || 'campaign'}</span>
                  </div>
                  <span className="text-white font-medium group-hover:text-primary transition-colors">{c.name}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-label-caps text-label-caps ${c.status === 'ENABLED' ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ENABLED' ? 'bg-[#3ECF8E]' : 'bg-on-surface-variant'}`} /> {c.status === 'ENABLED' ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
                <div className="text-right text-on-surface-variant">{fmt(c.dailyBudget)}</div>
                <div className={`text-right ${c.aiScore < 50 ? 'text-error font-medium' : 'text-white'}`}>{fmt(c.weekSpend)}</div>
                <div className="text-right text-white">{c.ctr}%</div>
                <div className={`text-right font-medium ${c.roas < 2 ? 'text-error' : 'text-[#3ECF8E]'}`}>{c.roas}×</div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-label-caps text-label-caps ${c.aiScore >= 80 ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20' : c.aiScore >= 50 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                    {c.aiScore}
                  </span>
                </div>
                <div className="w-10 flex justify-end"><span className="material-symbols-outlined text-on-surface-variant">chevron_right</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {showPanel && (
        <div className="hidden xl:flex flex-col w-[400px] bg-surface border border-outline-variant rounded-xl overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-outline-variant flex justify-between items-start bg-surface-container-low">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center mt-1 ${detail.aiScore < 50 ? 'bg-[#3d1818] border border-error text-error' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}>
                <span className="material-symbols-outlined">{typeIcons[detail.type] || 'campaign'}</span>
              </div>
              <div>
                <h2 className="font-h2 text-[20px] text-white leading-tight">{detail.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-label-caps text-label-caps ${detail.status === 'ENABLED' ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${detail.status === 'ENABLED' ? 'bg-[#3ECF8E]' : 'bg-on-surface-variant'}`} /> {detail.status === 'ENABLED' ? 'ACTIVE' : 'PAUSED'}
                  </span>
                  <span className="text-on-surface-variant text-xs">{detail.type}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-on-surface-variant hover:text-white transition-colors p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* AI Score */}
            <div className="bg-surface-container border border-primary rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#3ECF8E]" />
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold">AI Score: {detail.aiScore}/100</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {detail.aiScoreBreakdown && Object.entries(detail.aiScoreBreakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-on-surface-variant capitalize">{k.replace(/([A-Z])/g, ' $1')}</span><span className="text-white">{v}</span></div>
                ))}
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3">
                <div className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">Daily Budget</div>
                <div className="text-[16px] text-white">{fmt(detail.dailyBudget)}</div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3">
                <div className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">Strategy</div>
                <div className="text-[14px] text-white">{detail.biddingStrategy?.replace(/_/g, ' ')}</div>
              </div>
            </div>

            {/* Keywords */}
            {detailKeywords.length > 0 && (
              <div className="mt-2">
                <h4 className="text-white font-medium mb-3">Top Keywords</h4>
                <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
                  {detailKeywords.slice(0, 5).map((kw, i) => (
                    <div key={kw._id || i} className={`p-2.5 flex justify-between items-center hover:bg-surface-container-high transition-colors ${i < detailKeywords.length - 1 ? 'border-b border-outline-variant' : ''}`}>
                      <div>
                        <span className="text-[13px] text-white">{kw.text}</span>
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${kw.aiTag === 'TOP_PERFORMER' ? 'bg-[#3ECF8E]/10 text-[#3ECF8E]' : kw.aiTag === 'WASTING_BUDGET' ? 'bg-error/10 text-error' : 'bg-surface-container text-on-surface-variant'}`}>{kw.aiTag?.replace(/_/g, ' ')}</span>
                      </div>
                      <span className={`text-[13px] ${kw.aiTag === 'WASTING_BUDGET' ? 'text-error' : 'text-on-surface-variant'}`}>{fmt(kw.metrics7d?.spend)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex gap-3">
            {detail.status === 'ENABLED' ? (
              <button onClick={() => pauseCamp(detail._id)} disabled={pausing}
                className="py-2 px-4 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">pause</span> {pausing ? 'Pausing...' : 'Pause'}
              </button>
            ) : (
              <button onClick={() => enableCamp(detail._id)} disabled={enabling}
                className="py-2 px-4 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-[#3ECF8E] hover:bg-[#3ECF8E]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">play_arrow</span> {enabling ? 'Enabling...' : 'Enable'}
              </button>
            )}
            <button className="flex-1 py-2 px-4 rounded-full bg-surface-container-high border border-outline-variant text-white hover:border-primary transition-colors text-center">
              Edit Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
