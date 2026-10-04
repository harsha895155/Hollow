import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { ConfirmDialog } from '../components/common/Badge';

export default function CategoriesPage({ onOpenCategoryModal }) {
  const { themeTokens, currencySymbol } = useTheme();
  const { categories, transactions, deleteCategory } = useTransactions();

  const [activeTab, setActiveTab] = useState('expense');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Compute live spending for each category
  const categoriesWithSpend = categories
    .filter(c => c.type === activeTab)
    .map(c => {
      const total = transactions
        .filter(t => t.type === activeTab && t.category?.toLowerCase() === c.name.toLowerCase())
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
      const count = transactions
        .filter(t => t.type === activeTab && t.category?.toLowerCase() === c.name.toLowerCase())
        .length;
      return {
        ...c,
        total,
        count,
      };
    })
    .sort((a, b) => b.total - a.total);

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl shrink-0">
            🏷️
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Categorization Engine
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Category Directory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize, color-code, and track spending patterns across custom tags
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCategoryModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} /> Create Category
        </button>
      </div>

      {/* Expense vs Income Type Switcher */}
      <div className="grid grid-cols-2 sm:flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            activeTab === 'expense'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ArrowDownRight size={14} /> Expenses ({categories.filter(c => c.type === 'expense').length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
            activeTab === 'income'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ArrowUpRight size={14} /> Income ({categories.filter(c => c.type === 'income').length})
        </button>
      </div>

      {/* Category Cards Grid - 2 cols on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {categoriesWithSpend.map((cat) => (
          <div
            key={cat.id || cat.name}
            className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between ${themeTokens.card} ${themeTokens.cardHover}`}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
                  style={{ backgroundColor: `${cat.color || '#6366f1'}20` }}
                >
                  {cat.icon || '🏷️'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                    {cat.count} entry{cat.count === 1 ? '' : 'ies'}
                  </p>
                </div>
              </div>

              {cat.isCustom && (
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                  title="Delete custom category"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Flow</span>
              <span className={`text-[11px] sm:text-xs font-black truncate ml-1 ${cat.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                {currencySymbol}{cat.total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Custom Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
