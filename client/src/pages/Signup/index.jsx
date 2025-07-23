import React, { useState } from 'react'
import styled from 'styled-components'
import { Stepper, Step, StepLabel, Box, Button } from '@mui/material'
import PersonalDetails from './profile.jsx'
import DemographicsFile from './demoFile.jsx'
import Credentials from './credentials.jsx'

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f8f8f8;
`

const MainContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`

const steps = ['Account Info', 'Personal Details', 'Confirmation']

const Signup = () => {
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1)
        } else {
            alert('Form submitted!')
        }
    }

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0))
    }

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <PersonalDetails />
            case 1:
                return <DemographicsFile />
            case 2:
                return <Credentials />
            default:
                return null
        }
    }

    return (
        <Wrapper>
            <MainContainer>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                    {renderStepContent(activeStep)}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '2rem',
                            gap: 2,
                        }}
                    >
                        <Button
                            disabled={activeStep === 0}
                            variant="outlined"
                            onClick={handleBack}
                            fullWidth={true}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            fullWidth={true}
                        >
                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            </MainContainer>
        </Wrapper>
    )
}

export default Signup
