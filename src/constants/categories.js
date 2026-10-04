export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { name: 'Transportation', icon: '🚗', color: '#06b6d4' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Bills & Utilities', icon: '📄', color: '#ef4444' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { name: 'Health & Medical', icon: '🏥', color: '#10b981' },
  { name: 'Education', icon: '📚', color: '#3b82f6' },
  { name: 'Travel', icon: '✈️', color: '#6366f1' },
  { name: 'Rent & Housing', icon: '🏠', color: '#a855f7' },
  { name: 'Subscriptions', icon: '🔄', color: '#14b8a6' },
  { name: 'Groceries', icon: '🛒', color: '#84cc16' },
  { name: 'Other', icon: '📦', color: '#64748b' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#10b981' },
  { name: 'Freelance & Projects', icon: '💻', color: '#3b82f6' },
  { name: 'Investments & Dividends', icon: '📈', color: '#8b5cf6' },
  { name: 'Bonus & Awards', icon: '🎁', color: '#f59e0b' },
  { name: 'Rental Income', icon: '🏢', color: '#06b6d4' },
  { name: 'Refunds', icon: '🔄', color: '#14b8a6' },
  { name: 'Other Income', icon: '💵', color: '#64748b' },
];

export const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI / QR', icon: '⚡' },
  { id: 'Credit Card', name: 'Credit Card', icon: '💳' },
  { id: 'Debit Card', name: 'Debit Card', icon: '🏧' },
  { id: 'Net Banking', name: 'Net Banking', icon: '🏦' },
  { id: 'Cash', name: 'Cash', icon: '💵' },
  { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🔁' },
  { id: 'Other', name: 'Other Method', icon: '🏷️' },
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
];

export const EXPENSE_CATEGORIES = DEFAULT_EXPENSE_CATEGORIES.map(c => c.name);
export const INCOME_CATEGORIES = DEFAULT_INCOME_CATEGORIES.map(c => c.name);
