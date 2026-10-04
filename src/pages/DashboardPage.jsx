import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Trash2,
  Edit2,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../components/common/StatCard';
import { EmptyState } from '../components/common/Badge';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';

const PIE_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#3b82f6', '#84cc16'];

export default function DashboardPage({ onNavigate, onOpenAddModal, onEditTransaction, onViewReceipt }) {
  const { themeTokens, darkMode, currencySymbol, formatAmount } = useTheme();
  const { transactions, metrics, deleteTransaction } = useTransactions();

  const recentTransactions = transactions.slice(0, 7);

  // Group last 6 months for Inflow vs Outflow BarChart
  const monthlyData = React.useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      months[key] = { name: label, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      if (!t.date) return;
      const key = t.date.substring(0, 7);
      if (months[key]) {
        const amt = Math.abs(Number(t.amount) || 0);
        if (t.type === 'income') {
          months[key].income += amt;
        } else {
          months[key].expense += amt;
        }
      }
    });

    return Object.values(months);
  }, [transactions]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Exceeded Budgets Alert Banner */}
      {metrics.exceededBudgetsCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold">
                Budget Alert: {metrics.exceededBudgetsCount} category spending limit{metrics.exceededBudgetsCount > 1 ? 's' : ''} exceeded!
              </p>
              <p className="text-[11px] text-rose-400">
                Review your active limits and rebalance your capital allocation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('budgets')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            View Budgets
          </button>
        </div>
      )}

      {/* Summary Cards - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <StatCard
          title="Total Net Liquidity"
          value={formatAmount(metrics.totalBalance)}
          icon={<Wallet size={20} />}
          isPrimary
          subtitle={`Across ${metrics.totalTransactions} entries`}
        />
        <StatCard
          title="Total Inflow"
          value={formatAmount(metrics.totalIncome)}
          icon={<ArrowUpRight size={20} />}
          trend="up"
          change={`+${currencySymbol}${metrics.currentMonthIncome.toLocaleString('en-IN')}`}
          subtitle="This month"
        />
        <StatCard
          title="Total Outflow"
          value={formatAmount(metrics.totalExpense)}
          icon={<ArrowDownRight size={20} />}
          trend="down"
          change={`-${currencySymbol}${metrics.currentMonthExpense.toLocaleString('en-IN')}`}
          subtitle="This month"
        />
        <StatCard
          title="Savings Rate"
          value={`${metrics.savingsRate}%`}
          icon={<TrendingUp size={20} />}
          trend={metrics.savingsRate > 20 ? 'up' : 'neutral'}
          subtitle={`Top: ${metrics.topCategory}`}
        />
      </div>

      {/* Analytics Visuals: Donut Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Allocation Pie / Donut */}
        <div className={`p-6 md:p-7 rounded-3xl ${themeTokens.card} lg:col-span-1 flex flex-col`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Capital Allocation
              </h3>
              <p className="text-[11px] text-slate-400">Expenses by Category</p>
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              All Categories <ChevronRight size={14} />
            </button>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            {metrics.categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {metrics.categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${currencySymbol}${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      color: darkMode ? '#f8fafc' : '#0f172a',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center text-lg mb-2">
                  🍩
                </div>
                <p className="text-xs font-bold text-slate-400">No expenses yet</p>
                <p className="text-[11px] text-slate-500">
                  Expenses will be categorized automatically as you log them.
                </p>
              </div>
            )}
          </div>

          {/* Quick legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-white/10 mt-auto">
            {metrics.categoryChartData.length > 0 ? (
              metrics.categoryChartData.slice(0, 4).map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{cat.name}</span>
                </div>
              ))
            ) : (
              <span className="col-span-2 text-center text-[10px] text-slate-500">0 active categories</span>
            )}
          </div>
        </div>

        {/* Inflow vs Outflow Trend Bar Chart */}
        <div className={`p-6 md:p-7 rounded-3xl ${themeTokens.card} lg:col-span-2 flex flex-col`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Cash Flow Dynamics
              </h3>
              <p className="text-[11px] text-slate-400">Income vs Expenses (Last 5 Months)</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              Full Analytics <ChevronRight size={14} />
            </button>
          </div>

          {transactions.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                  <YAxis
                    stroke={darkMode ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip
                    formatter={(val) => [`${currencySymbol}${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl mb-1">
                📊
              </div>
              <p className="text-xs font-bold text-slate-400">No cash flow activity yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Add your first income or expense to generate live cash flow comparisons.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-200 dark:border-white/10 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <span className="w-3 h-3 rounded-md bg-emerald-500" /> Total Inflow
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
              <span className="w-3 h-3 rounded-md bg-rose-500" /> Total Outflow
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Transactions & Active Budget Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ledger */}
        <div className={`p-6 md:p-7 rounded-3xl ${themeTokens.card} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Ledger Activity
              </h3>
              <p className="text-[11px] text-slate-400">Latest debits and credits</p>
            </div>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              Master Ledger <ChevronRight size={14} />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="💸"
              title="No transactions yet"
              description="Add your first income or expense to get started."
              actionText="+ Log First Entry"
              onAction={onOpenAddModal}
            />
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-3.5 md:p-4 rounded-2xl transition-all duration-200 group ${
                      darkMode ? 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/5' : 'bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200 shadow-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-transparent flex items-center justify-center text-lg shrink-0">
                        {tx.icon || (isIncome ? '💰' : '💸')}
                      </div>
                      <div className="truncate">
                        <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {tx.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">{tx.date}</span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400">
                            {tx.category}
                          </span>
                          {tx.receiptUrl && (
                            <button
                              onClick={() => onViewReceipt(tx.receiptUrl, tx.name)}
                              className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                            >
                              <FileText size={11} /> Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                      <span className={`text-xs md:text-sm font-black ${isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {isIncome ? '+' : '-'}{currencySymbol}{Math.abs(Number(tx.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1 sm:p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-white/10 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id, tx.type)}
                          className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white/10 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Health Overview */}
        <div className={`p-6 md:p-7 rounded-3xl ${themeTokens.card} flex flex-col`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Budget Target Health
              </h3>
              <p className="text-[11px] text-slate-400">Current month limit tracking</p>
            </div>
            <button
              onClick={() => onNavigate('budgets')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
            >
              Manage <ChevronRight size={14} />
            </button>
          </div>

          {metrics.budgetsWithProgress.length === 0 ? (
            <div className="my-auto text-center py-8">
              <p className="text-xs font-bold text-slate-400">No budgets set</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Establish monthly spending limits to stay on top of your financial goals.
              </p>
              <button
                onClick={() => onNavigate('budgets')}
                className="mt-3 px-3 py-1.5 text-xs font-bold text-indigo-500 bg-indigo-500/10 rounded-xl"
              >
                Set Category Budget
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.budgetsWithProgress.slice(0, 5).map((b) => {
                const isOver = b.isExceeded;
                const isWarn = b.isNearLimit;
                return (
                  <div key={b.id || b.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{b.category}</span>
                      <span className="font-semibold text-slate-400">
                        {currencySymbol}{b.spent.toLocaleString()} / {currencySymbol}{Number(b.monthlyLimit).toLocaleString()}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(b.percentageUsed, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{b.percentageUsed}% utilized</span>
                      {isOver ? (
                        <span className="text-rose-500 font-bold">Exceeded by {currencySymbol}{(b.spent - b.monthlyLimit).toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-500 font-semibold">{currencySymbol}{b.remaining.toLocaleString()} left</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
