import React from 'react';
import { X } from 'lucide-react';

export default function EntryModal({ isOpen, onClose, onSubmit, newTx, setNewTx, theme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-[40px] border p-10 shadow-2xl animate-in zoom-in-95 duration-200 ${theme.card}`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter">New Entry</h3>
          <button onClick={onClose} className={`${theme.textMuted} hover:text-white`}><X/></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <input 
            required 
            value={newTx.name} 
            onChange={e => setNewTx({...newTx, name: e.target.value})} 
            className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${theme.input}`} 
            placeholder="Description" 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              required 
              type="number" 
              value={newTx.amount} 
              onChange={e => setNewTx({...newTx, amount: e.target.value})} 
              className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${theme.input}`} 
              placeholder="0.00" 
            />
            <select 
              value={newTx.type} 
              onChange={e => setNewTx({...newTx, type: e.target.value})} 
              className={`w-full border rounded-2xl p-4 outline-none text-sm font-bold ${theme.input}`}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all mt-4">Confirm</button>
        </form>
      </div>
    </div>
  );
}
