import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import GlobalStyle from './styles/GlobalStyle';
import Dashboard from './pages/Dashboard';
import ThemeToggle from './components/ThemeToggle';

const ThemedApp = () => {
  const { mode } = useTheme();
  
  return (
    <StyledThemeProvider theme={{ mode }}>
      <GlobalStyle />
      <Dashboard />
      <ThemeToggle />
    </StyledThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <ThemedApp />
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
