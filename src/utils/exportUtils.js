export function formatCurrency(amount, currency = 'INR') {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function escapeCSV(text) {
  const str = String(text);
  if (/^[=+\-@]/.test(str)) {
    return `'${str}`;
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV(transactions, filename) {
  if (transactions.length === 0) return;

  const defaultFilename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  const finalFilename = filename || defaultFilename;

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      escapeCSV(t.name || t.description),
      t.category,
      t.type,
      Math.abs(t.amount).toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  link.click();
  URL.revokeObjectURL(url);
}

export function prepareForPrint() {
  window.print();
}
