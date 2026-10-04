import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function StatCard({ title, value, icon, change, trend = 'neutral', subtitle, isPrimary }) {
  const { themeTokens } = useTheme();

  return (
    <div className={`rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300 relative overflow-hidden group ${
      isPrimary 
        ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/30' 
        : `${themeTokens.card} ${themeTokens.cardHover}`
    }`}>
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate ${isPrimary ? 'text-indigo-200' : themeTokens.textSecondary}`}>
          {title}
        </span>
        <div className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${
          isPrimary 
            ? 'bg-white/15 text-white' 
            : 'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:border-transparent dark:bg-indigo-500/10 dark:text-indigo-400'
        }`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className={`text-lg sm:text-2xl lg:text-3xl font-black tracking-tight truncate ${isPrimary ? 'text-white' : themeTokens.textPrimary}`}>
          {value}
        </h3>
      </div>

      {(subtitle || change) && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          {change && (
            <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-1 ${
              trend === 'up' 
                ? (isPrimary ? 'bg-white/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20')
                : trend === 'down'
                ? (isPrimary ? 'bg-white/20 text-rose-300' : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20')
                : (isPrimary ? 'bg-white/20 text-indigo-100' : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20')
            }`}>
              {change}
            </span>
          )}
          {subtitle && (
            <span className={`text-[10px] sm:text-xs truncate ${isPrimary ? 'text-indigo-200' : themeTokens.textMuted}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
