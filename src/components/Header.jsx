import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  
  span {
    font-weight: 300;
  }
`;

const Header = () => {
  return (
    <Container>
      <HeaderContent>
        <Title>Finance <span>Dashboard</span></Title>
      </HeaderContent>
    </Container>
  );
};

export default Header;
