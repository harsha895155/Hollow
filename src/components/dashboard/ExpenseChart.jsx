import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { CATEGORY_COLORS } from '../../constants/categories';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#4f46e5'];

export default function ExpenseChart({ transactions, isDarkMode, currencySymbol }) {
  const pieData = useMemo(() => {
    const categoryTotals = transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        const amt = Math.abs(t.amount);
        acc[t.category] = (acc[t.category] || 0) + amt;
      }
      return acc;
    }, {});

    return Object.keys(categoryTotals).map(name => ({
      name,
      value: categoryTotals[name]
    }));
  }, [transactions]);

  return (
    <div
      className={`lg:col-span-2 border rounded-[32px] p-8 ${
        isDarkMode ? 'bg-[#0d0d0f] border-white/5' : 'bg-white border-black/5 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold">Expense Distribution</h3>
        <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Categorical Breakdown
        </div>
      </div>
      <div className="h-[320px] w-full">
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#121214' : '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}
                formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <TrendingUp size={48} className="mb-4" />
            <p className="text-sm font-medium">Add expense entries to visualize data</p>
          </div>
        )}
      </div>
    </div>
  );
}
