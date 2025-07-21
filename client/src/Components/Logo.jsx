import React from 'react';
import ImageLogo from '@images/logo.jpg';
import styled from 'styled-components';

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
  object-fit: cover;
`;

const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const Logo = () => {
    return (
        <LogoWrapper>
            <LogoImage src={ImageLogo} alt="Logo" />
            <LogoText>SKC</LogoText>
        </LogoWrapper>
    );
};

export default Logo;
