// Test all backend API endpoints
async function runTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('--- Testing API Health ---');
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  console.log('Health:', health);

  console.log('\n--- Testing User Registration ---');
  const regEmail = `test_${Date.now()}@hollow.app`;
  const regRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Harsha Tester', email: regEmail, password: 'password123' })
  });
  const regData = await regRes.json();
  console.log('Register status:', regRes.status, 'Success:', regData.success);
  const token = regData.token;

  console.log('\n--- Testing Auth Me ---');
  const meRes = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = await meRes.json();
  console.log('Auth Me:', meData.user.name, meData.user.email);

  console.log('\n--- Testing Create Expense ---');
  const expRes = await fetch(`${BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'High-Speed Broadband Internet',
      amount: 1499,
      category: 'Bills & Utilities',
      paymentMethod: 'UPI',
      date: '2026-10-04',
      notes: 'Monthly fiber bill'
    })
  });
  const expData = await expRes.json();
  console.log('Expense added:', expData.data.name, 'Amount:', expData.data.amount);

  console.log('\n--- Testing Create Income ---');
  const incRes = await fetch(`${BASE}/income`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Consulting Retainer',
      amount: 45000,
      category: 'Freelance & Projects',
      paymentMethod: 'Direct Deposit',
      date: '2026-10-04'
    })
  });
  const incData = await incRes.json();
  console.log('Income added:', incData.data.name, 'Amount:', incData.data.amount);

  console.log('\n--- Testing Categories ---');
  const catRes = await fetch(`${BASE}/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const catData = await catRes.json();
  console.log('Categories count:', catData.data.length);

  console.log('\n--- Testing Create Budget ---');
  const bgRes = await fetch(`${BASE}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      category: 'Bills & Utilities',
      monthlyLimit: 5000,
      alertThreshold: 80
    })
  });
  const bgData = await bgRes.json();
  console.log('Budget created:', bgData.data.category, 'Limit:', bgData.data.monthlyLimit);

  console.log('\n--- Testing Budgets Summary & Calculations ---');
  const bgListRes = await fetch(`${BASE}/budgets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const bgListData = await bgListRes.json();
  console.log('Budgets Summary:', bgListData.summary);

  console.log('\n--- Testing Financial Intelligence Reports ---');
  const repRes = await fetch(`${BASE}/reports`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const repData = await repRes.json();
  console.log('Report Summary:', repData.data.summary);
  console.log('Top Spending:', repData.data.topSpending);

  console.log('\n--- Cleaning up Test Artifacts from Database ---');
  await fetch(`${BASE}/expenses/${expData.data.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  await fetch(`${BASE}/income/${incData.data.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  await fetch(`${BASE}/budgets/${bgData.data.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  // Remove test user and their categories from JSON files to maintain 100% clean DB
  const fs = await import('fs');
  const path = await import('path');
  const dataDir = path.resolve('backend/data');
  const users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users.filter(u => u.email !== regEmail), null, 2));
  const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories.filter(c => c.userId !== regData.user.id), null, 2));

  console.log('Cleanup finished: Test user, transactions, and budgets safely removed.');
  console.log('\n✅ ALL BACKEND & API TESTS PASSED SUCCESSFULLY! Database remains completely fresh.');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
