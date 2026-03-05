import React from 'react';
import { X, FileText, FileDown, Printer } from 'lucide-react';
import ReportMetric from './ReportMetric';

export default function ReportModal({ isOpen, onClose, metrics, currencySymbol, transactions, isDarkMode, theme, exportPDF }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl print:bg-white print:p-0 print:block">
      <div className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[40px] border p-10 shadow-2xl relative print:max-h-none print:shadow-none print:border-none print:rounded-none ${theme.card}`}>
        <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 print:hidden text-slate-400 hover:text-white"><X size={24}/></button>
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-indigo-500/20"><FileText size={28} color="white"/></div>
          <div><h3 className="text-2xl font-black uppercase tracking-tighter">Financial Intelligence</h3><p className="opacity-40 text-[10px] tracking-[0.4em] font-bold uppercase italic">System Statement Report</p></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ReportMetric label="Economy Rating" value={`${metrics.savingsRate}%`} isDark={isDarkMode} />
          <ReportMetric label="Total Liquidity" value={`${currencySymbol}${metrics.balance.toLocaleString()}`} isDark={isDarkMode} color="text-emerald-500" />
          <ReportMetric label="Transaction Mass" value={metrics.count} isDark={isDarkMode} />
        </div>

        <div className={`p-8 rounded-[32px] border italic text-sm leading-relaxed mb-8 ${isDarkMode ? 'bg-indigo-500/5 border-indigo-500/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          "Current intelligence report suggests primary capital leakage is centered in <span className="text-indigo-500 font-black">{metrics.topExpenseCategory}</span>. The efficiency of your economic cycle is currently rated at <span className="text-emerald-500 font-black">{metrics.savingsRate}%</span>."
        </div>

        <div className="space-y-4 print:block">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Detailed Ledger Entries</h4>
           {transactions.map(tx => (
             <div key={tx.id} className="flex justify-between py-2 border-b border-slate-700/10 text-xs text-inherit">
                <span className="font-bold uppercase tracking-tight">{tx.name} ({tx.date})</span>
                <span className={`font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-indigo-500'}`}>
                  {tx.amount > 0 ? '+' : ''}{currencySymbol}{tx.amount.toLocaleString()}
                </span>
             </div>
           ))}
        </div>

        <div className="mt-10 flex gap-4 print:hidden">
          <button onClick={exportPDF} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-white text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-transform active:scale-95">
            <FileDown size={18}/> Export PDF
          </button>
          <button onClick={() => window.print()} className="py-4 px-8 border rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Printer size={18}/> Print
          </button>
          <button onClick={onClose} className={`px-10 py-4 border rounded-2xl font-black text-[10px] tracking-widest uppercase ${theme.input}`}>Close</button>
        </div>
      </div>
    </div>
  );
}
