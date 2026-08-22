export function calculateTotalIncome(transactions) {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function calculateTotalExpenses(transactions) {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function calculateBalance(transactions) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

export function groupByCategory(transactions) {
  const categoryMap = transactions.reduce((acc, t) => {
    const category = t.category;
    if (!acc[category]) {
      acc[category] = { category, total: 0, count: 0 };
    }
    acc[category].total += Math.abs(t.amount);
    acc[category].count += 1;
    return acc;
  }, {});

  return Object.values(categoryMap).sort((a, b) => b.total - a.total);
}

export function calculateCategoryPercentages(transactions) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const total = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  if (total === 0) return [];

  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    const category = t.category;
    acc[category] = (acc[category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: parseFloat(((amount / total) * 100).toFixed(2))
  }));
}
