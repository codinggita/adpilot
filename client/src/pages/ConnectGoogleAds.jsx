import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountStatusQuery, useSeedDemoDataMutation } from '../store/api/usersApi';

const ConnectGoogleAds = () => {
  const navigate = useNavigate();
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const { data, isLoading: checkingStatus } = useGetAccountStatusQuery();
  const [seedDemo, { isLoading: seeding }] = useSeedDemoDataMutation();
  const connecting = false;

  const hasAccount = data?.data?.hasAccount;

  useEffect(() => {
    if (hasAccount) {
      navigate('/dashboard');
    }
  }, [hasAccount, navigate]);

  const handleConnectLive = async () => {
    setLoadingMsg('Redirecting to Google OAuth...');
    // Real implementation would redirect to Google:
    // window.location.href = '/api/v1/users/auth/google';
    
    // For demo purposes, we'll simulate a failure/fallback to ask if they want demo data
    try {
      throw new Error('Not configured');
    } catch (err) {
      alert("Live Google Ads connection is not configured in this demo environment. Please use 'Test with Demo Data' instead.");
      setLoadingMsg('');
    }
  };

  const handleConnectDemo = async () => {
    setLoadingMsg('Generating realistic demo campaigns and metrics...');
    try {
      await seedDemo().unwrap();
      setLoadingMsg('Analyzing demo data with AI...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert("Failed to seed demo data. Please try again.");
      setLoadingMsg('');
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#3ECF8E]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {loadingMsg ? (
        <div className="flex flex-col items-center z-10">
          <div className="relative mb-8 w-24 h-24">
            <div className="absolute inset-0 border-4 border-surface-container rounded-full" />
            <div className="absolute inset-0 border-4 border-[#3ECF8E] rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#3ECF8E] text-3xl">auto_awesome</span>
            </div>
          </div>
          <h2 className="font-h2 text-2xl text-white mb-2">{loadingMsg}</h2>
          <p className="text-on-surface-variant text-sm">Please wait while we set up your AdPilot dashboard.</p>
        </div>
      ) : (
        <div className="w-full min-w-[320px] max-w-md bg-[#1c1b1f]/80 backdrop-blur-xl border border-[#2a292e] rounded-2xl p-8 z-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ECF8E]/10 blur-[40px] pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-surface-bright flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </div>
            <span className="font-h2 font-bold text-xl text-white tracking-tight">AdPilot AI</span>
          </div>

          <h1 className="font-h2 text-2xl text-white mb-2">Connect Google Ads</h1>
          <p className="text-on-surface-variant text-sm mb-8">Link your ad account to enable AI-driven insights and automated optimizations.</p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleConnectLive}
              disabled={connecting || seeding}
              className="w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" fill="#34A853" />
                <path d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <div className="flex z-10 items-center gap-4 my-2">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant font-label-caps uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button 
              onClick={handleConnectDemo}
              disabled={connecting || seeding}
              className="w-full bg-surface-container border border-primary/50 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors hover:border-primary group"
            >
              <span className="material-symbols-outlined text-primary group-hover:animate-pulse">science</span>
              Test with Demo Data
            </button>
            <p className="text-xs text-center text-on-surface-variant mt-1">
              Populates dashboard with realistic mock campaigns to explore AdPilot's features safely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectGoogleAds;
