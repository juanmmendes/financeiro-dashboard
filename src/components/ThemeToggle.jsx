import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: var(--primary);
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--border);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: var(--primary);
    color: var(--surface);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <ThemeButton onClick={toggleTheme} aria-label="Alternar tema">
      {mode === 'light' ? <FaMoon /> : <FaSun />}
    </ThemeButton>
  );
};

export default ThemeToggle;
