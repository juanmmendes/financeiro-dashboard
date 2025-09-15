import { useState, useMemo } from 'react';
import { PERIODS } from '../utils/constants';

export const useTransactionFilter = (transactions) => {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS.MONTH);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case PERIODS.WEEK:
        startDate.setDate(now.getDate() - 7);
        break;
      case PERIODS.MONTH:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case PERIODS.YEAR:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Desde o início
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesPeriod = transactionDate >= startDate;
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      
      return matchesPeriod && matchesCategory;
    });
  }, [transactions, selectedPeriod, selectedCategory]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedCategory,
    setSelectedCategory,
    filteredTransactions
  };
};
