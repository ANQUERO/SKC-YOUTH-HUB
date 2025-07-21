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


const Logo = () => {
  return (
    <LogoWrapper>
      <LogoImage src={ImageLogo} alt="Logo" />
    </LogoWrapper>
  );
};

export default Logo;
