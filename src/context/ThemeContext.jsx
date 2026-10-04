import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CURRENCIES } from '../constants/categories';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage('hollow_darkMode', true);
  const [compact, setCompact] = useLocalStorage('hollow_compact', false);
  const [currencyCode, setCurrencyCode] = useLocalStorage('hollow_currency', 'INR');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleCompact = () => setCompact(prev => !prev);

  const activeCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const currencySymbol = activeCurrency.symbol;

  const formatAmount = (num) => {
    const val = Math.abs(Number(num) || 0);
    return `${currencySymbol}${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const themeTokens = {
    bg: darkMode ? 'bg-[#090d16]' : 'bg-[#f8fafc]',
    card: darkMode 
      ? 'bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 shadow-xl' 
      : 'bg-white border border-slate-200 shadow-sm shadow-slate-200/50',
    cardHover: darkMode
      ? 'hover:border-indigo-500/40 hover:shadow-glow transition-all'
      : 'hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/70 transition-all',
    sidebar: darkMode
      ? 'bg-[#0b101b] border-r border-white/10 text-slate-300'
      : 'bg-white border-r border-slate-200 text-slate-700 shadow-sm',
    header: darkMode
      ? 'bg-[#090d16]/80 backdrop-blur-xl border-b border-white/10'
      : 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm',
    input: darkMode
      ? 'bg-[#162032] border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
      : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 shadow-sm',
    textPrimary: darkMode ? 'text-slate-100' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
    textMuted: darkMode ? 'text-slate-500' : 'text-slate-500',
    border: darkMode ? 'border-white/10' : 'border-slate-200',
    borderSubtle: darkMode ? 'border-white/5' : 'border-slate-200',
    well: darkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-slate-50/80 border border-slate-200',
  };

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      compact,
      toggleCompact,
      currencyCode,
      setCurrencyCode,
      currencySymbol,
      formatAmount,
      themeTokens,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
