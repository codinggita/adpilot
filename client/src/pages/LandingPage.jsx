import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-[#171717] text-on-surface font-body-md min-h-screen" style={{ background: 'radial-gradient(circle 900px at 50% -20%, rgba(62, 207, 142, 0.06), transparent), #171717' }}>
      {/* TopAppBar */}
      <header className="flex justify-between items-center h-16 px-6 w-full top-0 z-50 bg-[#171717] border-b border-[#1a1a1a] sticky">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f787]">bolt</span>
          <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white tracking-tighter">AdPilot AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="font-['Plus_Jakarta_Sans'] text-sm tracking-tight text-white font-semibold hover:bg-[#1a1a1a] transition-colors opacity-80 duration-150 px-3 py-1.5 rounded-full" href="#features">Features</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm tracking-tight text-neutral-400 hover:bg-[#1a1a1a] hover:text-white transition-colors opacity-80 duration-150 px-3 py-1.5 rounded-full" href="#pricing">Pricing</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm tracking-tight text-neutral-400 hover:bg-[#1a1a1a] hover:text-white transition-colors opacity-80 duration-150 px-3 py-1.5 rounded-full" href="#integrations">Integrations</a>
          <a className="font-['Plus_Jakarta_Sans'] text-sm tracking-tight text-neutral-400 hover:bg-[#1a1a1a] hover:text-white transition-colors opacity-80 duration-150 px-3 py-1.5 rounded-full" href="#docs">Docs</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:flex text-on-surface hover:text-white transition-colors font-body-md">Sign in</Link>
          <Link to="/login" className="bg-[#00f787] text-[#0f0f0f] px-4 py-2 rounded-full font-body-md font-medium hover:opacity-90 transition-opacity border border-[#00f787]">Start Free</Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 text-center max-w-[1280px] mx-auto">
          <div className="max-w-[700px] mx-auto space-y-6">
            <h1 className="font-hero-headline text-hero-headline text-white">
              Stop Wasting Money on Google Ads.<br />
              <span style={{ background: 'linear-gradient(90deg, #3ecf8e 0%, #cfbcff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Let AI Fix It In 2 Minutes.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-[#b4b4b4] max-w-[600px] mx-auto">
              Connect your account. Our AI identifies wasted spend, poor keywords, and misconfigured campaigns instantly. Apply fixes with one click.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login" className="bg-[#00f787] text-[#0f0f0f] px-6 py-3 rounded-full font-body-md font-medium hover:opacity-90 transition-opacity border border-[#00f787] w-full sm:w-auto text-center">Start Free — No Credit Card</Link>
              <button className="bg-[#1a1a1a] text-on-surface px-6 py-3 rounded-full font-body-md font-medium hover:bg-[#2b292f] transition-colors border border-outline-variant w-full sm:w-auto flex items-center justify-center gap-2">
                Watch 90-sec Demo <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="pt-12 flex flex-col items-center gap-4">
              <p className="font-label-caps text-label-caps text-outline uppercase">Trusted by 2,400+ Small Brands</p>
              <div className="flex items-center gap-1 text-[#00f787]">
                {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto relative" style={{ transform: 'perspective(1000px) rotateX(3deg) translateY(20px)' }}>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3ecf8e] opacity-10 blur-[100px] rounded-full"></div>
            <div className="relative overflow-hidden shadow-2xl" style={{ transform: 'perspective(1000px) rotateX(3deg)' }}>
              {/* Browser Chrome Bar */}
              <div className="h-10 bg-[#0f0f0f] border border-[#2e2e2e] rounded-t-[12px] flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#2e2e2e]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#2e2e2e]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#2e2e2e]"></div>
                </div>
                <div className="bg-[#171717] border border-[#2e2e2e] rounded-[6px] w-[240px] h-6 flex items-center justify-center">
                  <span className="font-['Source_Code_Pro'] text-[11px] text-[#4d4d4d]">adpilot.ai/dashboard</span>
                </div>
                <div className="w-12"></div>
              </div>
              {/* Inner Content Frame */}
              <div className="bg-[#171717] border-x border-b border-[#2e2e2e] rounded-b-[12px] p-4 space-y-4">
                {/* Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg p-3 text-left">
                    <div className="font-['Source_Code_Pro'] text-[9px] text-[#4d4d4d] mb-1">REVENUE</div>
                    <div className="text-[20px] font-semibold text-[#3ecf8e] font-sans">₹72.1K</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg p-3 text-left">
                    <div className="font-['Source_Code_Pro'] text-[9px] text-[#4d4d4d] mb-1">ROAS</div>
                    <div className="text-[20px] font-semibold text-[#fafafa] font-sans">3.91×</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg p-3 text-left">
                    <div className="font-['Source_Code_Pro'] text-[9px] text-[#4d4d4d] mb-1">WASTED</div>
                    <div className="text-[20px] font-semibold text-orange-500 font-sans">₹6.2K</div>
                  </div>
                </div>
                {/* Bar Chart */}
                <div className="bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg h-[120px] p-4 relative flex flex-col justify-end">
                  <div className="flex justify-between items-end h-[60px] relative z-10">
                    {[[6,10],[8,12],[10,14],[7,9],[11,14],[5,8],[9,12]].map(([h1,h2], i) => (
                      <div key={i} className="flex gap-1 items-end">
                        <div className="w-1.5 bg-[rgba(124,109,250,0.5)]" style={{ height: `${h1*4}px` }}></div>
                        <div className="w-1.5 bg-[rgba(62,207,142,0.8)]" style={{ height: `${h2*4}px` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 2-Column Layout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <table className="w-full font-['Source_Code_Pro'] text-[9px] text-[#898989]">
                      <tbody>
                        <tr className="border-b border-[#2e2e2e] h-8">
                          <td className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></div>Campaign_Q4</td>
                          <td className="text-right"><span className="bg-[#3ecf8e]/10 text-[#3ecf8e] px-1 rounded">98</span></td>
                        </tr>
                        <tr className="border-b border-[#2e2e2e] h-8">
                          <td className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></div>Brand_Search</td>
                          <td className="text-right"><span className="bg-[#3ecf8e]/10 text-[#3ecf8e] px-1 rounded">94</span></td>
                        </tr>
                        <tr className="h-8">
                          <td className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Competitor_Set</td>
                          <td className="text-right"><span className="bg-orange-500/10 text-orange-500 px-1 rounded">42</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-[#0f0f0f] border border-[#2e2e2e] border-l-[3px] border-l-[#cfbcff] rounded-r-lg p-3 text-left flex flex-col justify-center">
                    <div className="text-[#fafafa] text-[12px] font-medium mb-1">✦ 6 fixes ready</div>
                    <div className="text-[#898989] text-[9px]">AI detected 4 negative keywords and 2 bid overlaps.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="features" className="py-24 px-6 bg-[#0f0f0f] border-y border-[#1a1a1a]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-outline-variant border-l-4 border-l-[#ff5252] relative overflow-hidden">
                <h3 className="font-h2 text-h2 text-white mb-2">34% budget wasted</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Average ad spend lost to irrelevant search terms and poor targeting settings.</p>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-outline-variant border-l-4 border-l-[#ff5252] relative overflow-hidden">
                <h3 className="font-h2 text-h2 text-white mb-2">No time to optimize</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Manual monitoring takes hours. AI audits your account 24/7 without sleep.</p>
              </div>
              <div className="bg-[#1a1a1a] p-6 rounded-lg border border-outline-variant border-l-4 border-l-[#ff5252] relative overflow-hidden">
                <h3 className="font-h2 text-h2 text-white mb-2">Outbid by competitors</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Slow reaction times mean lost impressions. Auto-rules adjust bids instantly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0f0f0f] border-t border-[#1a1a1a] py-12 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f787]">bolt</span>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white tracking-tighter">AdPilot AI</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">© 2024 AdPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
