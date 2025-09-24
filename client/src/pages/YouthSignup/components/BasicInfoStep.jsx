import React from 'react';
import styled from 'styled-components';
import style from '@styles/signup.module.scss'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.isMobile ? '1rem' : '1.5rem'} ${props => props.isMobile ? '1rem' : '2rem'};
  display: flex;
  flex-direction: column;
  min-height: 60vh;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: ${props => props.isMobile ? '2rem' : '3rem'};
  padding: 0 ${props => props.isMobile ? '0.5rem' : '0'};
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.isMobile ? '1rem' : '1.5rem'};
  flex: 1;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormRow = styled.div`
  display: contents;
`;

const FormField = styled.div`
  &:nth-child(1),
  &:nth-child(2) {
    @media (min-width: 600px) {
      grid-column: span 1;
    }
  }

  &:nth-child(3) {
    @media (min-width: 600px) {
      grid-column: 1 / span 2;
    }
    
    @media (min-width: 900px) {
      grid-column: 1 / span 2;
    }
  }

  &:nth-child(4) {
    @media (min-width: 600px) {
      grid-column: 1 / span 2;
    }
    
    @media (min-width: 900px) {
      grid-column: 3 / span 1;
    }
  }
`;

const StyledTextField = styled.input`
  width: 100%;
  padding: ${props => props.isMobile ? '0.75rem' : '1rem'};
  border: 1px solid ${props => props.error ? '#d32f2f' : '#ccc'};
  border-radius: 8px;
  font-size: ${props => props.isMobile ? '0.875rem' : '1rem'};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }

  &::placeholder {
    color: #999;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: ${props => props.isMobile ? '0.875rem' : '1rem'};
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #d32f2f;
    }
  `}
`;

const ErrorText = styled.span`
  display: block;
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
`;

const GenderSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: ${props => props.isMobile ? '2rem' : '3rem'};
  padding-bottom: ${props => props.isMobile ? '0.5rem' : '1rem'};
`;

const GenderContainer = styled.div`
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const GenderLabel = styled.legend`
  font-weight: 600;
  color: #333;
  font-size: ${props => props.isMobile ? '0.875rem' : '1rem'};
  margin-bottom: 1rem;
  display: block;
  
  &::after {
    content: ' *';
    color: #d32f2f;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${props => props.isMobile ? '0.5rem' : '1rem'};
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  justify-content: center;
  align-items: center;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${props => props.isMobile ? '0.875rem' : '1rem'};
  margin-right: ${props => props.isMobile ? '0' : '1.5rem'};
  
  &:last-child {
    margin-right: 0;
  }
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  
  &:checked {
    accent-color: #1976d2;
  }
`;

const GenderError = styled.span`
  display: block;
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const BasicInfoStep = ({ formData, errors, onChange }) => {
    const isMobile = window.innerWidth < 600;
    const isTablet = window.innerWidth < 900;

    const handleChange = (field, value) => {
        onChange(field, value);
    };

    return (
        <Container isMobile={isMobile}>

            {/* Header Section */}
            <HeaderSection isMobile={isMobile}>
                <h1 className={style.title}>
                    Basic Information
                </h1>
                <h3 className={style.subtitle}>
                    Please provide your basic personal information.
                </h3>
            </HeaderSection>

            {/* Form Fields - Takes available space */}
            <FormContainer>
                <FormGrid isMobile={isMobile}>
                    <FormRow>
                        {/* First Name */}
                        <FormField>
                            <Label htmlFor="first_name" required isMobile={isMobile}>
                                First Name
                            </Label>
                            <StyledTextField
                                id="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => handleChange('first_name', e.target.value)}
                                error={!!errors.first_name}
                                isMobile={isMobile}
                                placeholder="Enter your first name"
                            />
                            {errors.first_name && <ErrorText>{errors.first_name}</ErrorText>}
                        </FormField>

                        {/* Middle Name */}
                        <FormField>
                            <Label htmlFor="middle_name" isMobile={isMobile}>
                                Middle Name
                            </Label>
                            <StyledTextField
                                id="middle_name"
                                type="text"
                                value={formData.middle_name}
                                onChange={(e) => handleChange('middle_name', e.target.value)}
                                isMobile={isMobile}
                                placeholder="Enter your middle name"
                            />
                        </FormField>

                        {/* Last Name */}
                        <FormField>
                            <Label htmlFor="last_name" required isMobile={isMobile}>
                                Last Name
                            </Label>
                            <StyledTextField
                                id="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => handleChange('last_name', e.target.value)}
                                error={!!errors.last_name}
                                isMobile={isMobile}
                                placeholder="Enter your last name"
                            />
                            {errors.last_name && <ErrorText>{errors.last_name}</ErrorText>}
                        </FormField>

                        {/* Suffix */}
                        <FormField>
                            <Label htmlFor="suffix" isMobile={isMobile}>
                                Suffix (Jr., Sr., III, etc.)
                            </Label>
                            <StyledTextField
                                id="suffix"
                                type="text"
                                value={formData.suffix}
                                onChange={(e) => handleChange('suffix', e.target.value)}
                                isMobile={isMobile}
                                placeholder="e.g., Jr., Sr., III"
                            />
                        </FormField>
                    </FormRow>
                </FormGrid>

                {/* Gender Section - Centered at bottom */}
                <GenderSection isMobile={isMobile}>
                    <GenderContainer>
                        <GenderLabel as="div" isMobile={isMobile}>
                            Gender
                        </GenderLabel>
                        <RadioGroup isMobile={isMobile}>
                            <RadioOption isMobile={isMobile}>
                                <RadioInput
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                />
                                Male
                            </RadioOption>
                            <RadioOption isMobile={isMobile}>
                                <RadioInput
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                />
                                Female
                            </RadioOption>
                        </RadioGroup>
                        {errors.gender && <GenderError>{errors.gender}</GenderError>}
                    </GenderContainer>
                </GenderSection>
            </FormContainer>
        </Container>
    );
};

export default BasicInfoStep;