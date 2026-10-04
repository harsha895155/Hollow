import React, { useState, useMemo } from 'react';
import {
  FileDown,
  Printer,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { exportToCSV, prepareForPrint } from '../utils/exportUtils';

const REPORT_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#3b82f6', '#eab308'];

export default function ReportsPage() {
  const { themeTokens, darkMode, currencySymbol, formatAmount } = useTheme();
  const { transactions } = useTransactions();

  // Date range filter
  const [period, setPeriod] = useState('all'); // 'this_month', 'last_30', 'this_year', 'all', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Filter transactions based on date period
  const filteredData = useMemo(() => {
    let list = [...transactions];
    const now = new Date();

    if (period === 'this_month') {
      const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      list = list.filter(t => t.date && t.date.startsWith(curMonth));
    } else if (period === 'last_30') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      const thirtyDaysAgo = d.toISOString().split('T')[0];
      list = list.filter(t => t.date && t.date >= thirtyDaysAgo);
    } else if (period === 'this_year') {
      const curYear = String(now.getFullYear());
      list = list.filter(t => t.date && t.date.startsWith(curYear));
    } else if (period === 'custom' && (customStart || customEnd)) {
      if (customStart) list = list.filter(t => t.date >= customStart);
      if (customEnd) list = list.filter(t => t.date <= customEnd);
    }

    return list;
  }, [transactions, period, customStart, customEnd]);

  // Aggregated intelligence
  const intelligence = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    const categoryTotals = {};
    const paymentTotals = {};
    const timelineMap = {};

    filteredData.forEach(t => {
      const amt = Math.abs(Number(t.amount) || 0);
      if (t.type === 'income') {
        totalInflow += amt;
      } else {
        totalOutflow += amt;
        const cat = t.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;

        const pm = t.paymentMethod || 'Other';
        paymentTotals[pm] = (paymentTotals[pm] || 0) + amt;
      }

      // Timeline grouping by date or month
      const key = t.date ? t.date.substring(0, 7) : 'Unknown';
      if (!timelineMap[key]) {
        timelineMap[key] = { month: key, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        timelineMap[key].income += amt;
      } else {
        timelineMap[key].expense += amt;
      }
    });

    const netSavings = totalInflow - totalOutflow;
    const savingsRatio = totalInflow > 0 ? ((netSavings / totalInflow) * 100).toFixed(1) : 0;

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        pct: totalOutflow > 0 ? ((value / totalOutflow) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const timelineData = Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalInflow,
      totalOutflow,
      netSavings,
      savingsRatio,
      categoryBreakdown,
      timelineData,
      count: filteredData.length,
    };
  }, [filteredData]);

  const handleExportCSV = () => {
    exportToCSV(filteredData, `hollow_financial_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 print-container">
      {/* Report Controls (Hidden in print) */}
      <div className={`p-6 rounded-3xl ${themeTokens.card} flex flex-col md:flex-row md:items-center justify-between gap-4 no-print`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter size={14} /> Timeframe:
          </span>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_30', label: 'Last 30 Days' },
            { id: 'this_year', label: 'This Year' },
            { id: 'custom', label: 'Custom Range' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                period === p.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <FileDown size={15} /> Export CSV
          </button>
          <button
            onClick={prepareForPrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Custom Range Inputs */}
      {period === 'custom' && (
        <div className={`p-4 rounded-2xl ${themeTokens.card} flex flex-wrap items-center gap-3 no-print`}>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>From:</span>
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${themeTokens.input}`}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${themeTokens.input}`}
            />
          </div>
        </div>
      )}

      {/* Printable Report Header */}
      <div className={`p-6 md:p-8 rounded-3xl ${themeTokens.card} print-card border`}>
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
              H
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Financial Statement & Intelligence Briefing
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generated {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} · Production Ledger
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              AUDITED
            </span>
          </div>
        </div>

        {/* 4 Metrics in Briefing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Total Inflow</p>
            <p className="text-xl font-black text-emerald-500">{formatAmount(intelligence.totalInflow)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Total Outflow</p>
            <p className="text-xl font-black text-rose-500">{formatAmount(intelligence.totalOutflow)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Net Savings</p>
            <p className={`text-xl font-black ${intelligence.netSavings >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
              {formatAmount(intelligence.netSavings)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-subtle">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Savings Efficiency</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{intelligence.savingsRatio}%</p>
          </div>
        </div>

        {/* Analytics Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Allocation Pie */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Category Capital Allocation
            </h4>
            <div className="h-64 w-full flex items-center justify-center">
              {intelligence.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={intelligence.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {intelligence.categoryBreakdown.map((e, idx) => (
                        <Cell key={e.name} fill={REPORT_COLORS[idx % REPORT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${currencySymbol}${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400">No outflow data for chart.</p>
              )}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Timeline Comparison
            </h4>
            <div className="h-64 w-full">
              {intelligence.timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={intelligence.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="month" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={10} />
                    <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={10} />
                    <Tooltip formatter={(v) => `${currencySymbol}${Number(v).toLocaleString('en-IN')}`} />
                    <Bar dataKey="income" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400">No timeline data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Category Cards / Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Category Breakdown
          </h4>
          {/* Mobile Grid Mode Cards (< sm) */}
          <div className="grid grid-cols-2 sm:hidden gap-2.5 mb-4">
            {intelligence.categoryBreakdown.map((cat, idx) => (
              <div key={cat.name} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: REPORT_COLORS[idx % REPORT_COLORS.length] }} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-200 dark:border-white/10">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{currencySymbol}{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                  <span className="text-[10px] text-indigo-500 font-bold">{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70 dark:bg-transparent">
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Total Outflow</th>
                  <th className="py-2.5 px-4 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {intelligence.categoryBreakdown.map((cat, idx) => (
                  <tr key={cat.name}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: REPORT_COLORS[idx % REPORT_COLORS.length] }} />
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                      {currencySymbol}{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-indigo-500 font-bold">
                      {cat.pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
