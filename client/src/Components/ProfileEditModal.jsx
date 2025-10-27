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
import '@styles/profileEdit.module.scss'; // We'll create this CSS file

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
            // Prepare data for submission
            const submitData = { ...formData };

            // Convert radio values to boolean for backend
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

    // Helper function to get radio value for display
    const getRadioValue = (value) => {
        if (value === true || value === 'yes') return 'yes';
        if (value === false || value === 'no') return 'no';
        return 'no';
    };

    const renderStepContent = (step) => {
        if (userType === 'youth') {
            switch (step) {
                case 0:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <Person /> Basic Information
                            </Typography>
                            <div className="form-grid basic-info-grid">
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="name.first_name"
                                    value={formData.name?.first_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="name.last_name"
                                    value={formData.name?.last_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    name="name.middle_name"
                                    value={formData.name?.middle_name || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Suffix"
                                    name="name.suffix"
                                    value={formData.name?.suffix || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                            </div>
                        </div>
                    );
                case 1:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <School /> Demographics & Personal Info
                            </Typography>
                            <div className="form-grid demographics-grid">
                                <FormControl fullWidth variant="outlined" className="form-field">
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
                                    className="form-field"
                                />

                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="info.contact_number"
                                    value={formData.info?.contact_number || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
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
                                    className="form-field"
                                />

                                <FormControl fullWidth variant="outlined" className="form-field">
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

                                <FormControl fullWidth variant="outlined" className="form-field">
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

                                <FormControl fullWidth variant="outlined" className="form-field">
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

                                <FormControl fullWidth variant="outlined" className="form-field">
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

                                <FormControl fullWidth variant="outlined" className="form-field">
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
                            </div>
                        </div>
                    );
                case 2:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <HowToVote /> Voting Survey
                            </Typography>
                            <div className="survey-grid">
                                <div className="radio-card">
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" className="radio-title">
                                            Registered Voter
                                        </Typography>
                                        <RadioGroup
                                            name="survey.registered_voter"
                                            value={getRadioValue(formData.survey?.registered_voter)}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div className="radio-card">
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" className="radio-title">
                                            Registered National Voter
                                        </Typography>
                                        <RadioGroup
                                            name="survey.registered_national_voter"
                                            value={getRadioValue(formData.survey?.registered_national_voter)}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div className="radio-card">
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" className="radio-title">
                                            Vote Last Election
                                        </Typography>
                                        <RadioGroup
                                            name="survey.vote_last_election"
                                            value={getRadioValue(formData.survey?.vote_last_election)}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    );
                case 3:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <Event /> Meeting Survey
                            </Typography>
                            <div className="meeting-grid">
                                <div className="radio-card">
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle1" className="radio-title">
                                            Attended Meetings
                                        </Typography>
                                        <RadioGroup
                                            name="meetingSurvey.attended"
                                            value={getRadioValue(formData.meetingSurvey?.attended)}
                                            onChange={handleRadioChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <TextField
                                    fullWidth
                                    label="Times Attended"
                                    name="meetingSurvey.times_attended"
                                    type="number"
                                    value={formData.meetingSurvey?.times_attended || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
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
                                    className="form-field reason-field"
                                />
                            </div>
                        </div>
                    );
                default:
                    return 'Unknown step';
            }
        } else {
            // Official steps
            switch (step) {
                case 0:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <Person /> Basic Information
                            </Typography>
                            <div className="form-grid basic-info-grid">
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="name.first_name"
                                    value={formData.name?.first_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="name.last_name"
                                    value={formData.name?.last_name || ''}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Middle Name"
                                    name="name.middle_name"
                                    value={formData.name?.middle_name || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Suffix"
                                    name="name.suffix"
                                    value={formData.name?.suffix || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    name="info.contact_number"
                                    value={formData.info?.contact_number || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                                <FormControl fullWidth variant="outlined" className="form-field">
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
                                    className="form-field"
                                />
                            </div>
                        </div>
                    );
                case 1:
                    return (
                        <div className="step-content">
                            <Typography variant="h6" className="step-title">
                                <LocationOn /> Official Information
                            </Typography>
                            <div className="form-grid official-grid">
                                <TextField
                                    fullWidth
                                    label="Official Position"
                                    name="account.official_position"
                                    value={formData.account?.official_position || ''}
                                    onChange={handleChange}
                                    variant="outlined"
                                    className="form-field"
                                />
                                <FormControl fullWidth variant="outlined" className="form-field">
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
                            </div>
                        </div>
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
            maxWidth="xl" // Changed to xl for extra large
            fullWidth
            className="profile-edit-modal"
            PaperProps={{
                className: "modal-paper"
            }}
        >
            <DialogTitle className="modal-header">
                <div className="header-content">
                    <Edit /> 
                    <Typography variant="h5" component="span">
                        Edit Profile - {userType === 'youth' ? 'Youth Member' : 'Official'}
                    </Typography>
                </div>
                <Button 
                    onClick={handleClose}
                    className="close-button"
                >
                    <Close />
                </Button>
            </DialogTitle>
            
            <DialogContent className="modal-content">
                {updateError && (
                    <Alert severity="error" className="alert-message" onClose={() => setUpdateError(null)}>
                        {updateError}
                    </Alert>
                )}
                {updateSuccess && (
                    <Alert severity="success" className="alert-message">
                        {updateSuccess}
                    </Alert>
                )}

                <Stepper 
                    activeStep={activeStep} 
                    className="stepper"
                >
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                icon={step.icon}
                                className="step-label"
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box component="form" onSubmit={handleSubmit} className="form-container">
                    {renderStepContent(activeStep)}
                </Box>
            </DialogContent>
            
            <DialogActions className="modal-actions">
                <Button 
                    onClick={handleClose} 
                    disabled={loading}
                    variant="outlined"
                    className="cancel-button"
                >
                    Cancel
                </Button>
                
                <div className="navigation-buttons">
                    {activeStep > 0 && (
                        <Button 
                            onClick={handleBack}
                            variant="outlined"
                            className="back-button"
                        >
                            Back
                        </Button>
                    )}
                    
                    {activeStep < steps.length - 1 ? (
                        <Button 
                            variant="contained" 
                            onClick={handleNext}
                            className="next-button"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Edit />}
                            className="submit-button"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </Button>
                    )}
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileEditModal;