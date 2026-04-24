import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useUpdateProfileMutation } from '../store/api/usersApi';

const settingsTabs = ['General', 'Integrations', 'AI Preferences', 'Billing'];

const Settings = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('Integrations');
  const [syncFreq, setSyncFreq] = useState('realtime');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiAggression, setAiAggression] = useState(75);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [updateProfile] = useUpdateProfileMutation();
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ name, preferences: { syncFrequency: syncFreq } });
    setSaving(false);
    showToast('Settings saved!');
  };

  const handleSaveAI = async () => {
    await updateProfile({ preferences: { aiAutoApply: aiEnabled, aiAggression: Number(aiAggression) } });
    showToast('AI preferences saved!');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      {toast && <div className="fixed top-20 right-6 bg-[#3ECF8E] text-[#0f0f0f] px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 animate-pulse">{toast}</div>}
      <aside className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-2">
        <h2 className="font-h2 text-h2 text-on-surface mb-4">Settings</h2>
        <nav className="flex flex-col gap-1">
          {settingsTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left font-body-md text-body-md transition-colors ${activeTab === tab ? 'bg-surface-container text-on-surface font-medium shadow-[inset_2px_0_0_0_#3ECF8E]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>{tab}</button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col gap-6 max-w-4xl">
        {activeTab === 'General' && (
          <>
            <div><h3 className="font-h2 text-[24px] font-semibold text-on-surface">Profile</h3></div>
            <div className="bg-surface-container rounded-xl border border-outline-variant p-4 flex flex-col gap-4">
              <div><label className="block text-sm text-on-surface-variant mb-1">Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></div>
              <div><label className="block text-sm text-on-surface-variant mb-1">Email</label><input value={user?.email || ''} disabled className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface-variant" /></div>
              <button onClick={handleSaveProfile} disabled={saving} className="self-end bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </>
        )}

        {activeTab === 'Integrations' && (
          <>
            <div><h3 className="font-h2 text-[24px] font-semibold text-on-surface">Connections & Sync</h3><p className="text-on-surface-variant text-sm mt-1">Manage linked ad accounts.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-xl border border-outline-variant p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2">
                      <svg className="w-full h-full" viewBox="0 0 24 24"><path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" /><path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" fill="#34A853" /><path d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" fill="#FBBC05" /><path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" /></svg>
                    </div>
                    <div><h4 className="text-[16px] font-semibold text-on-surface">Google Ads</h4><p className="text-[13px] text-on-surface-variant">Demo Account</p></div>
                  </div>
                  <span className="px-2 py-1 bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-[#3ECF8E] font-label-caps text-label-caps rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" /> Active</span>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant flex gap-3">
                  <button onClick={() => showToast('Data synced!')} className="flex-1 border border-outline-variant text-on-surface text-sm px-4 py-2 rounded-full flex justify-center items-center gap-2"><span className="material-symbols-outlined text-[18px]">sync</span> Sync Now</button>
                  <button className="flex-1 bg-surface-bright border border-outline-variant text-on-surface text-sm px-4 py-2 rounded-full">Manage</button>
                </div>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl border border-outline-variant p-4">
              <h4 className="text-[16px] font-semibold text-on-surface mb-4">Data Sync Frequency</h4>
              <div className="flex flex-wrap gap-3">
                {[{ value: 'realtime', label: 'Real-time' }, { value: '15min', label: 'Every 15 mins' }, { value: 'hourly', label: 'Hourly' }].map(opt => (
                  <label key={opt.value} className="cursor-pointer"><input type="radio" name="sync" value={opt.value} checked={syncFreq === opt.value} onChange={e => setSyncFreq(e.target.value)} className="peer sr-only" />
                    <div className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant peer-checked:border-[#3ECF8E] peer-checked:bg-[#3ECF8E]/10 peer-checked:text-[#3ECF8E] text-sm transition-all">{opt.label}</div>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'AI Preferences' && (
          <>
            <div><h3 className="font-h2 text-[24px] font-semibold text-on-surface">AI Optimization Engine</h3></div>
            <div className="bg-surface-container rounded-xl border border-primary/30 p-4 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div><p className="text-sm text-on-surface-variant">Configure how aggressively AdPilot adjusts bids.</p></div>
                <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={aiEnabled} onChange={e => setAiEnabled(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-bright rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" /><span className="ml-3 text-sm text-on-surface font-medium">Auto-Apply</span></label>
              </div>
              <div>
                <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant"><span>Conservative</span><span>Aggressive</span></div>
                <input type="range" min="1" max="100" value={aiAggression} onChange={e => setAiAggression(e.target.value)} className="w-full h-2 bg-surface-bright rounded-lg appearance-none cursor-pointer accent-primary" />
                <p className="text-[13px] text-primary/80 mt-1">Level: {aiAggression}%</p>
              </div>
              <button onClick={handleSaveAI} className="self-end bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium">Save AI Settings</button>
            </div>
          </>
        )}

        {activeTab === 'Billing' && (
          <>
            <div><h3 className="font-h2 text-[24px] font-semibold text-on-surface">Usage & Limits</h3></div>
            <div className="bg-surface-container rounded-xl border border-outline-variant p-4">
              <div className="flex justify-between items-start mb-4"><div><p className="text-sm text-on-surface-variant">Free Plan (Demo)</p></div><button className="text-sm text-on-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-bright">Upgrade</button></div>
              <div className="flex justify-between text-sm text-on-surface"><span>Managed Campaigns</span><span className="font-medium">8 <span className="text-on-surface-variant">/ unlimited</span></span></div>
              <div className="w-full bg-surface-bright rounded-full h-2.5 mt-2"><div className="bg-[#3ECF8E] h-2.5 rounded-full" style={{ width: '15%' }} /></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
