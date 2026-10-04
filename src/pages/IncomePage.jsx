import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  FileDown,
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { Badge, EmptyState, ConfirmDialog } from '../components/common/Badge';
import { exportToCSV } from '../utils/exportUtils';

export default function IncomePage({ onOpenAddModal, onEditTransaction }) {
  const { themeTokens, currencySymbol, formatAmount } = useTheme();
  const { transactions, categories, deleteTransaction } = useTransactions();

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const incomeCategories = categories.filter(c => c.type === 'income');

  const filteredIncome = useMemo(() => {
    let list = transactions.filter(t => t.type === 'income');

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

    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [transactions, searchTerm, selectedCategory]);

  const totalIncomeAmount = useMemo(() => {
    return filteredIncome.reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  }, [filteredIncome]);

  const handleExport = () => {
    exportToCSV(filteredIncome, `income_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id, 'income');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl shrink-0">
            💰
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Total Inflow Revenue
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {formatAmount(totalIncomeAmount)}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Across {filteredIncome.length} income stream{filteredIncome.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <FileDown size={16} /> Export CSV
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} /> Log Income
          </button>
        </div>
      </div>

      {/* Search and Category Filter with View Mode Toggle */}
      <div className={`p-4 rounded-2xl ${themeTokens.card} flex flex-col sm:flex-row items-center gap-3`}>
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search income sources, clients, employers, notes..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer ${themeTokens.input}`}
          >
            <option value="all">All Income Streams</option>
            {incomeCategories.map(c => (
              <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                {c.icon || '💼'} {c.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center rounded-xl p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-sm'
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
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
              title="Table Mode View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Income Records: Grid Mode or Table Mode */}
      {filteredIncome.length === 0 ? (
        <div className={`rounded-3xl ${themeTokens.card} overflow-hidden shadow-xl`}>
          <EmptyState
            icon={searchTerm || selectedCategory !== 'all' ? "🔍" : "💰"}
            title={searchTerm || selectedCategory !== 'all' ? "No matching income records" : "No income records yet"}
            description={searchTerm || selectedCategory !== 'all' ? "No income streams match your active search and filter criteria." : "Add your first income to track your cash inflows."}
            actionText={searchTerm || selectedCategory !== 'all' ? "Clear Filters" : "+ Record First Inflow"}
            onAction={searchTerm || selectedCategory !== 'all' ? () => { setSearchTerm(''); setSelectedCategory('all'); } : () => onOpenAddModal('income')}
          />
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {filteredIncome.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${themeTokens.card} ${themeTokens.cardHover}`}
            >
              <div>
                {/* Header: Icon, Category & Inflow Amount */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl shrink-0">
                      {item.icon || '💰'}
                    </div>
                    <div>
                      <Badge variant="income">{item.category}</Badge>
                      <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-black text-emerald-500 shrink-0">
                    +{currencySymbol}{Math.abs(Number(item.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Source Name & Notes */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {item.name}
                </h4>
                {item.notes && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Footer: Payment Method & Touch Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 mt-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-transparent">
                  {item.paymentMethod || 'Direct Deposit'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditTransaction(item)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Edit Income"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Income"
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
                  <th className="py-4 px-6">Income Source</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Inflow Amount</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-xs">
                {filteredIncome.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-transparent flex items-center justify-center text-lg shrink-0">
                          {item.icon || '💰'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="income">
                        {item.category}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                      {item.paymentMethod || 'Direct Deposit'}
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap font-black text-emerald-500">
                      +{currencySymbol}{Math.abs(Number(item.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditTransaction(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Edit Income"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Income"
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Income Record"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (+${currencySymbol}${deleteTarget?.amount})?`}
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
