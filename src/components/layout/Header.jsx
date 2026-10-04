import React from 'react';
import { Menu, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CURRENCIES } from '../../constants/categories';

export default function Header({ currentTab, onOpenMobileDrawer, onOpenAddModal }) {
  const { darkMode, toggleDarkMode, currencyCode, setCurrencyCode, themeTokens } = useTheme();

  const titles = {
    dashboard: 'Financial Overview',
    expenses: 'Expense Management',
    income: 'Income Streams',
    budgets: 'Budget Control',
    categories: 'Categories & Tags',
    reports: 'Intelligence & Reports',
    profile: 'User Profile',
    settings: 'System Preferences',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className={`h-16 md:h-18 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 ${themeTokens.header} transition-colors duration-200`}>
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {titles[currentTab] || 'Dashboard'}
          </h1>
          <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
            {currentDate} · Production Environment
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Currency Switcher */}
        <select
          value={currencyCode}
          onChange={(e) => setCurrencyCode(e.target.value)}
          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl outline-none cursor-pointer transition-colors ${
            darkMode 
              ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-white/20' 
              : 'bg-white border border-slate-300 text-slate-800 hover:border-slate-400 shadow-sm'
          }`}
          title="Select currency"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code} className="bg-slate-900 text-white">
              {c.code} ({c.symbol})
            </option>
          ))}
        </select>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl transition-all ${
            darkMode 
              ? 'bg-white/5 text-amber-400 hover:bg-white/10 border border-white/5' 
              : 'bg-white text-indigo-600 hover:bg-slate-50 border border-slate-300 shadow-sm'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Entry</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
