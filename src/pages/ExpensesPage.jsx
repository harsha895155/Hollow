import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  FileDown,
  FileText,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { Badge, EmptyState, ConfirmDialog } from '../components/common/Badge';
import { exportToCSV } from '../utils/exportUtils';
import { PAYMENT_METHODS } from '../constants/categories';

export default function ExpensesPage({ onOpenAddModal, onEditTransaction, onViewReceipt }) {
  const { themeTokens, currencySymbol, formatAmount } = useTheme();
  const { transactions, categories, deleteTransaction } = useTransactions();

  // View mode: 'grid' or 'table' (defaults to grid for mobile first excellence)
  const [viewMode, setViewMode] = useState('grid');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Filter and sort transactions
  const filteredExpenses = useMemo(() => {
    let list = transactions.filter(t => t.type === 'expense');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(t =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(t => t.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedPayment !== 'all') {
      list = list.filter(t => t.paymentMethod?.toLowerCase() === selectedPayment.toLowerCase());
    }

    if (startDate) {
      list = list.filter(t => t.date >= startDate);
    }
    if (endDate) {
      list = list.filter(t => t.date <= endDate);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return list;
  }, [transactions, searchTerm, selectedCategory, selectedPayment, startDate, endDate, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  }, [filteredExpenses]);

  const handleExport = () => {
    exportToCSV(filteredExpenses, `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id, 'expense');
      setDeleteTarget(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPayment('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Total and Add Action */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shrink-0">
            💸
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Total Outflow Tracked
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {formatAmount(totalFilteredAmount)}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredExpenses.length} expense record{filteredExpenses.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <FileDown size={16} /> Export CSV
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-5 rounded-2xl ${themeTokens.card} space-y-4`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search expenses by title, notes, or category..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${themeTokens.input}`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Category filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer ${themeTokens.input}`}
            >
              <option value="all">All Categories</option>
              {expenseCategories.map(c => (
                <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                  {c.icon || '🏷️'} {c.name}
                </option>
              ))}
            </select>

            {/* Quick Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer ${themeTokens.input}`}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Switcher: Grid vs Table */}
            <div className="flex items-center rounded-xl p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Grid Mode View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Table Mode View"
              >
                <List size={15} />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className={`md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-white/10 ${
                showFiltersMobile ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Extended Filters: Dates & Payment Method */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-white/10 ${
          showFiltersMobile ? 'block' : 'hidden md:grid'
        }`}>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Payment Method</label>
            <select
              value={selectedPayment}
              onChange={e => setSelectedPayment(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
            >
              <option value="all">All Payment Methods</option>
              {PAYMENT_METHODS.map(m => (
                <option key={m.id} value={m.name} className="bg-slate-900 text-white">
                  {m.icon} {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">To Date</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none ${themeTokens.input}`}
              />
              {(selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 shrink-0"
                  title="Reset all filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expense List: Grid Mode or Table Mode */}
      {filteredExpenses.length === 0 ? (
        <div className={`rounded-3xl ${themeTokens.card} overflow-hidden shadow-xl`}>
          <EmptyState
            icon={searchTerm || selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate ? "🔍" : "💸"}
            title={searchTerm || selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate ? "No matching expenses" : "No expenses yet"}
            description={searchTerm || selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate ? "No expense records match your active search and filter criteria." : "Start tracking your spending by adding your first expense."}
            actionText={searchTerm || selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate ? "Clear All Filters" : "+ Add Expense"}
            onAction={searchTerm || selectedCategory !== 'all' || selectedPayment !== 'all' || startDate || endDate ? resetFilters : () => onOpenAddModal('expense')}
          />
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${themeTokens.card} ${themeTokens.cardHover}`}
            >
              <div>
                {/* Header: Icon, Category & Amount */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl shrink-0">
                      {expense.icon || '💸'}
                    </div>
                    <div>
                      <Badge variant="neutral">{expense.category}</Badge>
                      <p className="text-[11px] text-slate-400 mt-1">{expense.date}</p>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-black text-rose-500 shrink-0">
                    -{currencySymbol}{Math.abs(Number(expense.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Name & Notes */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {expense.name}
                </h4>
                {expense.notes && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {expense.notes}
                  </p>
                )}
              </div>

              {/* Footer: Payment Method & Touch Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 mt-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent">
                  {expense.paymentMethod || 'Credit Card'}
                </span>

                <div className="flex items-center gap-1">
                  {expense.receiptUrl && (
                    <button
                      onClick={() => onViewReceipt(expense.receiptUrl, expense.name)}
                      className="p-1.5 text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="View Receipt"
                    >
                      <FileText size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => onEditTransaction(expense)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Edit Expense"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(expense)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode View */
        <div className={`rounded-3xl ${themeTokens.card} overflow-hidden shadow-xl`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-transparent">
                  <th className="py-4 px-6">Expense Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-xs">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Title & Notes */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-transparent flex items-center justify-center text-lg shrink-0">
                          {expense.icon || '💸'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {expense.name}
                          </p>
                          {expense.notes && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {expense.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <Badge variant="neutral">
                        {expense.category}
                      </Badge>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {expense.paymentMethod || 'Credit Card'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                      {expense.date}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-right whitespace-nowrap font-black text-rose-500">
                      -{currencySymbol}{Math.abs(Number(expense.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {expense.receiptUrl && (
                          <button
                            onClick={() => onViewReceipt(expense.receiptUrl, expense.name)}
                            className="p-1.5 text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            title="View Receipt"
                          >
                            <FileText size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => onEditTransaction(expense)}
                          className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(expense)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Expense Entry"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${currencySymbol}${deleteTarget?.amount})? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
