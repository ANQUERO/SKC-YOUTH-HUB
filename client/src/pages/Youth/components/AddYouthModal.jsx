import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
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
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Avatar,
    Chip,
    InputAdornment,
    IconButton
} from '@mui/material';
import { 
    PersonAdd, 
    Badge, 
    LocationOn, 
    School, 
    HowToVote, 
    Event,
    Visibility,
    VisibilityOff,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import useYouth from '@hooks/useYouth';
import usePurok from '@hooks/usePurok';

const AddYouthModal = ({ open, onClose, onSuccess }) => {
    const { storeYouth, loading, error, success } = useYouth();
    const { fetchPuroks } = usePurok();
    const [puroks, setPuroks] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const steps = [
        { label: 'Account Info', icon: <Badge /> },
        { label: 'Personal Details', icon: <PersonAdd /> },
        { label: 'Location', icon: <LocationOn /> },
        { label: 'Education & Work', icon: <School /> },
        { label: 'Survey', icon: <HowToVote /> }
    ];

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: ''
        },
        location: {
            region: 'Region VII',
            province: 'Cebu',
            municipality: 'Cordova',
            barangay: 'Catarman',
            purok_id: ''
        },
        gender: {
            gender: ''
        },
        info: {
            age: '',
            contact: '',
            birthday: '',
        },
        demographics: {
            civil_status: '',
            youth_age_gap: '',
            youth_classification: '',
            educational_background: '',
            work_status: ''
        },
        survey: {
            registered_voter: 'no',
            registered_national_voter: 'no',
            vote_last_election: 'no'
        },
        meetingSurvey: {
            attended: 'no',
            times_attended: '',
            reason_not_attend: ''
        },
        attachments: [],
        household: null
    });

    useEffect(() => {
        if (open) {
            fetchPuroks().then(data => setPuroks(data));
        }
    }, [open, fetchPuroks]);

    useEffect(() => {
        if (success) {
            onSuccess();
            handleClose();
        }
    }, [success, onSuccess]);

    const validateStep = (step) => {
        const errors = {};
        
        switch (step) {
            case 0: // Account Info
                if (!formData.email) errors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
                if (!formData.password) errors.password = 'Password is required';
                else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
                break;
            case 1: // Personal Details
                if (!formData.name.first_name) errors.first_name = 'First name is required';
                if (!formData.name.last_name) errors.last_name = 'Last name is required';
                if (!formData.gender.gender) errors.gender = 'Gender is required';
                if (!formData.info.birthday) errors.birthday = 'Birthday is required';
                break;
            case 2: // Location
                if (!formData.location.purok_id) errors.purok_id = 'Purok is required';
                break;
            default:
                break;
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [group, subKey] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [subKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(activeStep)) {
            return;
        }

        if (activeStep < steps.length - 1) {
            handleNext();
            return;
        }

        // Final validation before submit
        const finalErrors = {};
        if (!formData.email) finalErrors.email = 'Email is required';
        if (!formData.password) finalErrors.password = 'Password is required';
        if (!formData.name.first_name) finalErrors.first_name = 'First name is required';
        if (!formData.name.last_name) finalErrors.last_name = 'Last name is required';
        if (!formData.location.purok_id) finalErrors.purok_id = 'Purok is required';

        if (Object.keys(finalErrors).length > 0) {
            setFormErrors(finalErrors);
            setActiveStep(0); // Go back to first step with errors
            return;
        }
        
        try {
            await storeYouth(formData);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            name: {
                first_name: '',
                middle_name: '',
                last_name: '',
                suffix: ''
            },
            location: {
                region: 'Region VII',
                province: 'Cebu',
                municipality: 'Cordova',
                barangay: 'Catarman',
                purok_id: ''
            },
            gender: {
                gender: ''
            },
            info: {
                age: '',
                contact: '',
                birthday: '',
            },
            demographics: {
                civil_status: '',
                youth_age_gap: '',
                youth_classification: '',
                educational_background: '',
                work_status: ''
            },
            survey: {
                registered_voter: 'no',
                registered_national_voter: 'no',
                vote_last_election: 'no'
            },
            meetingSurvey: {
                attended: 'no',
                times_attended: '',
                reason_not_attend: ''
            },
            attachments: [],
            household: null
        });
        setFormErrors({});
        setActiveStep(0);
        setShowPassword(false);
        onClose();
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card elevation={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                <Badge /> Account Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Create login credentials for the youth member
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!formErrors.email}
                                        helperText={formErrors.email}
                                        required
                                        variant="outlined"
                                        placeholder="example@email.com"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!formErrors.password}
                                        helperText={formErrors.password}
                                        required
                                        variant="outlined"
                                        placeholder="At least 6 characters"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <Card elevation={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                <PersonAdd /> Personal Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Basic personal details of the youth member
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name *"
                                        name="name.first_name"
                                        value={formData.name.first_name}
                                        onChange={handleChange}
                                        error={!!formErrors.first_name}
                                        helperText={formErrors.first_name}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name *"
                                        name="name.last_name"
                                        value={formData.name.last_name}
                                        onChange={handleChange}
                                        error={!!formErrors.last_name}
                                        helperText={formErrors.last_name}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Middle Name"
                                        name="name.middle_name"
                                        value={formData.name.middle_name}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Suffix"
                                        name="name.suffix"
                                        value={formData.name.suffix}
                                        onChange={handleChange}
                                        variant="outlined"
                                        placeholder="Jr., Sr., III"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" error={!!formErrors.gender}>
                                        <InputLabel>Gender *</InputLabel>
                                        <Select
                                            name="gender.gender"
                                            value={formData.gender.gender}
                                            onChange={handleChange}
                                            label="Gender *"
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                        {formErrors.gender && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                {formErrors.gender}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Birthday *"
                                        name="info.birthday"
                                        type="date"
                                        value={formData.info.birthday}
                                        onChange={handleChange}
                                        error={!!formErrors.birthday}
                                        helperText={formErrors.birthday}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Contact Number"
                                        name="info.contact"
                                        value={formData.info.contact}
                                        onChange={handleChange}
                                        variant="outlined"
                                        placeholder="09XXXXXXXXX"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        name="info.age"
                                        type="number"
                                        value={formData.info.age}
                                        onChange={handleChange}
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 15, max: 30 }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card elevation={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                <LocationOn /> Location Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Address details of the youth member
                            </Typography>
                            
                            {/* Fixed Address Display */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                                <Typography variant="subtitle2" color="success.dark" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle fontSize="small" /> Address Location
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Chip label={formData.location.region} color="primary" size="small" />
                                    <Chip label={formData.location.province} color="primary" variant="outlined" size="small" />
                                    <Chip label={formData.location.municipality} color="primary" variant="outlined" size="small" />
                                    <Chip label={formData.location.barangay} color="primary" variant="outlined" size="small" />
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" error={!!formErrors.purok_id}>
                                        <InputLabel>Select Purok *</InputLabel>
                                        <Select
                                            name="location.purok_id"
                                            value={formData.location.purok_id}
                                            onChange={handleChange}
                                            label="Select Purok *"
                                        >
                                            <MenuItem value="">
                                                <em>Select a purok</em>
                                            </MenuItem>
                                            {puroks.map(purok => (
                                                <MenuItem key={purok.purok_id} value={purok.purok_id}>
                                                    {purok.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formErrors.purok_id && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                {formErrors.purok_id}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 3:
                return (
                    <Card elevation={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                <School /> Education & Employment
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Educational and employment background
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Civil Status</InputLabel>
                                        <Select
                                            name="demographics.civil_status"
                                            value={formData.demographics.civil_status}
                                            onChange={handleChange}
                                            label="Civil Status"
                                        >
                                            <MenuItem value="Single">Single</MenuItem>
                                            <MenuItem value="Married">Married</MenuItem>
                                            <MenuItem value="Widowed">Widowed</MenuItem>
                                            <MenuItem value="Divorced">Divorced</MenuItem>
                                            <MenuItem value="Separated">Separated</MenuItem>
                                            <MenuItem value="Annulled">Annulled</MenuItem>
                                            <MenuItem value="Live-in">Live-in</MenuItem>
                                            <MenuItem value="Unknown">Unknown</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Youth Age Gap</InputLabel>
                                        <Select
                                            name="demographics.youth_age_gap"
                                            value={formData.demographics.youth_age_gap}
                                            onChange={handleChange}
                                            label="Youth Age Gap"
                                        >
                                            <MenuItem value="Child Youth (16-17 years old)">Child Youth (16-17 years old)</MenuItem>
                                            <MenuItem value="Core Youth (18-24 years old)">Core Youth (18-24 years old)</MenuItem>
                                            <MenuItem value="Young Adult (25-30 years old)">Young Adult (25-30 years old)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Youth Classification</InputLabel>
                                        <Select
                                            name="demographics.youth_classification"
                                            value={formData.demographics.youth_classification}
                                            onChange={handleChange}
                                            label="Youth Classification"
                                        >
                                            <MenuItem value="In school youth">In school youth</MenuItem>
                                            <MenuItem value="Out of school youth">Out of school youth</MenuItem>
                                            <MenuItem value="Working school youth">Working school youth</MenuItem>
                                            <MenuItem value="Youth w/ Specific needs">Youth w/ Specific needs</MenuItem>
                                            <MenuItem value="Person w/ Disability">Person w/ Disability</MenuItem>
                                            <MenuItem value="Children in Conflict w/ Law">Children in Conflict w/ Law</MenuItem>
                                            <MenuItem value="Indigenous people">Indigenous people</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Educational Background</InputLabel>
                                        <Select
                                            name="demographics.educational_background"
                                            value={formData.demographics.educational_background}
                                            onChange={handleChange}
                                            label="Educational Background"
                                        >
                                            <MenuItem value="Elementary Level">Elementary Level</MenuItem>
                                            <MenuItem value="Elementary Graduate">Elementary Graduate</MenuItem>
                                            <MenuItem value="High School Level">High School Level</MenuItem>
                                            <MenuItem value="High School Graduate">High School Graduate</MenuItem>
                                            <MenuItem value="Vocational Graduate">Vocational Graduate</MenuItem>
                                            <MenuItem value="College Level">College Level</MenuItem>
                                            <MenuItem value="College Graduate">College Graduate</MenuItem>
                                            <MenuItem value="Master's Level">Master's Level</MenuItem>
                                            <MenuItem value="Master's Graduate">Master's Graduate</MenuItem>
                                            <MenuItem value="Doctorate Level">Doctorate Level</MenuItem>
                                            <MenuItem value="Doctorate Graduate">Doctorate Graduate</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Work Status</InputLabel>
                                        <Select
                                            name="demographics.work_status"
                                            value={formData.demographics.work_status}
                                            onChange={handleChange}
                                            label="Work Status"
                                        >
                                            <MenuItem value="Employed">Employed</MenuItem>
                                            <MenuItem value="Unemployed">Unemployed</MenuItem>
                                            <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                                            <MenuItem value="Currently looking for a job">Currently looking for a job</MenuItem>
                                            <MenuItem value="Not interested looking for a job">Not interested looking for a job</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 4:
                return (
                    <Card elevation={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                <HowToVote /> Member Survey
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Voting and meeting participation information
                            </Typography>
                            
                            <Grid container spacing={4}>
                                {/* Voting Survey */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                                        Voting Information
                                    </Typography>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Registered Voter in Barangay?</Typography>
                                        <RadioGroup
                                            name="survey.registered_voter"
                                            value={formData.survey.registered_voter}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Registered National Voter?</Typography>
                                        <RadioGroup
                                            name="survey.registered_national_voter"
                                            value={formData.survey.registered_national_voter}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Voted in Last Election?</Typography>
                                        <RadioGroup
                                            name="survey.vote_last_election"
                                            value={formData.survey.vote_last_election}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                {/* Meeting Survey */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                                        Meeting Participation
                                    </Typography>
                                    <FormControl component="fieldset" fullWidth>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Attended SK Meetings?</Typography>
                                        <RadioGroup
                                            name="meetingSurvey.attended"
                                            value={formData.meetingSurvey.attended}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                        </RadioGroup>
                                    </FormControl>

                                    {formData.meetingSurvey.attended === 'yes' && (
                                        <TextField
                                            fullWidth
                                            label="Number of Times Attended"
                                            name="meetingSurvey.times_attended"
                                            type="number"
                                            value={formData.meetingSurvey.times_attended}
                                            onChange={handleChange}
                                            variant="outlined"
                                            sx={{ mt: 3 }}
                                        />
                                    )}

                                    {formData.meetingSurvey.attended === 'no' && (
                                        <TextField
                                            fullWidth
                                            label="Reason for Not Attending"
                                            name="meetingSurvey.reason_not_attend"
                                            value={formData.meetingSurvey.reason_not_attend}
                                            onChange={handleChange}
                                            variant="outlined"
                                            sx={{ mt: 3 }}
                                            multiline
                                            rows={3}
                                            placeholder="Please specify reason..."
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 3
            }}>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                    <PersonAdd />
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Add New Youth Member
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Complete the form to register a new youth member
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mx: 3, 
                            mt: 3,
                            borderRadius: 1
                        }}
                        action={
                            <IconButton size="small" onClick={() => setFormErrors({})}>
                                <Cancel />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={{ px: 3, pt: 3 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    icon={
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                                                color: 'white'
                                            }}
                                        >
                                            {step.icon}
                                        </Avatar>
                                    }
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }
                                    }}
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box component="form" onSubmit={handleSubmit}>
                        {renderStepContent(activeStep)}
                    </Box>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
                p: 3, 
                bgcolor: 'grey.50',
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Button 
                        onClick={handleClose} 
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {activeStep > 0 && (
                            <Button 
                                onClick={handleBack}
                                variant="outlined"
                                sx={{ minWidth: 100 }}
                            >
                                Back
                            </Button>
                        )}
                        
                        {activeStep < steps.length - 1 ? (
                            <Button 
                                variant="contained" 
                                onClick={handleNext}
                                sx={{ minWidth: 100 }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                                sx={{
                                    minWidth: 140,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                                    }
                                }}
                            >
                                {loading ? 'Adding...' : 'Add Youth'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddYouthModal;