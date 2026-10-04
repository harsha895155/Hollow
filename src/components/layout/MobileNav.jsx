import React from 'react';
import { LayoutDashboard, Receipt, Plus, PieChart, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';

export default function MobileNav({ currentTab, onSelectTab, onOpenAddModal, onOpenDrawer }) {
  const { darkMode } = useTheme();
  const { metrics } = useTransactions();

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${
      darkMode ? 'bg-[#090d16]/95 border-white/10' : 'bg-white/95 border-slate-200'
    } backdrop-blur-xl px-2 py-1.5 pb-safe`}>
      <div className="flex items-center justify-around">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            currentTab === 'dashboard'
              ? 'text-indigo-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] tracking-tight">Overview</span>
        </button>

        {/* Expenses */}
        <button
          onClick={() => onSelectTab('expenses')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            currentTab === 'expenses'
              ? 'text-indigo-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Receipt size={20} />
          <span className="text-[10px] tracking-tight">Expenses</span>
        </button>

        {/* Center Quick Add FAB */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40 active:scale-90 transition-transform"
          aria-label="Add transaction"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        {/* Budgets */}
        <button
          onClick={() => onSelectTab('budgets')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl relative transition-colors ${
            currentTab === 'budgets'
              ? 'text-indigo-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <PieChart size={20} />
          <span className="text-[10px] tracking-tight">Budgets</span>
          {metrics.exceededBudgetsCount > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* More Menu */}
        <button
          onClick={onOpenDrawer}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
            ['income', 'categories', 'reports', 'profile', 'settings'].includes(currentTab)
              ? 'text-indigo-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Menu size={20} />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
}
