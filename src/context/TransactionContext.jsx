import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { filterTransactions } from '../utils/dataProcessing';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [categories, setCategories] = useLocalStorage('categories', [
    ...EXPENSE_CATEGORIES,
    ...INCOME_CATEGORIES
  ]);

  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getTransactionById = (id) => {
    return transactions.find(t => t.id === id);
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    filterTransactions: (filters) => filterTransactions(transactions, filters),
    categories,
    updateCategories
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
}
