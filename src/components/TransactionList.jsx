import React from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import { FaList, FaTrash, FaTags } from 'react-icons/fa';

const ListContainer = styled.div`
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  border: 1px solid var(--border);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ListTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: var(--primary);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  background: var(--background);
  color: var(--text-primary);
  appearance: none;
  background-image: ${({ theme }) => `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
    theme.mode === 'dark' ? '%23A0A0B2' : '%23636E72'
  }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`};
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px ${({ theme }) => 
      theme.mode === 'dark' 
        ? 'rgba(156, 136, 255, 0.2)' 
        : 'rgba(108, 92, 231, 0.2)'};
  }

  option {
    background: var(--surface);
    color: var(--text-primary);
  }
`;

const TransactionGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--background);
  border: 1px solid var(--border);
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Description = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const Category = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Value = styled.span`
  font-weight: 600;
  color: ${({ $type }) => ($type === 'income' ? 'var(--success)' : 'var(--danger)')};
  background: ${({ $type, theme }) => 
    $type === 'income'
      ? theme.mode === 'dark' 
        ? 'rgba(0, 209, 167, 0.1)' 
        : 'rgba(0, 184, 148, 0.1)'
      : theme.mode === 'dark'
        ? 'rgba(255, 139, 139, 0.1)'
        : 'rgba(255, 118, 117, 0.1)'};
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
`;

const Date = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  color: var(--danger);
  opacity: 0.7;
  transition: all 0.2s ease;
  border-radius: var(--radius-sm);

  &:hover {
    opacity: 1;
    background: ${({ theme }) => 
      theme.mode === 'dark' 
        ? 'rgba(255, 139, 139, 0.1)' 
        : 'rgba(255, 118, 117, 0.1)'};
    transform: scale(1.1);
  }
`;

const NoTransactions = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  background: var(--background);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  font-size: 0.9rem;

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const TransactionList = () => {
  const {
    transactions,
    deleteTransaction,
    selectedCategory,
    setSelectedCategory,
    incomeCategories,
    expenseCategories,
  } = useFinance();

  const allCategories = ['all', ...new Set([...incomeCategories, ...expenseCategories])];

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>
          <FaList />
          Transações
        </ListTitle>
        <FilterSelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'Todas as Categorias' : category}
            </option>
          ))}
        </FilterSelect>
      </ListHeader>

      {transactions.length === 0 ? (
        <NoTransactions>
          <FaList />
          <p>Nenhuma transação encontrada</p>
        </NoTransactions>
      ) : (
        <TransactionGrid>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <TransactionInfo>
                <Description>{transaction.description}</Description>
                <Category>
                  <FaTags size={12} />
                  {transaction.category}
                </Category>
              </TransactionInfo>
              <Value $type={transaction.type}>
                {transaction.type === 'expense' ? '-' : '+'}R$ {transaction.value.toFixed(2)}
              </Value>
              <Date>{formatDate(transaction.date)}</Date>
              <DeleteButton onClick={() => handleDelete(transaction.id)}>
                <FaTrash />
              </DeleteButton>
            </TransactionItem>
          ))}
        </TransactionGrid>
      )}
    </ListContainer>
  );
};

export default TransactionList;
