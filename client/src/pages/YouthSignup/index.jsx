import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Container
} from '@mui/material';
import {
    Person,
    LocationOn,
    School,
    HowToVote,
    Event,
    Home
} from '@mui/icons-material';

// Import step components
import BasicInfoStep from './components/BasicInfoStep';
import LocationStep from './components/LocationStep';
import CombinedDetailsStep from './components/CombinedDetailsStep';
import VerificationStep from './components/VerificationStep';

// Import hooks
import useYouthSignup from '@hooks/useYouthSignup';
import usePurok from '@hooks/usePurok';

const steps = [
    { label: 'Basic Info', icon: <Person /> },
    { label: 'Location', icon: <LocationOn /> },
    { label: 'Details', icon: <School /> },
    { label: 'Verification', icon: <Person /> }
];

const YouthSignup = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Info (Step 1)
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        gender: '',

        // Location (Step 2 - auto-filled)
        region: 'Region VII',
        province: 'Cebu',
        municipality: 'Cordova',
        barangay: 'Catarman ',
        purok_id: '',

        // Demographics, Survey, Meeting, Household (Step 3)
        civil_status: '',
        youth_age_gap: '',
        youth_classification: '',
        educational_background: '',
        work_status: '',
        registered_voter: '',
        registered_national_voter: '',
        vote_last_election: '',
        attended: '',
        times_attended: '',
        reason_not_attend: '',
        household: '',

        // Verification (Step 4)
        email: '',
        password: '',
        confirmPassword: '',
        attachment: null
    });

    const [errors, setErrors] = useState({});
    const [isVerified, setIsVerified] = useState(false);

    const { signup, loading, error, success } = useYouthSignup();
    const { puroks, fetchPuroks, loading: puroksLoading, error: puroksError } = usePurok();

    // Only fetch puroks when user reaches the location step (step 1)
    useEffect(() => {
        if (activeStep === 1 && puroks.length === 0 && !puroksLoading) {
            fetchPuroks();
        }
    }, [activeStep, puroks.length, puroksLoading, fetchPuroks]);

    const handleNext = () => {
        if (validateCurrentStep()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateCurrentStep = () => {
        const newErrors = {};

        switch (activeStep) {
            case 0: // Basic Info
                if (!formData.first_name) newErrors.first_name = 'First name is required';
                if (!formData.last_name) newErrors.last_name = 'Last name is required';
                if (!formData.gender) newErrors.gender = 'Gender is required';
                break;

            case 1: // Location
                if (!formData.purok_id) newErrors.purok_id = 'Purok is required';
                break;

            case 2: // Demographics, Survey, Meeting, Household
                if (!formData.civil_status) newErrors.civil_status = 'Civil status is required';
                if (!formData.youth_age_gap) newErrors.youth_age_gap = 'Youth age gap is required';
                if (!formData.youth_classification) newErrors.youth_classification = 'Youth classification is required';
                if (!formData.educational_background) newErrors.educational_background = 'Educational background is required';
                if (!formData.work_status) newErrors.work_status = 'Work status is required';
                if (!formData.registered_voter) newErrors.registered_voter = 'Voter registration status is required';
                if (!formData.registered_national_voter) newErrors.registered_national_voter = 'National voter registration status is required';
                if (!formData.vote_last_election) newErrors.vote_last_election = 'Last election voting status is required';
                if (!formData.attended) newErrors.attended = 'Meeting attendance status is required';
                if (formData.attended === 'yes' && !formData.times_attended) {
                    newErrors.times_attended = 'Number of times attended is required';
                }
                if (formData.attended === 'no' && !formData.reason_not_attend) {
                    newErrors.reason_not_attend = 'Reason for not attending is required';
                }
                if (!formData.household) newErrors.household = 'Household information is required';
                break;

            case 3: // Verification (Email, Password, Attachment)
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }
                if (!formData.password) newErrors.password = 'Password is required';
                else if (formData.password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                }
                if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
                else if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                if (!formData.attachment) newErrors.attachment = 'Location validation document is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateCurrentStep()) {
            try {
                await signup(formData);
                // Registration complete, redirect to login
                window.location.href = '/login';
            } catch (err) {
                console.error('Signup error:', err);
            }
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <BasicInfoStep
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                    />
                );
            case 1:
                return (
                    <LocationStep
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        puroks={puroks}
                        loading={puroksLoading}
                        error={puroksError}
                    />
                );
            case 2:
                return (
                    <CombinedDetailsStep
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                    />
                );
            case 3:
                return (
                    <VerificationStep
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        isVerified={isVerified}
                        onVerified={setIsVerified}
                    />
                );
            default:
                return null;
        }
    };

    const isStepOptional = (step) => {
        return false; // All steps are required
    };

    return (
        <Wrapper>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                        Youth Registration
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    <Box sx={{ width: '100%', mb: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        optional={
                                            isStepOptional(index) ? (
                                                <Typography variant="caption">Optional</Typography>
                                            ) : null
                                        }
                                        StepIconComponent={({ active, completed }) => (
                                            <StepIcon $active={active} $completed={completed}>
                                                {step.icon}
                                            </StepIcon>
                                        )}
                                    >
                                        {step.label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Box sx={{ minHeight: 400, mb: 4 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>

                        <Box sx={{ flex: '1 1 auto' }} />

                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Submit Registration'}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Wrapper>
    );
};

export default YouthSignup;

// Styled Components
const Wrapper = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #5894E2 0%, #68A1E1 100%);
    padding: 2rem 0;
    display: flex;
    align-items: center;
`;

const StepIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props =>
        props.$completed ? '#4caf50' :
            props.$active ? '#1976d2' : '#e0e0e0'
    };
    color: ${props =>
        props.$completed || props.$active ? 'white' : '#666'
    };
    font-size: 20px;
    transition: all 0.3s ease;
`;
