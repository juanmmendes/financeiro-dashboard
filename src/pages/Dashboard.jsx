import React from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Card from '../components/Card';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { PERIODS, CHART_COLORS, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { useTransactionFilter } from '../hooks/useTransactionFilter';

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

const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  background: var(--surface);
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
`;

const PeriodButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${({ $active }) => $active ? 'var(--primary)' : 'var(--background)'};
  color: ${({ $active }) => $active ? 'var(--surface)' : 'var(--text-primary)'};
  border: 1px solid ${({ $active }) => $active ? 'var(--primary)' : 'var(--border)'};

  &:hover {
    background: ${({ $active }) => $active ? 'var(--primary-hover)' : 'var(--surface)'};
    transform: translateY(-2px);
  }

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Dashboard = () => {  const {
    balance,
    getTrends,
    getTimelineData,
    transactions
  } = useFinance();
  
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedCategory,
    setSelectedCategory,
    filteredTransactions
  } = useTransactionFilter(transactions);  // Usar filteredTransactions para calcular totais do período selecionado
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.value), 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.value), 0);

  // Calcular totais por categoria usando as transações filtradas
  const getCategoryTotalsForPeriod = (type) => {
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return categories.map(category => ({
      category,
      total: filteredTransactions
        .filter(t => t.type === type && t.category === category)
        .reduce((acc, t) => acc + parseFloat(t.value), 0)
    }));
  };

  const incomeCategoryTotals = getCategoryTotalsForPeriod('income');
  const expenseCategoryTotals = getCategoryTotalsForPeriod('expense');
  const trends = getTrends();
  const timelineData = getTimelineData();

  const lineChartData = {
    labels: timelineData.labels,
    datasets: [
      {
        label: 'Receitas',
        data: timelineData.incomeData,
        borderColor: CHART_COLORS.income.border,
        backgroundColor: CHART_COLORS.income.base,
        tension: 0.3,
      },
      {
        label: 'Despesas',
        data: timelineData.expenseData,
        borderColor: CHART_COLORS.expense.border,
        backgroundColor: CHART_COLORS.expense.base,
        tension: 0.3,
      }
    ]
  };

  const chartData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [
          'rgba(0, 184, 148, 0.8)',  // Verde suave para receitas
          'rgba(255, 118, 117, 0.8)', // Vermelho suave para despesas
        ],
        borderColor: [
          'rgba(0, 184, 148, 1)',     // Borda mais escura para receitas
          'rgba(255, 118, 117, 1)',   // Borda mais escura para despesas
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(0, 184, 148, 0.9)',
          'rgba(255, 118, 117, 0.9)',
        ],
        hoverBorderColor: [
          'rgba(0, 184, 148, 1)',
          'rgba(255, 118, 117, 1)',
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>
          <FaChartLine />
          Controle Financeiro
        </Title>
        <Subtitle>Gerencie suas finanças de forma eficiente</Subtitle>
      </Header>      <Summary>
        <Card
          title="Saldo Atual"
          value={`R$ ${balance.toFixed(2)}`}
          type="balance"
        />
        <Card
          title="Receita Total"
          value={`R$ ${totalIncome.toFixed(2)}`}
          type="income"
          trend={trends.income}
        />
        <Card
          title="Despesa Total"
          value={`R$ ${totalExpenses.toFixed(2)}`}
          type="expense"
          trend={trends.expense}
        />
      </Summary>      <PeriodSelector>
        <FaCalendarAlt />
        {Object.entries(PERIODS).map(([key, value]) => (
          <PeriodButton
            key={value}
            $active={selectedPeriod === value}
            onClick={() => setSelectedPeriod(value)}
          >
            {key === 'WEEK' && 'Última Semana'}
            {key === 'MONTH' && 'Último Mês'}
            {key === 'YEAR' && 'Último Ano'}
            {key === 'ALL' && 'Todo Período'}
          </PeriodButton>
        ))}

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--text-primary)',
            marginLeft: 'auto'
          }}
        >
          <option value="all">Todas as Categorias</option>
          <optgroup label="Receitas">
            {INCOME_CATEGORIES.map(cat => (
              <option key={`income-${cat}`} value={cat}>{cat}</option>
            ))}
          </optgroup>
          <optgroup label="Despesas">
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={`expense-${cat}`} value={cat}>{cat}</option>
            ))}
          </optgroup>
        </select>
      </PeriodSelector>

      <PieChart
        data={chartData}
        title="Distribuição de Receitas e Despesas"
      />

      <LineChart
        data={lineChartData}
        title="Evolução de Receitas e Despesas"
      />

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
            ))}        </CategoryGrid>
        </CategorySection>

        <TransactionForm />
        <TransactionList />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
