import React from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Card from '../components/Card';
import { FaChartLine } from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  background: var(--primary);
  padding: 2rem;
  border-radius: var(--radius-lg);
  color: var(--surface);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--surface);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);

  svg {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
`;

const Subtitle = styled.p`
  opacity: 0.9;
  font-size: 1rem;
  color: var(--surface);
`;

const MainContent = styled.div`
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: -4rem 0.5rem 2rem 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: -2rem 0 2rem 0;
  }
`;

const CategorySection = styled.div`
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  border: 1px solid var(--border);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CategoryTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${({ $type }) => $type === 'income' ? 'var(--success)' : 'var(--danger)'};
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const CategoryCard = styled.div`
  background: var(--background);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
    background: var(--surface);
  }
`;

const CategoryName = styled.span`
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const CategoryValue = styled.span`
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ $type }) => $type === 'income' ? 'var(--success)' : 'var(--danger)'};
`;

const Dashboard = () => {
  const {
    balance,
    getTotalIncome,
    getTotalExpenses,
    getCategoryTotals
  } = useFinance();

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const incomeCategoryTotals = getCategoryTotals('income');
  const expenseCategoryTotals = getCategoryTotals('expense');

  return (
    <DashboardContainer>
      <Header>
        <Title>
          <FaChartLine />
          Controle Financeiro
        </Title>
        <Subtitle>Gerencie suas finanças de forma eficiente</Subtitle>
      </Header>

      <Summary>
        <Card
          title="Saldo Atual"
          value={`R$ ${balance.toFixed(2)}`}
          type="balance"
        />
        <Card
          title="Receita Total"
          value={`R$ ${totalIncome.toFixed(2)}`}
          type="income"
        />
        <Card
          title="Despesa Total"
          value={`R$ ${totalExpenses.toFixed(2)}`}
          type="expense"
        />
      </Summary>

      <MainContent>
        <CategorySection>
          <CategoryTitle $type="income">
            <FaChartLine />
            Receitas por Categoria
          </CategoryTitle>
          <CategoryGrid>
            {incomeCategoryTotals.map(({ category, total }) => (
              <CategoryCard key={category}>
                <CategoryName>{category}</CategoryName>
                <CategoryValue $type="income">R$ {total.toFixed(2)}</CategoryValue>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategorySection>

        <CategorySection>
          <CategoryTitle $type="expense">
            <FaChartLine />
            Despesas por Categoria
          </CategoryTitle>
          <CategoryGrid>
            {expenseCategoryTotals.map(({ category, total }) => (
              <CategoryCard key={category}>
                <CategoryName>{category}</CategoryName>
                <CategoryValue $type="expense">R$ {total.toFixed(2)}</CategoryValue>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategorySection>

        <TransactionForm />
        <TransactionList />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
