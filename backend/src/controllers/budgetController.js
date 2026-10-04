import { db } from '../config/db.js';

export const getBudgets = (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentMonth = req.query.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budgets = db.find('budgets', b => b.userId === userId && (!b.month || b.month === currentMonth));

    // Get all user expenses for this month to calculate actual spending
    const expenses = db.find('transactions', t => {
      if (t.userId !== userId || t.type !== 'expense') return false;
      const tMonth = t.date ? t.date.substring(0, 7) : '';
      return tMonth === currentMonth;
    });

    const budgetsWithProgress = budgets.map(b => {
      const spent = expenses
        .filter(e => e.category?.toLowerCase() === b.category?.toLowerCase())
        .reduce((sum, e) => sum + e.amount, 0);

      const limit = Number(b.monthlyLimit) || 0;
      const remaining = limit - spent;
      const percentageUsed = limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0;
      const isExceeded = spent > limit;
      const isNearLimit = !isExceeded && percentageUsed >= 80;

      return {
        ...b,
        spent,
        remaining,
        percentageUsed,
        isExceeded,
        isNearLimit,
      };
    });

    // Also calculate overall monthly budget metrics
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit || 0), 0);
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallPercentage = totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      currentMonth,
      summary: {
        totalBudget,
        totalSpent,
        totalRemaining,
        overallPercentage,
        isExceeded: totalSpent > totalBudget,
      },
      data: budgetsWithProgress,
    });
  } catch (err) {
    next(err);
  }
};

export const createBudget = (req, res, next) => {
  try {
    const { category, monthlyLimit, month, alertThreshold = 80 } = req.body;
    const now = new Date();
    const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const userId = req.user.id;

    // Check if budget for category & month already exists
    const existing = db.findOne('budgets', b => b.userId === userId && b.category.toLowerCase() === category.toLowerCase() && b.month === targetMonth);
    if (existing) {
      return res.status(409).json({ success: false, message: `Budget for ${category} already exists for ${targetMonth}. You can edit it instead.` });
    }

    const newBudget = db.insert('budgets', {
      userId,
      category: category.trim(),
      monthlyLimit: Math.abs(parseFloat(monthlyLimit)),
      month: targetMonth,
      alertThreshold: Number(alertThreshold),
    });

    return res.status(201).json({
      success: true,
      message: 'Budget created successfully.',
      data: newBudget,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = (req, res, next) => {
  try {
    const budget = db.findOne('budgets', b => b.id === req.params.id && b.userId === req.user.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found.' });
    }

    const { monthlyLimit, alertThreshold, category } = req.body;
    const updates = {};
    if (monthlyLimit !== undefined) updates.monthlyLimit = Math.abs(parseFloat(monthlyLimit));
    if (alertThreshold !== undefined) updates.alertThreshold = Number(alertThreshold);
    if (category !== undefined) updates.category = category.trim();

    const updated = db.updateById('budgets', budget.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = (req, res, next) => {
  try {
    const budget = db.findOne('budgets', b => b.id === req.params.id && b.userId === req.user.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found.' });
    }

    db.deleteById('budgets', budget.id);

    return res.status(200).json({
      success: true,
      message: 'Budget deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
