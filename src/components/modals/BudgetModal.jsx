import React, { useState, useEffect } from 'react';
import { X, PieChart, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';

export default function BudgetModal({ isOpen, onClose, initialData = null }) {
  const { themeTokens, darkMode, currencySymbol } = useTheme();
  const { categories, addBudget, updateBudget } = useTransactions();

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    alertThreshold: 80,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || '',
        monthlyLimit: initialData.monthlyLimit || '',
        alertThreshold: initialData.alertThreshold || 80,
      });
    } else {
      setFormData({
        category: expenseCategories[0]?.name || 'Food & Dining',
        monthlyLimit: '',
        alertThreshold: 80,
      });
    }
    setError('');
  }, [initialData, isOpen, expenseCategories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const limit = parseFloat(formData.monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      setError('Budget monthly limit must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      if (initialData?.id) {
        await updateBudget(initialData.id, {
          category: formData.category,
          monthlyLimit: limit,
          alertThreshold: Number(formData.alertThreshold),
        });
      } else {
        await addBudget({
          category: formData.category,
          monthlyLimit: limit,
          alertThreshold: Number(formData.alertThreshold),
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving budget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-3xl border p-6 md:p-8 shadow-2xl z-10 ${
        darkMode ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <PieChart size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {initialData ? 'Edit Budget' : 'Set Category Budget'}
              </h3>
              <p className="text-xs text-slate-400">Monthly spending limit target</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              disabled={!!initialData}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer ${themeTokens.input}`}
            >
              {expenseCategories.map(c => (
                <option key={c.id || c.name} value={c.name} className="bg-slate-900 text-white">
                  {c.icon || '🏷️'} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Monthly Limit ({currencySymbol}) *
            </label>
            <input
              type="number"
              step="1"
              min="1"
              required
              value={formData.monthlyLimit}
              onChange={e => setFormData({ ...formData, monthlyLimit: e.target.value })}
              placeholder="e.g. 15000"
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all ${themeTokens.input}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Warning Alert Threshold ({formData.alertThreshold}%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={formData.alertThreshold}
              onChange={e => setFormData({ ...formData, alertThreshold: e.target.value })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50% (Early warning)</span>
              <span>80% (Recommended)</span>
              <span>95% (Late)</span>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Establish Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
