import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';

const EMOJI_OPTIONS = ['🍔', '🚗', '🛍️', '📄', '🎬', '🏥', '📚', '✈️', '🏠', '🔄', '🛒', '📦', '💼', '💻', '📈', '🎁', '☕', '💡', '🎮', '🏋️', '💅', '🐾'];
const COLOR_OPTIONS = ['#6366f1', '#f97316', '#06b6d4', '#ec4899', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6', '#a855f7', '#14b8a6', '#84cc16', '#f59e0b'];

export default function CategoryModal({ isOpen, onClose }) {
  const { themeTokens, darkMode } = useTheme();
  const { addCategory } = useTransactions();

  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    try {
      await addCategory({
        name: name.trim(),
        type,
        color,
        icon,
      });
      setName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Error creating category.');
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
              <Tag size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">New Custom Category</h3>
              <p className="text-xs text-slate-400">Personalize your ledger tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense Category
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income Category
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Pet Care, Software, Gym"
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all ${themeTokens.input}`}
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Select Icon
            </label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-100 dark:bg-white/5">
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
                    icon === em ? 'bg-indigo-600 scale-110 shadow-md shadow-indigo-600/30' : 'hover:bg-white/10'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Select Accent Color
            </label>
            <div className="flex flex-wrap gap-2.5 p-2 rounded-xl bg-slate-100 dark:bg-white/5">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-white scale-125 shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 text-xs font-bold hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
