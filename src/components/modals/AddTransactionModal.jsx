import React, { useState } from 'react';
import { X } from 'lucide-react';
import { validateTransaction } from '../../utils/dataProcessing';

export default function AddTransactionModal({ isOpen, onClose, onSubmit, categories, isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'General',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTransaction({ ...formData, amount: parseFloat(formData.amount) });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      icon: formData.type === 'income' ? '💰' : '💸'
    });
    
    setFormData({
      name: '',
      amount: '',
      category: 'General',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-[32px] border p-8 shadow-2xl animate-in zoom-in duration-200 ${
          isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-black/10'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">New Transaction</h3>
          <button onClick={onClose} className="opacity-40 hover:opacity-100">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full border rounded-2xl p-4 outline-none focus:border-blue-500 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}
            placeholder="Title"
          />
          {errors.name && <p className="text-rose-500 text-xs">{errors.name}</p>}
          
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full border rounded-2xl p-4 outline-none focus:border-blue-500 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
              placeholder="0.00"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full border rounded-2xl p-4 outline-none ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          {errors.amount && <p className="text-rose-500 text-xs">{errors.amount}</p>}
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full border rounded-2xl p-4 outline-none ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/30">
            Log Entry
          </button>
        </form>
      </div>
    </div>
  );
}
