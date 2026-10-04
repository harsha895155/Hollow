import { db } from '../config/db.js';

export const getReports = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'monthly' } = req.query;

    let transactions = db.find('transactions', t => t.userId === userId);

    if (startDate) {
      transactions = transactions.filter(t => t.date >= startDate);
    }
    if (endDate) {
      transactions = transactions.filter(t => t.date <= endDate);
    }

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(1)) : 0;

    // Category breakdown for expenses
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount || 0);
      });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Number(((amount / totalExpense) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Grouping by time (monthly / daily)
    const timelineMap = {};
    transactions.forEach(t => {
      let key = t.date;
      if (period === 'monthly' && t.date) {
        key = t.date.substring(0, 7); // YYYY-MM
      } else if (period === 'yearly' && t.date) {
        key = t.date.substring(0, 4); // YYYY
      }

      if (!key) return;

      if (!timelineMap[key]) {
        timelineMap[key] = { label: key, income: 0, expense: 0, savings: 0 };
      }
      if (t.type === 'income') {
        timelineMap[key].income += Number(t.amount || 0);
      } else {
        timelineMap[key].expense += Number(t.amount || 0);
      }
      timelineMap[key].savings = timelineMap[key].income - timelineMap[key].expense;
    });

    const timeline = Object.values(timelineMap).sort((a, b) => a.label.localeCompare(b.label));

    // Top spending categories
    const topSpending = categoryBreakdown.slice(0, 5);

    // Payment methods breakdown
    const paymentMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const method = t.paymentMethod || 'Other';
        paymentMap[method] = (paymentMap[method] || 0) + Number(t.amount || 0);
      });
    const paymentMethods = Object.entries(paymentMap).map(([method, amount]) => ({
      method,
      amount,
    }));

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netSavings,
          savingsRate,
          transactionCount: transactions.length,
        },
        categoryBreakdown,
        topSpending,
        timeline,
        paymentMethods,
      },
    });
  } catch (err) {
    next(err);
  }
};
