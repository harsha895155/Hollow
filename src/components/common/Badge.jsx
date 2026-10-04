import React from 'react';

export function Badge({ children, variant = 'neutral', className = '' }) {
  const styles = {
    income: 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    expense: 'bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    brand: 'bg-indigo-50 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-white/10',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] || styles.neutral} ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-50/80 dark:bg-white/[0.02]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center text-3xl mb-4 shadow-sm">
        {icon || '📭'}
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title || 'No data found'}
      </h4>
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
        {description || 'There are no records to display at this moment.'}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ConfirmDialog({ isOpen, title, message, confirmText = 'Delete', onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
