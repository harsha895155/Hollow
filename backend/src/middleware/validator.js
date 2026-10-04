export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || !name.trim()) errors.name = 'Name is required.';
  if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required.';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = {};

  if (!email) errors.email = 'Email is required.';
  if (!password) errors.password = 'Password is required.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
}

export function validateExpense(req, res, next) {
  const { name, amount, category, date } = req.body;
  const errors = {};

  if (!name || !name.trim()) errors.name = 'Expense title/name is required.';
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) errors.amount = 'Amount must be a positive number.';
  if (!category || !category.trim()) errors.category = 'Category is required.';
  if (!date) errors.date = 'Date is required.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
}

export function validateIncome(req, res, next) {
  const { name, source, amount, date } = req.body;
  const title = name || source;
  const errors = {};

  if (!title || !title.trim()) errors.name = 'Income source/description is required.';
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) errors.amount = 'Amount must be a positive number.';
  if (!date) errors.date = 'Date is required.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
}

export function validateBudget(req, res, next) {
  const { category, monthlyLimit } = req.body;
  const errors = {};

  if (!category || !category.trim()) errors.category = 'Category is required.';
  const num = parseFloat(monthlyLimit);
  if (isNaN(num) || num <= 0) errors.monthlyLimit = 'Monthly limit must be a positive number.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
}
