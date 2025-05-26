import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #6C5CE7;
    --primary-light: #A8A4E9;
    --success: #00B894;
    --success-light: #55EFC4;
    --danger: #FF7675;
    --danger-light: #FAB1A0;
    --dark: #2D3436;
    --gray: #636E72;
    --light: #DFE6E9;
    --lighter: #F5F6FA;
    --white: #FFFFFF;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --gradient-primary: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    --gradient-success: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
    --gradient-danger: linear-gradient(135deg, var(--danger) 0%, var(--danger-light) 100%);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--lighter);
    color: var(--dark);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
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
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--lighter);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: 4px;
    
    &:hover {
      background: var(--primary);
    }
  }
`;

export default GlobalStyle;
