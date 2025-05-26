import React from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import { FaList, FaTrash, FaTags } from 'react-icons/fa';

const ListContainer = styled.div`
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ListTitle = styled.h3`
  color: var(--dark);
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
  border: 2px solid var(--light);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  background: var(--lighter);
  color: var(--dark);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: var(--primary);
    background-color: var(--white);
    box-shadow: 0 0 0 4px var(--primary-light);
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
  background: var(--lighter);
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background: white;
    box-shadow: var(--shadow-sm);
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Description = styled.span`
  color: var(--dark);
  font-weight: 500;
`;

const Category = styled.span`
  color: var(--gray);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Value = styled.span`
  font-weight: 600;
  color: ${({ $type }) => ($type === 'income' ? 'var(--success)' : 'var(--danger)')};
  background: ${({ $type }) => ($type === 'income' ? 'var(--success-light)' : 'var(--danger-light)')};
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
`;

const Date = styled.span`
  color: var(--gray);
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
    background: var(--danger-light);
    transform: scale(1.1);
  }
`;

const NoTransactions = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray);
  background: var(--lighter);
  border-radius: var(--radius-md);
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
