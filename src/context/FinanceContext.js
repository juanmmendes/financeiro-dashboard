import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map(transaction => ({
        ...transaction,
        date: transaction.date || new Date().toISOString(),
        value: parseFloat(transaction.value) || 0,
        type: ['income', 'expense'].includes(transaction.type) ? transaction.type : 'expense',
        description: transaction.description || '',
        category: transaction.category || (transaction.type === 'income' ? 'Others' : 'Others'),
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  });

  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('balance');
      return saved ? parseFloat(saved) : 0;
    } catch (error) {
      console.error('Error loading balance:', error);
      return 0;
    }
  });

  const calculateBalance = useCallback(() => {
    try {
      const newBalance = transactions.reduce((acc, transaction) => {
        const value = parseFloat(transaction.value) || 0;
        return transaction.type === 'income' ? acc + value : acc - value;
      }, 0);
      setBalance(newBalance);
    } catch (error) {
      console.error('Erro ao calcular saldo:', error);
      setError('Falha ao calcular saldo');
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
      calculateBalance();
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      setError('Falha ao salvar transações');
    }
  }, [transactions, calculateBalance]);

  useEffect(() => {
    try {
      localStorage.setItem('balance', balance.toString());
    } catch (error) {
      console.error('Erro ao salvar saldo:', error);
      setError('Falha ao salvar saldo');
    }
  }, [balance]);

  const addTransaction = async (type, value, description, category) => {
    setError(null);
    setLoading(true);
    try {
      // Validate transaction type
      if (!['income', 'expense'].includes(type)) {
        throw new Error('Invalid transaction type');
      }

      // Validate and parse value
      const numericValue = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
      if (isNaN(numericValue) || numericValue <= 0) {
        throw new Error('Invalid transaction value');
      }

      // Validate description
      if (!description || description.trim().length === 0) {
        throw new Error('Description is required');
      }

      // Validate category
      const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      if (!category || !validCategories.includes(category)) {
        throw new Error('Invalid category');
      }

      const newTransaction = {
        id: Date.now(),
        type,
        value: numericValue,
        description: description.trim(),
        date: new Date().toISOString(),
        category,
      };

      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setError(null);
    setLoading(true);
    try {
      if (!id) throw new Error('Transaction ID is required');
      
      setTransactions(prev => {
        const transaction = prev.find(t => t.id === id);
        if (!transaction) throw new Error('Transaction not found');
        return prev.filter(t => t.id !== id);
      });
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = (newBalance) => {
    try {
      const value = parseFloat(newBalance);
      if (isNaN(value)) throw new Error('Invalid balance value');
      setBalance(value);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getTotalIncome = () => {
    try {
      return transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0);
    } catch (error) {
      console.error('Error calculating total income:', error);
      return 0;
    }
  };

  const getTotalExpenses = () => {
    try {
      return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0);
    } catch (error) {
      console.error('Error calculating total expenses:', error);
      return 0;
    }
  };

  const getFilteredTransactions = () => {
    if (selectedCategory === 'all') {
      return transactions;
    }
    return transactions.filter(t => t.category === selectedCategory);
  };
  const getCategoryTotals = (type) => {
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return categories.map(category => ({
      category,
      total: transactions
        .filter(t => t.type === type && t.category === category)
        .reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0)
    }));
  };  const getTimelineData = () => {
    const today = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    }).reverse();    const monthlyData = last12Months.map(monthYear => {
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) === monthYear;
      });

      return {
        month: monthYear,
        income: monthTransactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + parseFloat(t.value), 0),
        expense: monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + parseFloat(t.value), 0),
      };
    });

    return {
      labels: monthlyData.map(d => d.month),
      incomeData: monthlyData.map(d => d.income),
      expenseData: monthlyData.map(d => d.expense),
    };
  };

  const getTrends = () => {
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    
    const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= lastMonthDate);
    const previousMonthDate = new Date(lastMonthDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonthTransactions = transactions.filter(
      t => new Date(t.date) >= previousMonthDate && new Date(t.date) < lastMonthDate
    );

    const calculateTotal = (transactions, type) => 
      transactions
        .filter(t => t.type === type)
        .reduce((acc, t) => acc + (parseFloat(t.value) || 0), 0);

    const currentIncome = calculateTotal(currentMonthTransactions, 'income');
    const previousIncome = calculateTotal(previousMonthTransactions, 'income');
    const currentExpenses = calculateTotal(currentMonthTransactions, 'expense');
    const previousExpenses = calculateTotal(previousMonthTransactions, 'expense');

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    return {
      income: calculateTrend(currentIncome, previousIncome),
      expense: calculateTrend(currentExpenses, previousExpenses),
    };
  };

  return (
    <FinanceContext.Provider value={{
      transactions: getFilteredTransactions(),
      allTransactions: transactions,
      balance,
      error,
      loading,
      addTransaction,
      deleteTransaction,
      updateBalance,
      getTotalIncome,
      getTotalExpenses,
      selectedCategory,
      setSelectedCategory,
      incomeCategories: INCOME_CATEGORIES,
      expenseCategories: EXPENSE_CATEGORIES,      getCategoryTotals,
      getTrends,
      getTimelineData
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
