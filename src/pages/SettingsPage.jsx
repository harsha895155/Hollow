import React, { useState } from 'react';
import {
  Globe,
  Moon,
  Sun,
  Layers,
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { CURRENCIES } from '../constants/categories';
import { ConfirmDialog } from '../components/common/Badge';

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, compact, toggleCompact, currencyCode, setCurrencyCode, themeTokens } = useTheme();
  const { transactions, categories, budgets, wipeAllData, importData } = useTransactions();

  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleExportJSON = () => {
    const dataToExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      budgets,
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hollow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Complete system backup downloaded.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.transactions || parsed.budgets || parsed.categories) {
          importData(parsed);
          triggerToast('Data restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    wipeAllData();
    setWipeConfirmOpen(false);
    triggerToast('All data has been safely purged.');
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      {successToast && (
        <div className="p-4 rounded-2xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-indigo-600/30">
          <CheckCircle2 size={16} /> {successToast}
        </div>
      )}

      {/* System Preferences */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} space-y-6`}>
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
          <Globe size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            System & Display Preferences
          </h3>
        </div>

        <div className="space-y-4">
          {/* Base Currency */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Active Currency</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Used across all metric cards, charts and ledgers</p>
            </div>
            <select
              value={currencyCode}
              onChange={e => setCurrencyCode(e.target.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer ${themeTokens.input}`}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Night / Dark Mode</p>
              <p className="text-[11px] text-slate-400 mt-0.5">High-contrast dark palette tailored for low light</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* High Density Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Compact High-Density View</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tighten padding for large transaction volumes</p>
            </div>
            <button
              onClick={toggleCompact}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${compact ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${compact ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Backup & Restore */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} space-y-6`}>
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
          <Database size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Data Backup & Portability
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Export your complete ledger data, custom categories, and budget targets to a JSON backup file, or restore from an earlier export.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <Download size={15} /> Download Full Backup (JSON)
          </button>

          <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-500/30 text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 cursor-pointer transition-all">
            <Upload size={15} /> Restore From JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 md:p-8 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-4">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-wider">
          <AlertTriangle size={18} /> Danger Zone
        </div>
        <p className="text-xs text-slate-400">
          Permanently clear all ledger records, expenses, and budget targets from your device. This cannot be undone.
        </p>
        <button
          onClick={() => setWipeConfirmOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-95"
        >
          <Trash2 size={15} /> Wipe All Ledger Records
        </button>
      </div>

      <ConfirmDialog
        isOpen={wipeConfirmOpen}
        title="Permanently Purge All Data"
        message="Are you sure you want to purge all expenses, income, and budgets? We recommend exporting a JSON backup first."
        confirmText="Yes, Purge Everything"
        isDanger={true}
        onConfirm={handleWipeData}
        onCancel={() => setWipeConfirmOpen(false)}
      />
    </div>
  );
}
