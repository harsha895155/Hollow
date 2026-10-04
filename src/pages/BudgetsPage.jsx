import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { EmptyState, ConfirmDialog } from '../components/common/Badge';

export default function BudgetsPage({ onOpenBudgetModal, onEditBudget }) {
  const { themeTokens, currencySymbol } = useTheme();
  const { metrics, deleteBudget } = useTransactions();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const budgets = metrics.budgetsWithProgress;

  // Overall totals
  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit || 0), 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const totalRemaining = totalBudgeted - totalSpentInBudgets;
  const overallPercentage = totalBudgeted > 0 ? ((totalSpentInBudgets / totalBudgeted) * 100).toFixed(1) : 0;

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteBudget(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Total Limit Progress */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500">
            <PieChart size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Monthly Budget Control Center
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {currencySymbol}{totalSpentInBudgets.toLocaleString()} <span className="text-sm font-semibold text-slate-400">of {currencySymbol}{totalBudgeted.toLocaleString()}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {totalRemaining >= 0 
              ? `${currencySymbol}${totalRemaining.toLocaleString()} remaining across all targets` 
              : `Overall limits exceeded by ${currencySymbol}${Math.abs(totalRemaining).toLocaleString()}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onOpenBudgetModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} /> Create Budget Target
          </button>
        </div>
      </div>

      {/* Global progress indicator bar */}
      <div className={`p-5 rounded-2xl ${themeTokens.card} space-y-2`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">Overall Budget Utilization</span>
          <span className={overallPercentage > 100 ? 'text-rose-500' : overallPercentage >= 80 ? 'text-amber-500' : 'text-indigo-500'}>
            {overallPercentage}% Used
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              overallPercentage > 100 ? 'bg-rose-500' : overallPercentage >= 80 ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No budgets set"
          description="Establish monthly spending limits on food, shopping, utilities, and dining to stay on top of your financial goals."
          actionText="+ Establish First Budget"
          onAction={() => onOpenBudgetModal()}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {budgets.map((b) => {
            const isOver = b.isExceeded;
            const isWarn = b.isNearLimit;
            const pct = Math.min(b.percentageUsed, 100);

            return (
              <div
                key={b.id || b.category}
                className={`p-5 md:p-6 rounded-3xl border transition-all duration-300 relative group flex flex-col justify-between ${
                  isOver
                    ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-500/10 dark:border-rose-500/40 shadow-sm'
                    : isWarn
                    ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-500/10 dark:border-amber-500/40 shadow-sm'
                    : `${themeTokens.card} ${themeTokens.cardHover}`
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {b.category}
                        </h4>
                        {isOver && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                            EXCEEDED
                          </span>
                        )}
                        {isWarn && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                            WARNING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Threshold alert at {b.alertThreshold || 80}%
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditBudget(b)}
                        className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                        title="Edit Budget"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                        title="Delete Budget"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Financial Stats Breakdown */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 mb-5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Budget:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currencySymbol}{Number(b.monthlyLimit).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Spent:</span>
                      <span className={`font-bold ${isOver ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                        {currencySymbol}{b.spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-white/10">
                      <span className="text-slate-400">Remaining:</span>
                      <span className={`font-bold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isOver ? `-${currencySymbol}${Math.abs(b.remaining).toLocaleString()}` : `${currencySymbol}${b.remaining.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span className={isOver ? 'text-rose-500 font-extrabold' : isWarn ? 'text-amber-500' : 'text-indigo-500'}>
                      {b.percentageUsed}% Used
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Budget Target"
        message={`Are you sure you want to delete the monthly budget for "${deleteTarget?.category}"? Past expense records will remain intact.`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
