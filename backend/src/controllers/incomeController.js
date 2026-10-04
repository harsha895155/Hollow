import { db } from '../config/db.js';

export const getIncome = (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, search, startDate, endDate, sortBy = 'date', sortOrder = 'desc' } = req.query;

    let incomeList = db.find('transactions', t => t.userId === userId && t.type === 'income');

    if (category && category !== 'all') {
      incomeList = incomeList.filter(i => i.category?.toLowerCase() === category.toLowerCase());
    }

    if (startDate) {
      incomeList = incomeList.filter(i => i.date >= startDate);
    }
    if (endDate) {
      incomeList = incomeList.filter(i => i.date <= endDate);
    }

    if (search) {
      const q = search.toLowerCase();
      incomeList = incomeList.filter(i =>
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q))
      );
    }

    incomeList.sort((a, b) => {
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
      count: incomeList.length,
      data: incomeList,
    });
  } catch (err) {
    next(err);
  }
};

export const getIncomeById = (req, res, next) => {
  try {
    const income = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'income');
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }
    return res.status(200).json({ success: true, data: income });
  } catch (err) {
    next(err);
  }
};

export const createIncome = (req, res, next) => {
  try {
    const { name, source, amount, category = 'Salary', date, paymentMethod = 'Direct Deposit', notes = '', icon = '💰' } = req.body;

    const newIncome = db.insert('transactions', {
      userId: req.user.id,
      name: (name || source).trim(),
      amount: Math.abs(parseFloat(amount)),
      category: category.trim(),
      type: 'income',
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod,
      notes: notes.trim(),
      icon,
    });

    return res.status(201).json({
      success: true,
      message: 'Income added successfully.',
      data: newIncome,
    });
  } catch (err) {
    next(err);
  }
};

export const updateIncome = (req, res, next) => {
  try {
    const income = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'income');
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }

    const { name, source, amount, category, date, paymentMethod, notes, icon } = req.body;
    const updates = {};
    if (name !== undefined || source !== undefined) updates.name = (name || source).trim();
    if (amount !== undefined) updates.amount = Math.abs(parseFloat(amount));
    if (category !== undefined) updates.category = category.trim();
    if (date !== undefined) updates.date = date;
    if (paymentMethod !== undefined) updates.paymentMethod = paymentMethod;
    if (notes !== undefined) updates.notes = notes.trim();
    if (icon !== undefined) updates.icon = icon;

    const updated = db.updateById('transactions', income.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Income updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteIncome = (req, res, next) => {
  try {
    const income = db.findOne('transactions', t => t.id === req.params.id && t.userId === req.user.id && t.type === 'income');
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income record not found.' });
    }

    db.deleteById('transactions', income.id);

    return res.status(200).json({
      success: true,
      message: 'Income record deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
