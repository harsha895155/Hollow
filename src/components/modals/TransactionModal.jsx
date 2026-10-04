import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Calendar, CreditCard, Tag, DollarSign, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import { PAYMENT_METHODS } from '../../constants/categories';

export default function TransactionModal({ isOpen, onClose, initialData = null, defaultType = 'expense' }) {
  const { themeTokens, darkMode, currencySymbol } = useTheme();
  const { categories, addTransaction, updateTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: defaultType,
    category: '',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    receiptUrl: '',
    icon: defaultType === 'income' ? '💰' : '💸',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        amount: Math.abs(initialData.amount) || '',
        type: initialData.type || defaultType,
        category: initialData.category || '',
        paymentMethod: initialData.paymentMethod || 'Credit Card',
        date: initialData.date || new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
        receiptUrl: initialData.receiptUrl || '',
        icon: initialData.icon || (initialData.type === 'income' ? '💰' : '💸'),
      });
    } else {
      // Default category based on type
      const availableCats = categories.filter(c => c.type === defaultType);
      const defaultCat = availableCats[0]?.name || (defaultType === 'income' ? 'Salary' : 'Food & Dining');
      setFormData({
        name: '',
        amount: '',
        type: defaultType,
        category: defaultCat,
        paymentMethod: defaultType === 'income' ? 'Direct Deposit' : 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        receiptUrl: '',
        icon: defaultType === 'income' ? '💰' : '💸',
      });
    }
    setErrors({});
  }, [initialData, defaultType, isOpen, categories]);

  if (!isOpen) return null;

  // Filter categories by selected type
  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleTypeChange = (newType) => {
    const available = categories.filter(c => c.type === newType);
    setFormData(prev => ({
      ...prev,
      type: newType,
      icon: newType === 'income' ? '💰' : '💸',
      category: available[0]?.name || '',
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, receipt: 'Receipt file size must be less than 5MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, receiptUrl: reader.result }));
      setErrors(prev => ({ ...prev, receipt: null }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide a title or description.';
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) errs.amount = 'Amount must be greater than zero.';
    if (!formData.category) errs.category = 'Please select a category.';
    if (!formData.date) errs.date = 'Date is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (initialData?.id) {
        await updateTransaction(initialData.id, formData);
      } else {
        await addTransaction(formData);
      }
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save record.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border p-6 md:p-8 shadow-2xl z-10 ${
        darkMode ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
          <div>
            <h3 className="text-xl font-black tracking-tight">
              {initialData ? 'Edit Entry' : 'Log New Transaction'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the financial details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Segmented Switch */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💸 Outflow (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                formData.type === 'income'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💰 Inflow (Income)
            </button>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Title / Description *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.type === 'expense' ? 'e.g. Apple Store, Whole Foods' : 'e.g. Monthly Salary, Freelance project'}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all ${themeTokens.input}`}
              />
            </div>
            {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Amount ({currencySymbol}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all ${themeTokens.input}`}
                />
              </div>
              {errors.amount && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all ${themeTokens.input}`}
              />
              {errors.date && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.date}</p>}
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer ${themeTokens.input}`}
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name} className="bg-slate-900 text-white">
                    {cat.icon || '🏷️'} {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer ${themeTokens.input}`}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.id} value={m.name} className="bg-slate-900 text-white">
                    {m.icon} {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Notes & Remarks (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add optional notes, tags or bill numbers..."
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium outline-none transition-all resize-none ${themeTokens.input}`}
            />
          </div>

          {/* Receipt / Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Receipt / Bill Attachment (Optional)
            </label>
            {formData.receiptUrl ? (
              <div className="relative rounded-2xl border border-indigo-500/30 overflow-hidden bg-slate-900 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.receiptUrl}
                    alt="Receipt thumbnail"
                    className="w-12 h-12 object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Receipt Attached</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">Ready for verification</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, receiptUrl: '' })}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Remove receipt"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 dark:border-white/15 rounded-2xl cursor-pointer hover:bg-indigo-500/5 hover:border-indigo-500/50 transition-all">
                <Upload size={20} className="text-indigo-400 mb-1" />
                <span className="text-xs font-semibold text-slate-400">
                  Tap or click to attach invoice/receipt image
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
            {errors.receipt && <p className="text-rose-500 text-[11px] mt-1">{errors.receipt}</p>}
          </div>

          {/* Submit */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Record' : 'Log Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
