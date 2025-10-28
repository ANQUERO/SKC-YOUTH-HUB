import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Edit, Person, LocationOn, School, HowToVote, Event, Close } from '@mui/icons-material';

const ProfileEditModal = ({ 
    open, 
    onClose, 
    onUpdate, 
    userType, 
    currentData, 
    loading 
}) => {
    const [formData, setFormData] = useState({});
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Define all possible values to avoid out-of-range errors
    const youthAgeGapOptions = [
        'Child Youth (16-17 years old)',
        'Core Youth (18-24 years old)', 
        'Young Adult (25-30 years old)'
    ];

    const youthClassificationOptions = [
        'In school youth',
        'Out of school youth',
        'Working school youth',
        'Youth w/ Specific needs',
        'Person w/ Disability',
        'Children in Conflict w/ Law',
        'Indigenous people'
    ];

    const educationalBackgroundOptions = [
        'Elementary Level',
        'Elementary Graduate',
        'High School Level',
        'High School Graduate',
        'Vocational Graduate',
        'College Level',
        'College Graduate',
        'Master\'s Level',
        'Master\'s Graduate',
        'Doctorate Level',
        'Doctorate Graduate'
    ];

    const workStatusOptions = [
        'Employed',
        'Unemployed',
        'Self-Employed',
        'Currently looking for a job',
        'Not interested looking for a job'
    ];

    const civilStatusOptions = [
        'Single',
        'Married',
        'Widowed',
        'Divorced',
        'Separated',
        'Annulled',
        'Live-in',
        'Unknown'
    ];

    const genderOptions = [
        'male',
        'female',
        'other'
    ];

    const youthSteps = [
        { label: 'Basic Info', icon: <Person /> },
        { label: 'Demographics', icon: <School /> },
        { label: 'Survey', icon: <HowToVote /> },
        { label: 'Meeting', icon: <Event /> }
    ];

    const officialSteps = [
        { label: 'Basic Info', icon: <Person /> },
        { label: 'Official Info', icon: <LocationOn /> }
    ];

    const steps = userType === 'youth' ? youthSteps : officialSteps;

    // Helper function to get safe select value
    const getSafeSelectValue = (value, options) => {
        return options.includes(value) ? value : '';
    };

    useEffect(() => {
        if (open && currentData) {
            if (userType === 'youth') {
                setFormData({
                    name: {
                        first_name: currentData.name?.first_name || '',
                        middle_name: currentData.name?.middle_name || '',
                        last_name: currentData.name?.last_name || '',
                        suffix: currentData.name?.suffix || ''
                    },
                    info: {
                        age: currentData.info?.age || '',
                        contact_number: currentData.info?.contact_number || '',
                        birthday: currentData.info?.birthday || ''
                    },
                    gender: {
                        gender: getSafeSelectValue(currentData.gender?.gender, genderOptions)
                    },
                    demographics: {
                        civil_status: getSafeSelectValue(currentData.demographics?.civil_status, civilStatusOptions),
                        youth_age_gap: getSafeSelectValue(currentData.demographics?.youth_age_gap, youthAgeGapOptions),
                        youth_classification: getSafeSelectValue(currentData.demographics?.youth_classification, youthClassificationOptions),
                        educational_background: getSafeSelectValue(currentData.demographics?.educational_background, educationalBackgroundOptions),
                        work_status: getSafeSelectValue(currentData.demographics?.work_status, workStatusOptions)
                    },
                    survey: {
                        registered_voter: currentData.survey?.registered_voter || false,
                        registered_national_voter: currentData.survey?.registered_national_voter || false,
                        vote_last_election: currentData.survey?.vote_last_election || false
                    },
                    meetingSurvey: {
                        attended: currentData.meetingSurvey?.attended || false,
                        times_attended: currentData.meetingSurvey?.times_attended || '',
                        reason_not_attend: currentData.meetingSurvey?.reason_not_attend || ''
                    }
                });
            } else {
                setFormData({
                    name: {
                        first_name: currentData.name?.first_name || '',
                        middle_name: currentData.name?.middle_name || '',
                        last_name: currentData.name?.last_name || '',
                        suffix: currentData.name?.suffix || ''
                    },
                    info: {
                        contact_number: currentData.info?.contact_number || '',
                        gender: getSafeSelectValue(currentData.info?.gender, genderOptions),
                        age: currentData.info?.age || ''
                    },
                    account: {
                        official_position: currentData.account?.official_position || '',
                        role: currentData.account?.role || ''
                    }
                });
            }
            setUpdateError(null);
            setUpdateSuccess(null);
            setActiveStep(0);
        }
    }, [open, currentData, userType]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        if (name.includes('.')) {
            const [group, subKey] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [subKey]: finalValue
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: finalValue
            }));
        }
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        const boolValue = value === 'yes';

        if (name.includes('.')) {
            const [group, subKey] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [subKey]: boolValue
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setUpdateError(null);
        setUpdateSuccess(null);

        try {
            const submitData = { ...formData };

            if (userType === 'youth') {
                if (submitData.survey) {
                    submitData.survey = {
                        registered_voter: submitData.survey.registered_voter === true || submitData.survey.registered_voter === 'yes',
                        registered_national_voter: submitData.survey.registered_national_voter === true || submitData.survey.registered_national_voter === 'yes',
                        vote_last_election: submitData.survey.vote_last_election === true || submitData.survey.vote_last_election === 'yes'
                    };
                }
                if (submitData.meetingSurvey) {
                    submitData.meetingSurvey = {
                        attended: submitData.meetingSurvey.attended === true || submitData.meetingSurvey.attended === 'yes',
                        times_attended: submitData.meetingSurvey.times_attended || 0,
                        reason_not_attend: submitData.meetingSurvey.reason_not_attend || ''
                    };
                }
            }

            const result = await onUpdate(submitData);
            
            if (result) {
                setUpdateSuccess('Profile updated successfully!');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                setUpdateError('Failed to update profile. Please try again.');
            }
        } catch (error) {
            setUpdateError(error.message || 'Failed to update profile. Please try again.');
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        setFormData({});
        setUpdateError(null);
        setUpdateSuccess(null);
        setActiveStep(0);
        onClose();
    };

    const getRadioValue = (value) => {
        if (value === true || value === 'yes') return 'yes';
        if (value === false || value === 'no') return 'no';
        return 'no';
    };

    // Container styles
    const modalStyle = {
        '& .MuiDialog-paper': {
            width: '95vw',
            maxWidth: '1400px',
            height: '95vh',
            maxHeight: '900px',
            margin: '20px',
            borderRadius: '12px',
            overflow: 'hidden'
        }
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const contentStyle = {
        padding: '30px',
        height: 'calc(100% - 140px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    };

    const formContainerStyle = {
        flex: 1,
        overflowY: 'auto',
        padding: '0 10px'
    };

    const stepContentStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    const stepTitleStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#1976d2',
        marginBottom: '25px',
        fontSize: '1.4rem',
        fontWeight: '600',
        paddingBottom: '15px',
        borderBottom: '2px solid #e0e0e0'
    };

    // Grid styles
    const basicGridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '20px',
        flex: 1
    };

    const demographicsGridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '20px',
        flex: 1
    };

    const surveyGridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '25px',
        flex: 1
    };

    const meetingGridStyle = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '25px',
        alignItems: 'start'
    };

    const radioCardStyle = {
        background: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '25px',
        transition: 'all 0.3s ease',
        height: 'fit-content'
    };

    const actionsStyle = {
        padding: '25px 30px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
    };

    const navigationButtonsStyle = {
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
    };

    const renderStepContent = (step) => {
        if (userType === 'youth') {
            switch (step) {
                case 0:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <Person /> Basic Information
                            </Typography>
                            <Box sx={basicGridStyle}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="name.first_name"
                                    value={formData.name?.first_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="name.last_name"
                                    value={formData.name?.last_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    name="name.middle_name"
                                    value={formData.name?.middle_name || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Suffix"
                                    name="name.suffix"
                                    value={formData.name?.suffix || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    );
                case 1:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <School /> Demographics & Personal Info
                            </Typography>
                            <Box sx={demographicsGridStyle}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender.gender"
                                        value={formData.gender?.gender || ''}
                                        onChange={handleChange}
                                        label="Gender"
                                    >
                                        {genderOptions.map(option => (
                                            <MenuItem key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Age"
                                    name="info.age"
                                    type="number"
                                    value={formData.info?.age || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="info.contact_number"
                                    value={formData.info?.contact_number || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Birthday"
                                    name="info.birthday"
                                    type="date"
                                    value={formData.info?.birthday || ''}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                />

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Civil Status</InputLabel>
                                    <Select
                                        name="demographics.civil_status"
                                        value={formData.demographics?.civil_status || ''}
                                        onChange={handleChange}
                                        label="Civil Status"
                                    >
                                        {civilStatusOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Youth Age Gap</InputLabel>
                                    <Select
                                        name="demographics.youth_age_gap"
                                        value={formData.demographics?.youth_age_gap || ''}
                                        onChange={handleChange}
                                        label="Youth Age Gap"
                                    >
                                        {youthAgeGapOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Youth Classification</InputLabel>
                                    <Select
                                        name="demographics.youth_classification"
                                        value={formData.demographics?.youth_classification || ''}
                                        onChange={handleChange}
                                        label="Youth Classification"
                                    >
                                        {youthClassificationOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Educational Background</InputLabel>
                                    <Select
                                        name="demographics.educational_background"
                                        value={formData.demographics?.educational_background || ''}
                                        onChange={handleChange}
                                        label="Educational Background"
                                    >
                                        {educationalBackgroundOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Work Status</InputLabel>
                                    <Select
                                        name="demographics.work_status"
                                        value={formData.demographics?.work_status || ''}
                                        onChange={handleChange}
                                        label="Work Status"
                                    >
                                        {workStatusOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    );
                case 2:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <HowToVote /> Voting Survey
                            </Typography>
                            <Box sx={surveyGridStyle}>
                                <Box sx={radioCardStyle}>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                            Registered Voter
                                        </Typography>
                                        <RadioGroup
                                            name="survey.registered_voter"
                                            value={getRadioValue(formData.survey?.registered_voter)}
                                            onChange={handleRadioChange}
                                            sx={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '30px' }}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                <Box sx={radioCardStyle}>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                            Registered National Voter
                                        </Typography>
                                        <RadioGroup
                                            name="survey.registered_national_voter"
                                            value={getRadioValue(formData.survey?.registered_national_voter)}
                                            onChange={handleRadioChange}
                                            sx={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '30px' }}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                <Box sx={radioCardStyle}>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                            Vote Last Election
                                        </Typography>
                                        <RadioGroup
                                            name="survey.vote_last_election"
                                            value={getRadioValue(formData.survey?.vote_last_election)}
                                            onChange={handleRadioChange}
                                            sx={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '30px' }}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>
                    );
                case 3:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <Event /> Meeting Survey
                            </Typography>
                            <Box sx={meetingGridStyle}>
                                <Box sx={radioCardStyle}>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                            Attended Meetings
                                        </Typography>
                                        <RadioGroup
                                            name="meetingSurvey.attended"
                                            value={getRadioValue(formData.meetingSurvey?.attended)}
                                            onChange={handleRadioChange}
                                            sx={{ flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '30px' }}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Times Attended"
                                    name="meetingSurvey.times_attended"
                                    type="number"
                                    value={formData.meetingSurvey?.times_attended || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Reason Not Attend"
                                    name="meetingSurvey.reason_not_attend"
                                    value={formData.meetingSurvey?.reason_not_attend || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    sx={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}
                                />
                            </Box>
                        </Box>
                    );
                default:
                    return 'Unknown step';
            }
        } else {
            switch (step) {
                case 0:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <Person /> Basic Information
                            </Typography>
                            <Box sx={{ ...basicGridStyle, maxWidth: '600px' }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="name.first_name"
                                    value={formData.name?.first_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="name.last_name"
                                    value={formData.name?.last_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    name="name.middle_name"
                                    value={formData.name?.middle_name || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Suffix"
                                    name="name.suffix"
                                    value={formData.name?.suffix || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="info.contact_number"
                                    value={formData.info?.contact_number || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="info.gender"
                                        value={formData.info?.gender || ''}
                                        onChange={handleChange}
                                        label="Gender"
                                    >
                                        {genderOptions.map(option => (
                                            <MenuItem key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    name="info.age"
                                    type="number"
                                    value={formData.info?.age || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    );
                case 1:
                    return (
                        <Box sx={stepContentStyle}>
                            <Typography variant="h6" sx={stepTitleStyle}>
                                <LocationOn /> Official Information
                            </Typography>
                            <Box sx={{ ...basicGridStyle, maxWidth: '600px' }}>
                                <TextField
                                    fullWidth
                                    label="Official Position"
                                    name="account.official_position"
                                    value={formData.account?.official_position || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="account.role"
                                        value={formData.account?.role || ''}
                                        onChange={handleChange}
                                        label="Role"
                                    >
                                        <MenuItem value="super_official">Super Official</MenuItem>
                                        <MenuItem value="natural_official">Natural Official</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    );
                default:
                    return 'Unknown step';
            }
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="xl"
            fullWidth
            sx={modalStyle}
        >
            <DialogTitle sx={headerStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Edit /> 
                    <Typography variant="h5" component="span">
                        Edit Profile - {userType === 'youth' ? 'Youth Member' : 'Official'}
                    </Typography>
                </Box>
                <Button 
                    onClick={handleClose}
                    sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                >
                    <Close />
                </Button>
            </DialogTitle>
            
            <DialogContent sx={contentStyle}>
                {updateError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>
                        {updateError}
                    </Alert>
                )}
                {updateSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {updateSuccess}
                    </Alert>
                )}

                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel icon={step.icon}>
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box component="form" onSubmit={handleSubmit} sx={formContainerStyle}>
                    {renderStepContent(activeStep)}
                </Box>
            </DialogContent>
            
            <DialogActions sx={actionsStyle}>
                <Button 
                    onClick={handleClose} 
                    disabled={loading}
                    variant="outlined"
                    sx={{ borderRadius: '8px', padding: '10px 24px', fontWeight: 600 }}
                >
                    Cancel
                </Button>
                
                <Box sx={navigationButtonsStyle}>
                    {activeStep > 0 && (
                        <Button 
                            onClick={handleBack}
                            variant="outlined"
                            sx={{ borderRadius: '8px', padding: '10px 24px', fontWeight: 600 }}
                        >
                            Back
                        </Button>
                    )}
                    
                    {activeStep < steps.length - 1 ? (
                        <Button 
                            variant="contained" 
                            onClick={handleNext}
                            sx={{ 
                                borderRadius: '8px', 
                                padding: '10px 30px', 
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                                }
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
                            sx={{ 
                                borderRadius: '8px', 
                                padding: '10px 30px', 
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                                }
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileEditModal;