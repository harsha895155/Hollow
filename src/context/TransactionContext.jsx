import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/categories';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('hollow_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem('hollow_categories');
      if (stored) return JSON.parse(stored);
      const combined = [
        ...DEFAULT_EXPENSE_CATEGORIES.map(c => ({ ...c, type: 'expense', id: 'cat_' + c.name })),
        ...DEFAULT_INCOME_CATEGORIES.map(c => ({ ...c, type: 'income', id: 'cat_' + c.name })),
      ];
      localStorage.setItem('hollow_categories', JSON.stringify(combined));
      return combined;
    } catch {
      return [];
    }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const stored = localStorage.getItem('hollow_budgets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hollow_transactions', JSON.stringify(transactions));
    } catch (err) {
      console.debug('Storage sync note:', err);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('hollow_categories', JSON.stringify(categories));
    } catch (err) {
      console.debug('Storage sync note:', err);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('hollow_budgets', JSON.stringify(budgets));
    } catch (err) {
      console.debug('Storage sync note:', err);
    }
  }, [budgets]);

  // Sync or reset state per active user session
  useEffect(() => {
    let isMounted = true;

    async function syncUserSession() {
      if (!user || user.isGuest) {
        if (isMounted) {
          setTransactions([]);
          setBudgets([]);
        }
        return;
      }

      try {
        const online = await api.isOnline();
        if (online && isMounted) {
          const [remoteExpenses, remoteIncome, remoteCats, remoteBudgets] = await Promise.all([
            api.transactions.getAll({ type: 'expense' }),
            api.transactions.getAll({ type: 'income' }),
            api.categories.getAll(),
            api.budgets.getAll(),
          ]);

          const combined = [...(remoteIncome || []), ...(remoteExpenses || [])];
          if (isMounted) {
            setTransactions(combined);
            if (remoteCats && remoteCats.length > 0) setCategories(remoteCats);
            setBudgets(remoteBudgets || []);
          }
        }
      } catch (err) {
        console.debug('Local persistence active:', err.message);
      }
    }

    syncUserSession();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ── Transactions CRUD ──
  const addTransaction = async (data) => {
    const item = await api.transactions.create(data);
    setTransactions(prev => [item, ...prev]);
    return item;
  };

  const updateTransaction = async (id, updates) => {
    const updated = await api.transactions.update(id, updates);
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates, ...updated } : t)));
    return updated;
  };

  const deleteTransaction = async (id, type = 'expense') => {
    await api.transactions.delete(id, type);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // ── Categories CRUD ──
  const addCategory = async (catData) => {
    const newCat = await api.categories.create(catData);
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = async (id) => {
    await api.categories.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // ── Budgets CRUD ──
  const addBudget = async (budgetData) => {
    const newBudget = await api.budgets.create(budgetData);
    setBudgets(prev => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = async (id, updates) => {
    const updated = await api.budgets.update(id, updates);
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, ...updates, ...updated } : b)));
    return updated;
  };

  const deleteBudget = async (id) => {
    await api.budgets.delete(id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Wipe / Import
  const wipeAllData = () => {
    setTransactions([]);
    setBudgets([]);
    localStorage.removeItem('hollow_transactions');
    localStorage.removeItem('hollow_budgets');
  };

  const importData = (data) => {
    if (data.transactions) setTransactions(data.transactions);
    if (data.categories) setCategories(data.categories);
    if (data.budgets) setBudgets(data.budgets);
  };

  // ── Financial Calculations & Metrics ──
  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthExpense = 0;
    let currentMonthIncome = 0;

    const categoryExpenseMap = {};
    const categoryIncomeMap = {};

    transactions.forEach(t => {
      const amount = Math.abs(Number(t.amount) || 0);
      const isCurrentMonth = t.date ? t.date.startsWith(currentMonthKey) : false;

      if (t.type === 'income') {
        totalIncome += amount;
        if (isCurrentMonth) currentMonthIncome += amount;
        categoryIncomeMap[t.category] = (categoryIncomeMap[t.category] || 0) + amount;
      } else {
        totalExpense += amount;
        if (isCurrentMonth) currentMonthExpense += amount;
        categoryExpenseMap[t.category] = (categoryExpenseMap[t.category] || 0) + amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;
    const currentMonthSavings = currentMonthIncome - currentMonthExpense;

    // Category distribution for charts
    const categoryChartData = Object.entries(categoryExpenseMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topCategory = categoryChartData[0]?.name || 'None';

    // Budgets progress
    const budgetsWithProgress = budgets.map(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category?.toLowerCase() === b.category?.toLowerCase())
        .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

      const limit = Number(b.monthlyLimit) || 1;
      const remaining = limit - spent;
      const percentageUsed = Number(((spent / limit) * 100).toFixed(1));
      const isExceeded = spent > limit;
      const isNearLimit = !isExceeded && percentageUsed >= (b.alertThreshold || 80);

      return {
        ...b,
        spent,
        remaining,
        percentageUsed,
        isExceeded,
        isNearLimit,
      };
    });

    const exceededBudgetsCount = budgetsWithProgress.filter(b => b.isExceeded).length;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      currentMonthExpense,
      currentMonthIncome,
      currentMonthSavings,
      savingsRate,
      categoryChartData,
      topCategory,
      budgetsWithProgress,
      exceededBudgetsCount,
      totalTransactions: transactions.length,
    };
  }, [transactions, budgets]);

  const value = {
    transactions,
    categories,
    budgets,
    metrics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    wipeAllData,
    importData,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
