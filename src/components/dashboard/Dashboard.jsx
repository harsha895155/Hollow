import React, { useMemo } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import ExpenseChart from './ExpenseChart';
import { useTransactionContext } from '../../context/TransactionContext';
import { calculateTotalIncome, calculateTotalExpenses, calculateBalance } from '../../utils/financialCalculations';

export default function Dashboard({ isDarkMode, currencySymbol }) {
  const { transactions } = useTransactionContext();

  const metrics = useMemo(() => {
    const income = calculateTotalIncome(transactions);
    const expense = calculateTotalExpenses(transactions);
    const balance = calculateBalance(transactions);
    const savingsRate = income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;

    return { income, expense, balance, savingsRate };
  }, [transactions]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Liquidity"
          value={`${currencySymbol}${metrics.balance.toLocaleString('en-IN')}`}
          icon={<CreditCard size={18} />}
          isBlue
        />
        <StatCard
          title="Total Income"
          value={`${currencySymbol}${metrics.income.toLocaleString('en-IN')}`}
          icon={<ArrowUpRight size={18} />}
          color="text-blue-400"
          dark={isDarkMode}
        />
        <StatCard
          title="Total Expenses"
          value={`${currencySymbol}${metrics.expense.toLocaleString('en-IN')}`}
          icon={<ArrowDownRight size={18} />}
          color="text-rose-400"
          dark={isDarkMode}
        />
        <StatCard
          title="Savings Rate"
          value={`${metrics.savingsRate}%`}
          icon={<TrendingUp size={18} />}
          color="text-emerald-400"
          dark={isDarkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <ExpenseChart
          transactions={transactions}
          isDarkMode={isDarkMode}
          currencySymbol={currencySymbol}
        />

        <div
          className={`border rounded-[32px] p-8 ${
            isDarkMode ? 'bg-[#0d0d0f] border-white/5' : 'bg-white border-black/5 shadow-sm'
          }`}
        >
          <h3 className="text-lg font-bold mb-6">Recent Records</h3>
          <TransactionList
            transactions={transactions.slice(0, 5)}
            dark={isDarkMode}
            symbol={currencySymbol}
          />
        </div>
      </div>
    </div>
  );
}

function TransactionList({ transactions, dark, symbol }) {
  if (transactions.length === 0)
    return (
      <div className="text-center py-10 opacity-20 text-sm font-medium tracking-widest italic">
        NO ENTRIES RECORDED.
      </div>
    );

  return (
    <div className="space-y-3 max-h-[350px] overflow-y-auto">
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
          </div>
        </div>
      ))}
    </div>
  );
}
