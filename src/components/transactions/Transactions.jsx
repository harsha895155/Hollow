import React, { useState } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { Trash2 } from 'lucide-react';

export default function Transactions({ isDarkMode, currencySymbol, onOpenAddModal }) {
  const { transactions, deleteTransaction } = useTransactionContext();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div
      className={`border rounded-[32px] p-8 animate-in slide-in-from-bottom-4 duration-300 ${
        isDarkMode ? 'bg-[#0d0d0f] border-white/5' : 'bg-white border-black/5 shadow-sm'
      }`}
    >
      <h3 className="text-xl font-bold mb-8">Master Ledger</h3>
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        showAll
        dark={isDarkMode}
        symbol={currencySymbol}
      />
    </div>
  );
}

function TransactionList({ transactions, onDelete, showAll, dark, symbol }) {
  if (transactions.length === 0)
    return (
      <div className="text-center py-10 opacity-20 text-sm font-medium tracking-widest italic">
        NO ENTRIES RECORDED.
      </div>
    );

  return (
    <div className={`space-y-3 ${showAll ? '' : 'max-h-[350px] overflow-y-auto'}`}>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={`flex items-center justify-between p-4 rounded-[20px] transition-all group ${
            dark ? 'hover:bg-white/5' : 'hover:bg-black/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                dark ? 'bg-white/5' : 'bg-black/5'
              }`}
            >
              {tx.icon}
            </div>
            <div>
              <p className="text-sm font-bold">{tx.name}</p>
              <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest">
                {tx.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-blue-500' : ''}`}>
              {tx.amount > 0 ? '+' : ''}
              {symbol}
              {Math.abs(tx.amount).toLocaleString('en-IN')}
            </p>
            <button
              onClick={() => onDelete(tx.id)}
              className="opacity-0 group-hover:opacity-100 text-rose-500/60 hover:text-rose-500 transition-all active:scale-90"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
