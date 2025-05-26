import React from 'react';
import Dashboard from './pages/Dashboard';
import GlobalStyle from './styles/GlobalStyle';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <GlobalStyle />
      <Dashboard />
    </FinanceProvider>
  );
}

export default App;
