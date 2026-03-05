import React from 'react';
import { Trash2 } from 'lucide-react';

export default function TransactionList({ transactions, onDelete, showAll, theme, symbol }) {
  if (transactions.length === 0) return <div className="text-center py-16 opacity-30 text-xs font-black tracking-[0.2em] italic">NULL_DATA</div>;
  return (
    <div className={`space-y-4 ${showAll ? '' : 'max-h-[400px] overflow-y-auto'}`}>
      {transactions.map((tx) => (
        <div key={tx.id} className={`flex items-center justify-between p-4 rounded-[22px] border border-transparent transition-all group ${theme.card} hover:border-indigo-500/30`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${theme.input}`}>{tx.icon}</div>
            <div><p className="text-xs font-black uppercase tracking-tight">{tx.name}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-xs font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {tx.amount > 0 ? '+' : '-'}{symbol}{Math.abs(tx.amount).toLocaleString('en-IN')}
            </p>
            <button onClick={() => onDelete(tx.id)} className="opacity-0 group-hover:opacity-100 text-rose-500/40 hover:text-rose-500 no-print flex items-center justify-center"><Trash2 size={14}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}
