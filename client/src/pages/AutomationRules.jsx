import React, { useState, useEffect } from 'react';
import { useGetRulesQuery, useToggleRuleMutation, useCreateRuleMutation, useUpdateRuleMutation, useDeleteRuleMutation } from '../store/api/rulesApi';

const freqLabels = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly' };
const actionLabels = { PAUSE_KEYWORD: 'Pause Entity', INCREASE_BID: 'Increase Bid', DECREASE_BID: 'Decrease Bid', INCREASE_BUDGET: 'Increase Budget', DECREASE_BUDGET: 'Decrease Budget', SEND_ALERT: 'Send Alert' };
const metricOpts = ['spend', 'conversions', 'roas', 'cpa', 'ctr', 'clicks', 'quality_score'];
const operatorOpts = [{ v: 'gt', l: '>' }, { v: 'lt', l: '<' }, { v: 'gte', l: '>=' }, { v: 'eq', l: '=' }];
const windowOpts = ['1d', '7d', '14d', '30d'];

const AutomationRules = () => {
  const { data, isLoading } = useGetRulesQuery({});
  const [toggleRule] = useToggleRuleMutation();
  const [createRule] = useCreateRuleMutation();
  const [updateRule] = useUpdateRuleMutation();
  const [deleteRule] = useDeleteRuleMutation();

  const rules = data?.data?.rules || [];
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [dirty, setDirty] = useState(false);

  const sel = rules.find(r => r._id === selectedId) || rules[0];

  useEffect(() => {
    if (sel && (!form || !dirty)) {
      setForm({ name: sel.name, conditions: sel.conditions || [], conditionLogic: sel.conditionLogic || 'AND', action: sel.action || { type: 'SEND_ALERT' }, schedule: sel.schedule || { frequency: 'daily', time: '09:00' } });
    }
  }, [sel?._id]);

  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setDirty(true); };
  const updCond = (i, f, v) => { const c = [...form.conditions]; c[i] = { ...c[i], [f]: f === 'value' ? Number(v) : v }; upd('conditions', c); };

  const save = async () => { if (sel?._id) await updateRule({ ruleId: sel._id, ...form }); else await createRule(form); setDirty(false); };
  const newRule = async () => { const r = await createRule({ name: 'New Rule', isActive: false, conditions: [{ metric: 'spend', operator: 'gt', value: 100, timeWindow: '7d' }], conditionLogic: 'AND', action: { type: 'SEND_ALERT', valueType: 'absolute' }, schedule: { frequency: 'daily', time: '09:00', timezone: 'Asia/Kolkata' } }); if (r?.data?.data?.rule?._id) setSelectedId(r.data.data.rule._id); };
  const pick = (r) => { setSelectedId(r._id); setForm({ name: r.name, conditions: r.conditions || [], conditionLogic: r.conditionLogic || 'AND', action: r.action || {}, schedule: r.schedule || {} }); setDirty(false); };
  const timeAgo = (d) => { if (!d) return 'Never'; const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 60) return `${m}m ago`; return m < 1440 ? `${Math.floor(m/60)}h ago` : `${Math.floor(m/1440)}d ago`; };

  return (
    <div className="flex gap-0 -mx-6 -mt-6 h-[calc(100vh-64px)]">
      <aside className="w-[380px] border-r border-outline-variant bg-background flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-outline-variant"><h2 className="font-h2 text-[18px] text-white font-semibold">Rules ({rules.length})</h2></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> :
          rules.map(rule => (
            <div key={rule._id} onClick={() => pick(rule)} className={`bg-surface-container-low border rounded-xl p-4 cursor-pointer relative overflow-hidden transition-colors ${rule.isActive ? 'border-[#3ECF8E]/30' : 'border-outline-variant hover:border-outline'} ${(selectedId === rule._id || (!selectedId && rule._id === rules[0]?._id)) ? 'ring-1 ring-primary' : ''}`}>
              {rule.isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3ECF8E]" />}
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-medium text-sm ${rule.isActive ? 'text-white' : 'text-on-surface-variant'}`}>{rule.name}</h3>
                <button onClick={e => { e.stopPropagation(); toggleRule({ ruleId: rule._id, isActive: !rule.isActive }); }} className={`relative inline-block w-8 h-4 rounded-full ${rule.isActive ? 'bg-[#3ECF8E]/20' : 'bg-surface-container-high border border-outline-variant'}`}>
                  <span className={`absolute inset-y-0 left-0 w-4 h-4 rounded-full shadow transition-transform ${rule.isActive ? 'bg-[#3ECF8E] translate-x-4' : 'bg-outline'}`} />
                </button>
              </div>
              <div className="flex gap-2 mb-3"><span className="px-2 py-0.5 rounded text-[10px] font-label-caps bg-surface-container-high text-on-surface-variant border border-outline-variant">{freqLabels[rule.schedule?.frequency] || 'Daily'}</span></div>
              <div className="text-xs text-on-surface-variant font-label-caps">Runs: {rule.executionCount || 0} · Last: {timeAgo(rule.lastExecutedAt)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-outline-variant">
          <button onClick={newRule} className="w-full flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant hover:text-white py-2 rounded-full text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span> New Blank Rule
          </button>
        </div>
      </aside>

      {form && (
        <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto">
          <div className="p-6 flex justify-between items-end border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[#3ECF8E] text-[18px]">rule</span><span className="text-xs font-label-caps text-[#3ECF8E]">RULE EDITOR</span></div>
              <input value={form.name} onChange={e => upd('name', e.target.value)} className="text-2xl font-bold text-white bg-transparent border-none outline-none w-full" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { if(sel) pick(sel); }} disabled={!dirty} className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant text-sm disabled:opacity-30">Discard</button>
              <button onClick={save} disabled={!dirty} className="px-4 py-2 rounded-full bg-[#3ECF8E] text-[#0f0f0f] text-sm font-semibold disabled:opacity-30 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">save</span> Save</button>
            </div>
          </div>

          <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2"><span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-xs border border-outline-variant">IF</span> Conditions</h3>
                <div className="flex bg-surface p-1 rounded-lg border border-outline-variant">
                  {['AND','OR'].map(l => <button key={l} onClick={() => upd('conditionLogic',l)} className={`px-3 py-1 text-xs font-medium ${form.conditionLogic===l?'bg-surface-container-high text-white rounded shadow-sm':'text-on-surface-variant'}`}>{l}</button>)}
                </div>
              </div>
              <div className="space-y-3">
                {form.conditions.map((c,i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-outline-variant/50">
                    <select value={c.metric} onChange={e => updCond(i,'metric',e.target.value)} className="w-1/4 bg-transparent border border-outline-variant rounded-lg text-sm py-1.5">{metricOpts.map(m => <option key={m}>{m}</option>)}</select>
                    <select value={c.operator} onChange={e => updCond(i,'operator',e.target.value)} className="w-1/6 bg-transparent border border-outline-variant rounded-lg text-sm text-[#3ECF8E] py-1.5">{operatorOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
                    <input type="number" value={c.value} onChange={e => updCond(i,'value',e.target.value)} className="w-1/6 bg-transparent border border-outline-variant rounded-lg text-sm text-white py-1.5 px-3" />
                    <select value={c.timeWindow} onChange={e => updCond(i,'timeWindow',e.target.value)} className="w-1/6 bg-transparent border border-outline-variant rounded-lg text-sm py-1.5">{windowOpts.map(w => <option key={w}>{w}</option>)}</select>
                    <button onClick={() => upd('conditions', form.conditions.filter((_,j) => j!==i))} className="text-on-surface-variant hover:text-error p-1"><span className="material-symbols-outlined text-[18px]">close</span></button>
                  </div>
                ))}
                <button onClick={() => upd('conditions',[...form.conditions,{metric:'spend',operator:'gt',value:0,timeWindow:'7d'}])} className="mt-2 flex items-center gap-2 text-xs text-[#3ECF8E] border border-dashed border-[#3ECF8E]/30 rounded-lg px-4 py-2 w-full justify-center"><span className="material-symbols-outlined text-[16px]">add</span> Add Condition</button>
              </div>
            </div>

            <div className="bg-surface-container-low border border-[#3ECF8E]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6"><span className="px-2 py-1 bg-[#3ECF8E]/10 text-[#3ECF8E] rounded text-xs border border-[#3ECF8E]/20">THEN</span> Action</h3>
              <select value={form.action?.type||''} onChange={e => upd('action',{...form.action,type:e.target.value})} className="w-full bg-transparent border border-outline-variant rounded-lg text-sm text-white py-2">{Object.entries(actionLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-on-surface-variant">schedule</span> Schedule</h3>
              <select value={form.schedule?.frequency||'daily'} onChange={e => upd('schedule',{...form.schedule,frequency:e.target.value})} className="w-full bg-transparent border border-outline-variant rounded-lg text-sm text-white py-2">{Object.entries(freqLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>

            {sel?._id && <div className="flex justify-end"><button onClick={async () => { await deleteRule(sel._id); setSelectedId(null); setForm(null); }} className="text-error text-sm hover:underline flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">delete</span> Delete Rule</button></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationRules;
