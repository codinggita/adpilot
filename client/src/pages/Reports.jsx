import React, { useState } from 'react';
import { useGetReportsQuery, useGetReportByIdQuery, useGenerateReportMutation } from '../store/api/reportsApi';

const fmt = (n) => { if (!n) return '₹0'; if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`; if (n >= 1000) return `₹${(n/1000).toFixed(1)}K`; return `₹${n}`; };

const Reports = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { data: listData, isLoading } = useGetReportsQuery({ limit: 10 });
  const [generateReport, { isLoading: generating }] = useGenerateReportMutation();

  const reports = listData?.data?.reports || [];
  const activeId = selectedId || reports[0]?._id;
  const { data: detailData } = useGetReportByIdQuery(activeId, { skip: !activeId });
  const report = detailData?.data?.report;

  const handleGenerate = async () => { const r = await generateReport(); if (r?.data?.data?.report?._id) setSelectedId(r.data.data.report._id); };

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Reports</h2>
          <p className="text-on-surface-variant text-sm mt-1">{reports.length} reports available</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="bg-primary text-on-primary px-5 py-2 rounded-full font-medium hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 disabled:opacity-50">
          <span className={`material-symbols-outlined text-[18px] ${generating ? 'animate-spin' : ''}`}>{generating ? 'progress_activity' : 'add'}</span>
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reports.map(r => (
          <button key={r._id} onClick={() => setSelectedId(r._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeId === r._id ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white'}`}>
            {new Date(r.period?.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — {new Date(r.period?.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>

      {/* Report Card */}
      {report && (
        <div className="w-full max-w-[1000px] mx-auto bg-[#f8f8fc] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden" style={{ color: '#1a1a1a' }}>
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#8a63e5] to-[#3ECF8E]" />
          <div className="p-8 md:p-12 flex flex-col gap-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e2e2e8] pb-6 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4"><div className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-white"><span className="material-symbols-outlined text-[14px]">rocket_launch</span></div><span className="font-h2 font-bold text-[14px]">AdPilot AI</span></div>
                <h1 className="font-h1 text-[36px] font-bold text-[#1a1a1a] leading-tight">Weekly Performance Review</h1>
              </div>
              <div className="text-right">
                <div className="font-label-caps text-label-caps text-[#777] mb-1">REPORTING PERIOD</div>
                <div className="font-h2 font-semibold text-[16px]">{new Date(report.period?.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — {new Date(report.period?.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </header>

            {/* KPIs */}
            <section>
              <h2 className="font-label-caps text-label-caps text-[#555] mb-4">EXECUTIVE SUMMARY</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{ label: 'TOTAL SPEND', value: fmt(report.summary?.totalSpend), change: `${report.summary?.improvementVsLastPeriod > 0 ? '+' : ''}${report.summary?.improvementVsLastPeriod}%`, up: report.summary?.improvementVsLastPeriod > 0 },
                  { label: 'CONVERSIONS', value: report.summary?.totalConversions?.toLocaleString(), change: `AI applied ${report.summary?.aiActionsApplied} fixes`, up: true },
                  { label: 'WASTED SPEND', value: fmt(report.summary?.wastedSpend), change: 'Identified by AI', up: false },
                  { label: 'ROAS', value: `${report.summary?.totalRoas}×`, change: 'Blended average', up: true },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white border border-[#e2e2e8] rounded-lg p-5">
                    <span className="font-label-caps text-[11px] text-[#777]">{kpi.label}</span>
                    <div className="font-h2 text-[28px] font-bold mt-2">{kpi.value}</div>
                    <div className="flex items-center gap-1 mt-2 text-[#3ECF8E] text-[13px] font-medium">
                      <span className="material-symbols-outlined text-[16px]">{kpi.up ? 'trending_up' : 'trending_down'}</span>
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Narrative */}
            <section className="bg-white border border-[#e2e2e8] border-l-4 border-l-primary rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[#8a63e5]">auto_awesome</span></div>
                <div>
                  <h3 className="font-h2 font-semibold text-[18px] mb-2">AI Insights</h3>
                  <p className="text-[#444] leading-relaxed mb-4">{report.aiNarrative?.executiveSummary}</p>
                  {report.aiNarrative?.winsThisWeek?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">✅ Wins This Week</h4>
                      <ul className="text-sm text-[#444] space-y-1">{report.aiNarrative.winsThisWeek.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                    </div>
                  )}
                  {report.aiNarrative?.actionsNextWeek?.length > 0 && (
                    <div className="bg-[#f8f8fc] rounded p-4 text-sm border border-[#e2e2e8]">
                      <h4 className="font-semibold mb-2">📋 Recommended Actions</h4>
                      <ul className="text-[#444] space-y-1">{report.aiNarrative.actionsNextWeek.map((a, i) => <li key={i}>• {a}</li>)}</ul>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <footer className="mt-4 pt-6 border-t border-[#e2e2e8] text-center">
              <p className="font-label-caps text-[10px] text-[#999]">CONFIDENTIAL © 2024 ADPILOT AI</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
