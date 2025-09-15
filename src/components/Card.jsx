import React, { useState } from 'react';
import styled from 'styled-components';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const CardContainer = styled.div`
  background: var(--surface);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $type }) => {
      switch ($type) {
        case 'income':
          return 'var(--success)';
        case 'expense':
          return 'var(--danger)';
        default:
          return 'var(--primary)';
      }
    }};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $type }) => {
    switch ($type) {
      case 'income':
        return 'var(--success)';
      case 'expense':
        return 'var(--danger)';
      default:
        return 'var(--primary)';
    }
  }};
  opacity: 0.2;
`;

const CardTitle = styled.h3`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.5rem;
`;

const CardTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ $trend }) => {
    if ($trend === 0) return 'var(--text-secondary)';
    return $trend > 0 ? 'var(--success)' : 'var(--danger)';
  }};
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: ${({ $trend }) => {
    if ($trend === 0) return 'transparent';
    return $trend > 0 
      ? 'var(--success-light-hover)' 
      : 'var(--danger-light-hover)';
  }};
  border-radius: var(--radius-sm);
  width: fit-content;
`;

const EditInput = styled.input`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ color }) => color};
  border: 1px solid var(--light);
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  width: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Card = ({ title, value, type, trend = 0, editable, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(value);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(parseFloat(editValue.replace(/[^0-9.-]+/g, '')));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <FaArrowUp size={18} />;
      case 'expense':
        return <FaArrowDown size={18} />;
      default:
        return <FaWallet size={18} />;
    }
  };

  return (
    <CardContainer $type={type}>
      <CardHeader>
        <IconWrapper $type={type}>
          {getIcon()}
        </IconWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardValue onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <EditInput
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            color={type}
          />
        ) : (
          value
        )}
      </CardValue>      <CardTrend $trend={trend}>
        {trend === 0 ? (
          '• No change'
        ) : (
          <>
            {trend > 0 ? '↗' : '↘'} {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </>
        )}
      </CardTrend>
    </CardContainer>
  );
};

export default Card;
