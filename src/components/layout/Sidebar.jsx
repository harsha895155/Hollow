import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Tag,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';

export default function Sidebar({ currentTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const { themeTokens } = useTheme();
  const { metrics } = useTransactions();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt size={19} /> },
    { id: 'income', label: 'Income', icon: <TrendingUp size={19} /> },
    { 
      id: 'budgets', 
      label: 'Budgets', 
      icon: <PieChart size={19} />,
      badge: metrics.exceededBudgetsCount > 0 ? metrics.exceededBudgetsCount : null,
      badgeColor: 'bg-rose-500'
    },
    { id: 'categories', label: 'Categories', icon: <Tag size={19} /> },
    { id: 'reports', label: 'Analytics & Reports', icon: <BarChart3 size={19} /> },
    { id: 'profile', label: 'User Profile', icon: <User size={19} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={19} /> },
  ];

  return (
    <aside className={`hidden md:flex flex-col transition-all duration-300 z-30 select-none ${
      isCollapsed ? 'w-20' : 'w-64'
    } ${themeTokens.sidebar} h-screen sticky top-0`}>
      {/* Brand Header */}
      <div className="h-18 p-5 flex items-center justify-between border-b border-inherit">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/30 shrink-0">
            H
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white uppercase">
                Hollow
              </span>
              <span className="text-[10px] font-semibold text-indigo-500 tracking-wider">
                FINANCIAL OS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}
              {item.badge && !isCollapsed && (
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full text-white font-bold ${item.badgeColor || 'bg-indigo-600'}`}>
                  {item.badge}
                </span>
              )}
              {item.badge && isCollapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Exceeded budget warning indicator */}
      {metrics.exceededBudgetsCount > 0 && !isCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0" />
          <span className="text-[11px] font-semibold leading-tight">
            {metrics.exceededBudgetsCount} budget{metrics.exceededBudgetsCount > 1 ? 's' : ''} exceeded
          </span>
        </div>
      )}

      {/* User profile footer */}
      <div className="p-3 border-t border-inherit">
        <div className={`p-2 rounded-xl flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                {user?.name || 'Authorized User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'user@hollow.app'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
