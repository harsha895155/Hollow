export function filterTransactions(transactions, filters) {
  let filtered = [...transactions];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.dateRange?.start) {
    filtered = filtered.filter(t => t.date >= filters.dateRange.start);
  }

  if (filters.dateRange?.end) {
    filtered = filtered.filter(t => t.date <= filters.dateRange.end);
  }

  if (filters.category) {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(t => 
      t.name?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function sortTransactions(transactions, field, order = 'desc') {
  const sorted = [...transactions];
  
  sorted.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];

    if (field === 'amount') {
      aVal = Math.abs(aVal);
      bVal = Math.abs(bVal);
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

export function validateTransaction(transaction) {
  const errors = {};

  if (!transaction.date) {
    errors.date = 'Date is required';
  }

  if (!transaction.name || transaction.name.trim() === '') {
    errors.name = 'Description is required';
  } else if (transaction.name.length > 200) {
    errors.name = 'Description must be 200 characters or less';
  }

  if (!transaction.amount || transaction.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!transaction.category) {
    errors.category = 'Category is required';
  }

  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.type = 'Type must be income or expense';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
