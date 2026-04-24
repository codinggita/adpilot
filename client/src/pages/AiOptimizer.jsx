import React, { useState } from 'react';
import { useRunAuditMutation, useGetAuditHistoryQuery, useGetAuditByIdQuery, useApplyRecommendationMutation, useDismissRecommendationMutation, useApplyAllRecommendationsMutation } from '../store/api/auditApi';

const fmt = (n) => { if (!n) return '₹0'; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`; return `₹${n}`; };

const AiOptimizer = () => {
  const [selectedAuditId, setSelectedAuditId] = useState(null);

  const { data: historyData, isLoading: histLoading } = useGetAuditHistoryQuery({ limit: 10 });
  const [runAudit, { isLoading: running }] = useRunAuditMutation();
  const [applyRec] = useApplyRecommendationMutation();
  const [dismissRec] = useDismissRecommendationMutation();
  const [applyAll, { isLoading: applyingAll }] = useApplyAllRecommendationsMutation();

  const audits = historyData?.data?.audits || [];
  const activeAuditId = selectedAuditId || audits[0]?._id;
  const { data: auditDetail } = useGetAuditByIdQuery(activeAuditId, { skip: !activeAuditId });
  const audit = auditDetail?.data?.audit;

  const handleRunAudit = async () => {
    const result = await runAudit();
    if (result?.data?.data?.audit?._id) {
      setSelectedAuditId(result.data.data.audit._id);
    }
  };

  const priorityColor = (p) => p === 'P1' ? 'bg-error text-white' : p === 'P2' ? 'bg-tertiary text-on-tertiary' : 'bg-[#3ECF8E] text-[#0f0f0f]';
  const statusBadge = (s) => s === 'applied' ? 'bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20' : s === 'dismissed' ? 'bg-surface-container text-on-surface-variant border-outline-variant' : 'bg-primary/10 text-primary border-primary/20';

  const score = audit?.summary?.accountHealthScore || 0;
  const strokeDashoffset = 282.7 - (282.7 * score / 100);
  const scoreColor = score >= 80 ? '#3ECF8E' : score >= 60 ? '#cfbcff' : '#e7c365';

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">AI Optimizer</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Automated audit and recommendations for your account.</p>
        </div>
        <button onClick={handleRunAudit} disabled={running}
          className="bg-primary text-on-primary font-medium px-5 py-2 rounded-full hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 disabled:opacity-50">
          <span className={`material-symbols-outlined text-[18px] ${running ? 'animate-spin' : ''}`}>refresh</span>
          {running ? 'Running Audit...' : 'Run New Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Audit Results */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col min-h-[500px]">
          {running ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-12 relative">
                <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-r from-[#3ECF8E] via-primary to-[#3ECF8E] flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                  <div className="w-[172px] h-[172px] rounded-full bg-surface-container-lowest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[64px] text-primary opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                </div>
              </div>
              <h2 className="font-h2 text-h2 text-center text-white mb-8">AI is auditing your account...</h2>
              <div className="w-full max-w-[320px] bg-surface rounded-lg p-4 border border-outline-variant">
                <ul className="font-label-caps text-[10px] leading-relaxed text-on-surface-variant space-y-2 opacity-70">
                  <li>&gt; FETCHING AD GROUPS... OK</li>
                  <li>&gt; ANALYZING KEYWORD MATCH TYPES... OK</li>
                  <li className="text-primary">&gt; EVALUATING BID STRATEGIES... IN PROGRESS</li>
                  <li>&gt; WAITING FOR IMPRESSION SHARE DATA...</li>
                </ul>
              </div>
            </div>
          ) : audit ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#3ECF8E] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-label-caps text-label-caps text-[#3ECF8E]">✦ AI Audit Complete</span>
              </div>
              <div className="flex items-center gap-6 mb-8 p-6 bg-surface rounded-xl border border-outline-variant w-full">
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#494551" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={scoreColor} strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-h2 text-[28px] font-bold text-white leading-none">{score}</span>
                    <span className="font-label-caps text-[8px] text-on-surface-variant">SCORE</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-body-lg text-body-lg text-white mb-1">{score >= 80 ? 'Healthy' : score >= 60 ? 'Moderate' : 'Attention Needed'}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {audit.recommendations?.filter(r => r.status === 'pending').length || 0} pending fixes available.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6 w-full">
                <div className="bg-surface border border-outline-variant rounded-lg p-3"><span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">WASTED SPEND</span><span className="font-h2 text-xl text-error font-medium">{fmt(audit.summary?.totalWastedSpend)}</span></div>
                <div className="bg-surface border border-outline-variant rounded-lg p-3"><span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">ISSUES</span><span className="font-h2 text-xl text-white font-medium">{audit.recommendations?.length || 0}</span></div>
                <div className="bg-surface border border-outline-variant rounded-lg p-3"><span className="font-label-caps text-[10px] text-on-surface-variant block mb-1">EST. UPLIFT</span><span className="font-h2 text-xl text-[#3ECF8E] font-medium">+{audit.summary?.projectedROASGain || 0}%</span></div>
              </div>
              <div className="w-full space-y-3 mb-6 flex-1 overflow-y-auto">
                {audit.recommendations?.map((rec) => (
                  <div key={rec._id} className="flex items-start gap-3 p-3 bg-surface border border-outline-variant rounded-lg">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${priorityColor(rec.priority)}`}>{rec.priority}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-body-md text-body-md text-white block">{rec.title}</span>
                      <span className="font-body-md text-[12px] text-on-surface-variant block mt-0.5">{rec.description}</span>
                      {rec.projectedImpact && (
                        <div className="flex gap-3 mt-1.5 text-[10px]">
                          {rec.projectedImpact.weeklySpendChange !== 0 && <span className={rec.projectedImpact.weeklySpendChange < 0 ? 'text-[#3ECF8E]' : 'text-error'}>Spend: {rec.projectedImpact.weeklySpendChange > 0 ? '+' : ''}{fmt(rec.projectedImpact.weeklySpendChange)}/wk</span>}
                          {rec.projectedImpact.roasChange > 0 && <span className="text-primary">ROAS: +{rec.projectedImpact.roasChange}×</span>}
                        </div>
                      )}
                    </div>
                    {rec.status === 'pending' ? (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => dismissRec({ auditId: audit._id, recId: rec._id })} className="px-2 py-1 rounded-full text-[10px] bg-surface-bright border border-outline-variant text-on-surface-variant hover:text-white">Dismiss</button>
                        <button onClick={() => applyRec({ auditId: audit._id, recId: rec._id })} className="px-2 py-1 rounded-full text-[10px] bg-primary text-on-primary font-medium">Apply</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusBadge(rec.status)}`}>{rec.status}</span>
                    )}
                  </div>
                ))}
              </div>
              {audit.recommendations?.some(r => r.status === 'pending') && (
                <button onClick={() => applyAll({ auditId: audit._id })} disabled={applyingAll}
                  className="w-full bg-[#3ECF8E] text-[#0f0f0f] font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-[#20a070] transition-colors disabled:opacity-50">
                  {applyingAll ? 'Applying...' : 'Apply All Pending Fixes'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">No audits yet. Click "Run New Audit" to start.</div>
          )}
        </div>

        {/* Right: Audit History */}
        <div className="flex flex-col gap-4">
          <h3 className="font-h2 text-[20px] text-on-surface font-semibold">Audit History</h3>
          {histLoading ? (
            <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : audits.map((a) => {
            const s = a.summary?.accountHealthScore || 0;
            const sColor = s >= 80 ? '#3ECF8E' : s >= 60 ? '#cfbcff' : '#e7c365';
            return (
              <div key={a._id} onClick={() => setSelectedAuditId(a._id)}
                className={`bg-surface-container-lowest border rounded-xl p-5 flex items-center gap-4 hover:border-outline transition-colors cursor-pointer ${activeAuditId === a._id ? 'border-primary' : 'border-outline-variant'}`}>
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#494551" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={sColor} strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * s / 100)} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-white font-bold text-sm">{s}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{new Date(a.startedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className={`font-label-caps text-label-caps mt-1`} style={{ color: sColor }}>{s >= 80 ? 'Healthy' : s >= 60 ? 'Moderate' : 'Attention Needed'}</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">{a.triggeredBy} · {a.summary?.totalActions || 0} actions</div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AiOptimizer;
