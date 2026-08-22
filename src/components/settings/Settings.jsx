import React from 'react';
import { Globe, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactionContext } from '../../context/TransactionContext';

export default function Settings({ currency, setCurrency }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { transactions, deleteTransaction } = useTransactionContext();

  const resetAllData = () => {
    if (window.confirm('Are you sure? This will wipe all ledger entries.')) {
      transactions.forEach(t => deleteTransaction(t.id));
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in duration-500 space-y-6">
      <div
        className={`border rounded-[32px] p-8 ${
          darkMode ? 'bg-[#0d0d0f] border-white/5' : 'bg-white border-black/5 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <Globe size={20} className="text-blue-500" />
          <h3 className="text-lg font-bold">Preferences</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-black/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-bold">Base Currency</p>
              <p className="text-[10px] opacity-40 uppercase font-bold mt-1">
                Symbol used across dashboard
              </p>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent border rounded-xl px-4 py-2 text-sm font-bold outline-none ${
                darkMode ? 'border-white/10' : 'border-black/10'
              }`}
            >
              <option value="INR" className="bg-[#121214]">
                INR (₹)
              </option>
              <option value="USD" className="bg-[#121214]">
                USD ($)
              </option>
            </select>
          </div>
          <div className="flex items-center justify-between p-5 rounded-2xl bg-black/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-bold">Night Mode</p>
              <p className="text-[10px] opacity-40 uppercase font-bold mt-1">
                Dark theme for low light
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-14 h-7 rounded-full p-1 transition-all ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`border rounded-[32px] p-8 border-rose-500/20 ${
          darkMode ? 'bg-rose-500/5' : 'bg-rose-50 shadow-sm'
        }`}
      >
        <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
        <p className="text-xs opacity-50 mb-6">Permanently delete all transaction data.</p>
        <button
          onClick={resetAllData}
          className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/20 hover:bg-rose-700 active:scale-95 transition-all"
        >
          <Trash2 size={16} /> Wipe Records
        </button>
      </div>
    </div>
  );
}
