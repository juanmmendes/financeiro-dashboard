import React, { useState } from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import { FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';

const FormContainer = styled.div`
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  border: 1px solid var(--border);
`;

const FormTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: var(--primary);
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const TypeButton = styled.button`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ $active, $transactionType }) => 
    $active 
      ? $transactionType === 'income' 
        ? 'var(--success)' 
        : 'var(--danger)'
      : 'var(--background)'};
  color: ${({ $active }) => 
    $active ? 'var(--surface)' : 'var(--text-secondary)'};
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid var(--border);

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    background: ${({ $transactionType }) =>
      $transactionType === 'income' ? 'var(--success-hover)' : 'var(--danger-hover)'};
    color: var(--surface);
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--background);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.mode === 'dark' ? 'rgba(156, 136, 255, 0.2)' : 'rgba(108, 92, 231, 0.2)'};
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--background);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.mode === 'dark' ? 'rgba(156, 136, 255, 0.2)' : 'rgba(108, 92, 231, 0.2)'};
  }

  option {
    background: var(--surface);
    color: var(--text-primary);
  }
`;

const SubmitButton = styled.button`
  background: var(--primary);
  color: var(--surface);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  width: 100%;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--text-secondary);
    transform: none;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠';
  }
`;

const TransactionForm = () => {
  const { addTransaction, error: contextError, loading, incomeCategories, expenseCategories } = useFinance();
  const [type, setType] = useState('expense');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await addTransaction(type, value, description, category);
      setValue('');
      setDescription('');
      setCategory('');
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <FormContainer>
      <FormTitle>
        <FaMoneyBillWave />
        Nova Transação
      </FormTitle>
      <Form onSubmit={handleSubmit}>
        <TypeSelector>
          <TypeButton
            type="button"
            $transactionType="expense"
            $active={type === 'expense'}
            onClick={() => setType('expense')}
          >
            <FaShoppingCart />
            Despesa
          </TypeButton>
          <TypeButton
            type="button"
            $transactionType="income"
            $active={type === 'income'}
            onClick={() => setType('income')}
          >
            <FaMoneyBillWave />
            Receita
          </TypeButton>
        </TypeSelector>

        <InputGroup>
          <FieldGroup>
            <Label>Valor</Label>
            <Input
              type="number"
              placeholder="Digite o valor"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Categoria</Label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FieldGroup>
        </InputGroup>

        <FieldGroup>
          <Label>Descrição</Label>
          <Input
            type="text"
            placeholder="Digite a descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FieldGroup>

        {(error || contextError) && (
          <ErrorMessage>{error || contextError}</ErrorMessage>
        )}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Transação'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default TransactionForm;
