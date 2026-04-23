import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignupLogin from './pages/SignupLogin';
import MainDashBoard from './pages/MainDashBoard';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import AiOptimizer from './pages/AiOptimizer';
import AutomationRules from './pages/AutomationRules';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ConnectGoogleAds from './pages/ConnectGoogleAds';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignupLogin />} />

        {/* Onboarding */}
        <Route path="/connect" element={
          <ProtectedRoute><ConnectGoogleAds /></ProtectedRoute>
        } />

        {/* Protected dashboard routes */}
        <Route element={
          <ProtectedRoute><DashboardLayout /></ProtectedRoute>
        }>
          <Route path="/dashboard" element={<MainDashBoard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/ai-optimizer" element={<AiOptimizer />} />
          <Route path="/rules" element={<AutomationRules />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
