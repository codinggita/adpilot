import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/slices/authSlice';
import { useGetNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from '../store/api/notificationsApi';
import { useLogoutMutation } from '../store/api/authApi';

const breadcrumbMap = {
  '/dashboard': 'dashboard',
  '/analytics': 'analytics',
  '/campaigns': 'campaigns',
  '/ai-optimizer': 'ai optimizer',
  '/rules': 'automation rules',
  '/reports': 'reports',
  '/settings': 'settings',
};

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const { data: notifData } = useGetNotificationsQuery({ page: 1, limit: 8 });
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();
  const [logoutApi] = useLogoutMutation();

  const notifications = notifData?.data?.notifications || [];
  const unreadCount = notifData?.data?.unreadCount || 0;
  const breadcrumb = breadcrumbMap[location.pathname] || 'dashboard';

  useEffect(() => {
    const handle = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    setShowNotif(false);
    if (notif.actionUrl) navigate(notif.actionUrl);
  };

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate('/login');
  };

  const severityIcon = (s) => s === 'critical' ? 'error' : s === 'warning' ? 'warning' : 'info';
  const severityColor = (s) => s === 'critical' ? 'text-error' : s === 'warning' ? 'text-tertiary' : 'text-primary';

  const timeAgo = (d) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <header className="bg-[#0f0f0f]/80 backdrop-blur-md font-['Plus_Jakarta_Sans'] font-medium w-full h-16 border-b border-[#1a1a1a] sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-neutral-400">adpilot.ai</span>
        <span className="text-neutral-600">/</span>
        <span className="text-white">{breadcrumb}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Status
        </div>
        <button onClick={() => navigate('/connect')} className="bg-[#6750A4] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Connect Ads
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-neutral-800 pl-4 text-neutral-400">
          <span className="material-symbols-outlined hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/settings')}>sensors</span>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotif(!showNotif)} className="relative hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-10 w-[380px] bg-[#1c1b1f] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                  <span className="text-white font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={() => markAllRead()} className="text-primary text-xs hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-neutral-500 text-sm">No notifications</div>
                  ) : notifications.map((n) => (
                    <div key={n._id} onClick={() => handleNotifClick(n)}
                      className={`px-4 py-3 border-b border-neutral-800/50 flex gap-3 cursor-pointer hover:bg-neutral-800/50 transition-colors ${!n.isRead ? 'bg-neutral-800/30' : ''}`}>
                      <span className={`material-symbols-outlined text-[20px] mt-0.5 ${severityColor(n.severity)}`}>{severityIcon(n.severity)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{n.title}</div>
                        <div className="text-neutral-400 text-xs mt-0.5 line-clamp-2">{n.message}</div>
                        <div className="text-neutral-500 text-[10px] mt-1">{timeAgo(n.createdAt)}</div>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative" ref={userRef}>
            <button onClick={() => setShowUser(!showUser)} className="hover:text-white transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            {showUser && (
              <div className="absolute right-0 top-10 w-[200px] bg-[#1c1b1f] border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-800">
                  <div className="text-white text-sm font-medium truncate">{user?.name || 'User'}</div>
                  <div className="text-neutral-400 text-xs truncate">{user?.email}</div>
                </div>
                <button onClick={() => { setShowUser(false); navigate('/settings'); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                </button>
                <button onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-error hover:bg-neutral-800 flex items-center gap-2 border-t border-neutral-800">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
