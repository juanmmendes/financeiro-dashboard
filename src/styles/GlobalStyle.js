import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Tema Claro */
    --primary-light: #6C5CE7;
    --primary-light-hover: #5A4BD1;
    --success-light: #00B894;
    --success-light-hover: #00A187;
    --danger-light: #FF7675;
    --danger-light-hover: #FF6B6A;
    --background-light: #F5F6FA;
    --surface-light: #FFFFFF;
    --text-primary-light: #2D3436;
    --text-secondary-light: #636E72;
    --border-light: #DFE6E9;

    /* Tema Escuro */
    --primary-dark: #9C88FF;
    --primary-dark-hover: #8A77FF;
    --success-dark: #00D1A7;
    --success-dark-hover: #00BFA0;
    --danger-dark: #FF8B8B;
    --danger-dark-hover: #FF7A7A;
    --background-dark: #1E1E2E;
    --surface-dark: #2D2D3F;
    --text-primary-dark: #FFFFFF;
    --text-secondary-dark: #A0A0B2;
    --border-dark: #40405C;

    /* Valores compartilhados */
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 16px rgba(0,0,0,0.1);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    
    /* Variáveis dinâmicas baseadas no tema */
    --primary: ${({ theme }) => theme.mode === 'dark' ? 'var(--primary-dark)' : 'var(--primary-light)'};
    --primary-hover: ${({ theme }) => theme.mode === 'dark' ? 'var(--primary-dark-hover)' : 'var(--primary-light-hover)'};
    --success: ${({ theme }) => theme.mode === 'dark' ? 'var(--success-dark)' : 'var(--success-light)'};
    --success-hover: ${({ theme }) => theme.mode === 'dark' ? 'var(--success-dark-hover)' : 'var(--success-light-hover)'};
    --danger: ${({ theme }) => theme.mode === 'dark' ? 'var(--danger-dark)' : 'var(--danger-light)'};
    --danger-hover: ${({ theme }) => theme.mode === 'dark' ? 'var(--danger-dark-hover)' : 'var(--danger-light-hover)'};
    --background: ${({ theme }) => theme.mode === 'dark' ? 'var(--background-dark)' : 'var(--background-light)'};
    --surface: ${({ theme }) => theme.mode === 'dark' ? 'var(--surface-dark)' : 'var(--surface-light)'};
    --text-primary: ${({ theme }) => theme.mode === 'dark' ? 'var(--text-primary-dark)' : 'var(--text-primary-light)'};
    --text-secondary: ${({ theme }) => theme.mode === 'dark' ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)'};
    --border: ${({ theme }) => theme.mode === 'dark' ? 'var(--border-dark)' : 'var(--border-light)'};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.3s ease;
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-size: 1rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease-in-out;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  input, select {
    font-family: 'Inter', sans-serif;
    border: none;
    outline: none;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
    background: var(--background);
    color: var(--text-primary);
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
    
    &:hover {
      background: var(--primary-hover);
    }
  }
`;

export default GlobalStyle;
