import React from 'react';
import ImageLogo from '@images/logo.jpg';
import styled from 'styled-components';

const LogoImage = styled.img`
  width: 60px;   
  height: auto;  
  border-radius: 100px;
  object-fit: contain; 
  display: block;
`;


const Logo = () => {
  return <LogoImage src={ImageLogo} alt="Logo" />
};

export default Logo;
