import { useState, useEffect } from 'react';
import { Trade } from '../types';
import { allTrades as initialTransactions } from '../data/transactionData';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Trade[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('falcon_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem('falcon_transactions', JSON.stringify(initialTransactions));
    }
  }, []);

  const saveToStorage = (data: Trade[]) => {
    localStorage.setItem('falcon_transactions', JSON.stringify(data));
    setTransactions(data);
  };

  const createTransaction = (transaction: Omit<Trade, 'trade_id'>) => {
    const newId = `TXN-${Date.now()}`;
    const newTransaction: Trade = {
      ...transaction,
      trade_id: newId,
    };
    const updated = [newTransaction, ...transactions];
    saveToStorage(updated);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Trade>) => {
    const updated = transactions.map(txn =>
      txn.trade_id === id ? { ...txn, ...updates } : txn
    );
    saveToStorage(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(txn => txn.trade_id !== id);
    saveToStorage(updated);
  };

  const getTransaction = (id: string) => {
    return transactions.find(txn => txn.trade_id === id);
  };

  return {
    transactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
  };
}
