import { db } from '../config/db.js';

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense', color: '#f97316', icon: '🍔' },
  { name: 'Transportation', type: 'expense', color: '#06b6d4', icon: '🚗' },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: '🛍️' },
  { name: 'Bills', type: 'expense', color: '#ef4444', icon: '📄' },
  { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬' },
  { name: 'Health', type: 'expense', color: '#10b981', icon: '🏥' },
  { name: 'Education', type: 'expense', color: '#3b82f6', icon: '📚' },
  { name: 'Travel', type: 'expense', color: '#6366f1', icon: '✈️' },
  { name: 'Rent', type: 'expense', color: '#a855f7', icon: '🏠' },
  { name: 'Subscriptions', type: 'expense', color: '#14b8a6', icon: '🔄' },
  { name: 'Other', type: 'expense', color: '#64748b', icon: '📦' },
  { name: 'Salary', type: 'income', color: '#10b981', icon: '💼' },
  { name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💻' },
  { name: 'Investment', type: 'income', color: '#8b5cf6', icon: '📈' },
  { name: 'Bonus', type: 'income', color: '#f59e0b', icon: '🎁' },
  { name: 'Other Income', type: 'income', color: '#64748b', icon: '💵' },
];

export const getCategories = (req, res, next) => {
  try {
    const userId = req.user.id;
    let userCategories = db.find('categories', c => c.userId === userId);

    if (userCategories.length === 0) {
      // Bulk initialize with defaults for this user in a single operation
      const toInsert = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        userId,
        isCustom: false,
      }));
      userCategories = db.insertMany('categories', toInsert);
    }

    // Attach total spending to each category
    const userExpenses = db.find('transactions', t => t.userId === userId && t.type === 'expense');
    const categoriesWithSpend = userCategories.map(cat => {
      const totalSpent = userExpenses
        .filter(e => (e.category || '').toLowerCase() === (cat.name || '').toLowerCase())
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      return {
        ...cat,
        totalSpent,
      };
    });

    return res.status(200).json({
      success: true,
      data: categoriesWithSpend,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = (req, res, next) => {
  try {
    const { name, type = 'expense', color = '#6366f1', icon = '🏷️' } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const userId = req.user.id;
    const existing = db.findOne('categories', c => c.userId === userId && (c.name || '').toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists.' });
    }

    const newCat = db.insert('categories', {
      userId,
      name: name.trim(),
      type,
      color,
      icon,
      isCustom: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: newCat,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = (req, res, next) => {
  try {
    const cat = db.findOne('categories', c => c.id === req.params.id && c.userId === req.user.id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, color, icon, type } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (color) updates.color = color;
    if (icon) updates.icon = icon;
    if (type) updates.type = type;

    const updated = db.updateById('categories', cat.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = (req, res, next) => {
  try {
    const cat = db.findOne('categories', c => c.id === req.params.id && c.userId === req.user.id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    db.deleteById('categories', cat.id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
