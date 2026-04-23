import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../store/api/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';

const navItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/campaigns', icon: 'ads_click', label: 'Campaigns' },
  { path: '/ai-optimizer', icon: 'auto_awesome', label: 'AI Optimizer' },
  { path: '/rules', icon: 'auto_fix_high', label: 'Automation' },
  { path: '/analytics', icon: 'insights', label: 'Analytics' },
  { path: '/reports', icon: 'description', label: 'Reports' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch { /* continue */ }
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <nav className="bg-[#0f0f0f] font-['Plus_Jakarta_Sans'] text-sm antialiased h-screen w-64 border-r border-[#1a1a1a] fixed left-0 top-0 flex flex-col py-6 z-50">
      {/* Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        <div>
          <div className="text-white font-bold tracking-tighter text-lg leading-tight">AdPilot AI</div>
          <div className="text-[#6750A4] text-xs font-medium">Automation Active</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col px-3 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? 'text-white bg-[#1a1a1a] border-l-2 border-[#6750A4] flex items-center gap-3 px-3 py-2 rounded-r active:scale-[0.98]'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50 transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-r border-l-2 border-transparent active:scale-[0.98]'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 flex flex-col gap-1 mt-auto border-t border-neutral-800/50 pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? 'text-white bg-[#1a1a1a] border-l-2 border-[#6750A4] flex items-center gap-3 px-3 py-2 rounded-r'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50 transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-r border-l-2 border-transparent'
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium">Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-neutral-500 hover:text-red-400 hover:bg-neutral-900/50 transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-r border-l-2 border-transparent text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* CTA Footer */}
      <div className="px-6 mt-4">
        <button className="w-full py-2 px-4 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-900 transition-colors text-sm font-medium">
          Upgrade to Pro
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
