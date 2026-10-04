import React from 'react';
import {
  X,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Tag,
  BarChart3,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';

export default function MobileDrawer({ isOpen, onClose, currentTab, onSelectTab }) {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const { metrics } = useTransactions();

  if (!isOpen) return null;

  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
    { id: 'income', label: 'Income Streams', icon: <TrendingUp size={20} /> },
    { 
      id: 'budgets', 
      label: 'Budgets & Limits', 
      icon: <PieChart size={20} />, 
      badge: metrics.exceededBudgetsCount > 0 ? `${metrics.exceededBudgetsCount} Exceeded` : null 
    },
    { id: 'categories', label: 'Categories', icon: <Tag size={20} /> },
    { id: 'reports', label: 'Analytics & Reports', icon: <BarChart3 size={20} /> },
    { id: 'profile', label: 'User Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNav = (tabId) => {
    onSelectTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className={`relative w-[280px] max-w-[80vw] h-full flex flex-col shadow-2xl z-10 transition-transform ${
        darkMode ? 'bg-[#0b101b] text-white border-r border-white/10' : 'bg-white text-slate-900 border-r border-slate-200'
      }`}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/30">
              H
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-tight">Hollow</p>
              <p className="text-[10px] font-semibold text-indigo-500">Financial App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {link.icon}
                </div>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-inherit">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
