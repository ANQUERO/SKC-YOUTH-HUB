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
    Checkbox,
    FormGroup,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { PersonAdd, Badge, LocationOn, School, HowToVote, Event } from '@mui/icons-material';
import useYouth from '@hooks/useYouth';
import usePurok from '@hooks/usePurok';

const AddYouthModal = ({ open, onClose, onSuccess }) => {
    const { storeYouth, loading, error, success } = useYouth();
    const { fetcPuroks } = usePurok();
    const [puroks, setPuroks] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { label: 'Basic Info', icon: <Badge /> },
        { label: 'Location', icon: <LocationOn /> },
        { label: 'Demographics', icon: <School /> },
        { label: 'Survey', icon: <HowToVote /> },
        { label: 'Meeting', icon: <Event /> }
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
            region: '',
            province: '',
            municipality: '',
            barangay: '',
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
            fetcPuroks().then(data => setPuroks(data));
        }
    }, [open, fetcPuroks]);

    useEffect(() => {
        if (success) {
            onSuccess();
            handleClose();
        }
    }, [success, onSuccess]);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await storeYouth(formData);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
                region: '',
                province: '',
                municipality: '',
                barangay: '',
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
        setActiveStep(0);
        onClose();
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card elevation={0} sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <Badge /> Basic Information
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="name.first_name"
                                        value={formData.name.first_name}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="name.last_name"
                                        value={formData.name.last_name}
                                        onChange={handleChange}
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
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <Card elevation={0} sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <LocationOn /> Location Information
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Region"
                                        name="location.region"
                                        value={formData.location.region}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Province"
                                        name="location.province"
                                        value={formData.location.province}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Municipality"
                                        name="location.municipality"
                                        value={formData.location.municipality}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Barangay"
                                        name="location.barangay"
                                        value={formData.location.barangay}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Purok</InputLabel>
                                        <Select
                                            name="location.purok_id"
                                            value={formData.location.purok_id}
                                            onChange={handleChange}
                                            label="Purok"
                                        >
                                            {puroks.map(purok => (
                                                <MenuItem key={purok.purok_id} value={purok.purok_id}>
                                                    {purok.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card elevation={0} sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <School /> Demographics & Personal Info
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender.gender"
                                            value={formData.gender.gender}
                                            onChange={handleChange}
                                            label="Gender"
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Birthday"
                                        name="info.birthday"
                                        type="date"
                                        value={formData.info.birthday}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                    />
                                </Grid>

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
            case 3:
                return (
                    <Card elevation={0} sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <HowToVote /> Voting Survey
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl component="fieldset">
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Registered Voter</Typography>
                                        <RadioGroup
                                            name="survey.registered_voter"
                                            value={formData.survey.registered_voter}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl component="fieldset">
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Registered National Voter</Typography>
                                        <RadioGroup
                                            name="survey.registered_national_voter"
                                            value={formData.survey.registered_national_voter}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl component="fieldset">
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Vote Last Election</Typography>
                                        <RadioGroup
                                            name="survey.vote_last_election"
                                            value={formData.survey.vote_last_election}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 4:
                return (
                    <Card elevation={0} sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
                                <Event /> Meeting Survey
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl component="fieldset">
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Attended Meetings</Typography>
                                        <RadioGroup
                                            name="meetingSurvey.attended"
                                            value={formData.meetingSurvey.attended}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Times Attended"
                                        name="meetingSurvey.times_attended"
                                        type="number"
                                        value={formData.meetingSurvey.times_attended}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Reason Not Attend"
                                        name="meetingSurvey.reason_not_attend"
                                        value={formData.meetingSurvey.reason_not_attend}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
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
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <PersonAdd /> Add New Youth Member
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                icon={step.icon}
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: '0.875rem',
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
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                {activeStep > 0 && (
                    <Button onClick={handleBack}>
                        Back
                    </Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                        sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                            }
                        }}
                    >
                        {loading ? 'Adding...' : 'Add Youth'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddYouthModal;