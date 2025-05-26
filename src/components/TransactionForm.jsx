import React, { useState } from 'react';
import styled from 'styled-components';
import { useFinance } from '../context/FinanceContext';
import { FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';

const FormContainer = styled.div`
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
`;

const FormTitle = styled.h3`
  color: var(--dark);
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
        ? 'var(--success-light)' 
        : 'var(--danger-light)'
      : 'var(--lighter)'};
  color: ${({ $active, $transactionType }) => 
    $active 
      ? $transactionType === 'income' 
        ? 'var(--success)' 
        : 'var(--danger)'
      : 'var(--gray)'};
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.2s ease;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    background: ${({ $transactionType }) =>
      $transactionType === 'income' ? 'var(--success-light)' : 'var(--danger-light)'};
    color: ${({ $transactionType }) =>
      $transactionType === 'income' ? 'var(--success)' : 'var(--danger)'};
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
  color: var(--gray);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid var(--light);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--lighter);
  
  &:focus {
    border-color: var(--primary);
    background: var(--white);
    box-shadow: 0 0 0 4px var(--primary-light);
  }

  &::placeholder {
    color: var(--gray);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid var(--light);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--lighter);
  color: var(--dark);
  
  &:focus {
    border-color: var(--primary);
    background: var(--white);
    box-shadow: 0 0 0 4px var(--primary-light);
  }
`;

const SubmitButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  width: 100%;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--light);
    transform: none;
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
