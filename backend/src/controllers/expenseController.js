import { db } from '../config/db.js';

export const getExpenses = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, search, startDate, endDate, paymentMethod, sortBy = 'date', sortOrder = 'desc' } = req.query;

    let expenses = db.find('transactions', t => t.userId === userId && t.type === 'expense');

    if (category && category !== 'all') {
      expenses = expenses.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }

    if (paymentMethod && paymentMethod !== 'all') {
      expenses = expenses.filter(e => e.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase());
    }

    if (startDate) {
      expenses = expenses.filter(e => e.date >= startDate);
    }
    if (endDate) {
      expenses = expenses.filter(e => e.date <= endDate);
    }

    if (search) {
      const q = search.toLowerCase();
      expenses = expenses.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))
      );
    }

    expenses.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = (req, res, next) => {
  try {
    const expense = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'expense');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }
    return res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const createExpense = (req, res, next) => {
  try {
    const { name, amount, category, date, paymentMethod = 'Credit Card', notes = '', receiptUrl = '', icon = '💸' } = req.body;

    const newExpense = db.insert('transactions', {
      userId: req.user.id,
      name: name.trim(),
      amount: Math.abs(parseFloat(amount)),
      category: category.trim(),
      type: 'expense',
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod,
      notes: notes.trim(),
      receiptUrl,
      icon,
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      data: newExpense,
    });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = (req, res, next) => {
  try {
    const expense = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'expense');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    const { name, amount, category, date, paymentMethod, notes, receiptUrl, icon } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (amount !== undefined) updates.amount = Math.abs(parseFloat(amount));
    if (category !== undefined) updates.category = category.trim();
    if (date !== undefined) updates.date = date;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
    if (notes !== undefined) updates.notes = notes.trim();
    if (receiptUrl !== undefined) updates.receiptUrl = receiptUrl;
    if (icon !== undefined) updates.icon = icon;

    const updated = db.updateById('transactions', expense.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = (req, res, next) => {
  try {
    const expense = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'expense');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    db.deleteById('transactions', expense.id);

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
