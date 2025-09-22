import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Divider,
    Paper,
    Grid
} from '@mui/material';

const CombinedDetailsStep = ({ formData, errors, onChange }) => {
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

    const youthAgeGapOptions = [
        'Child Youth (16–17 years old)',
        'Core Youth (18–24 years old)',
        'Young Adult (25–30 years old)'
    ];

    const youthClassificationOptions = [
        'In-School Youth',
        'Out-of-School Youth',
        'Working Youth',
        'Youth with Special Needs',
        'Youth in Conflict with the Law',
        'Youth in Situations of Armed Conflict',
        'Youth with Disabilities',
        'Indigenous Youth',
        'Migrant Youth',
        'Other'
    ];

    const educationalBackgroundOptions = [
        'Elementary',
        'High School',
        'Senior High School',
        'Vocational/Technical',
        'College/University',
        'Post Graduate',
        'No Formal Education',
        'Other'
    ];

    const workStatusOptions = [
        'Employed (Full-time)',
        'Employed (Part-time)',
        'Self-employed',
        'Unemployed',
        'Student',
        'Housewife/Househusband',
        'Retired',
        'Other'
    ];

    const yesNoOptions = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
    ];

    const timesAttendedOptions = [
        { value: '1', label: '1 time' },
        { value: '2', label: '2 times' },
        { value: '3', label: '3 times' },
        { value: '4', label: '4 times' },
        { value: '5', label: '5 times' },
        { value: '6', label: '6 times' },
        { value: '7', label: '7 times' },
        { value: '8', label: '8 times' },
        { value: '9', label: '9 times' },
        { value: '10', label: '10 times' },
        { value: 'more', label: 'More than 10 times' }
    ];

    const reasonNotAttendOptions = [
        'Work/School schedule conflict',
        'Family obligations',
        'Health reasons',
        'Transportation issues',
        'Not interested',
        'Did not know about the meeting',
        'Other commitments',
        'Other'
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                Demographics, Survey & Household Information
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Please provide detailed information about your demographics, voting status, meeting attendance, and household.
            </Typography>

            <Grid container spacing={4}>
                {/* Demographics Section */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Demographics
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.civil_status} required>
                                    <InputLabel>Civil Status</InputLabel>
                                    <Select
                                        value={formData.civil_status}
                                        onChange={(e) => onChange('civil_status', e.target.value)}
                                        label="Civil Status"
                                    >
                                        {civilStatusOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.civil_status && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.civil_status}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.youth_age_gap} required>
                                    <InputLabel>Youth Age Gap</InputLabel>
                                    <Select
                                        value={formData.youth_age_gap}
                                        onChange={(e) => onChange('youth_age_gap', e.target.value)}
                                        label="Youth Age Gap"
                                    >
                                        {youthAgeGapOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.youth_age_gap && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.youth_age_gap}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.youth_classification} required>
                                    <InputLabel>Youth Classification</InputLabel>
                                    <Select
                                        value={formData.youth_classification}
                                        onChange={(e) => onChange('youth_classification', e.target.value)}
                                        label="Youth Classification"
                                    >
                                        {youthClassificationOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.youth_classification && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.youth_classification}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.educational_background} required>
                                    <InputLabel>Educational Background</InputLabel>
                                    <Select
                                        value={formData.educational_background}
                                        onChange={(e) => onChange('educational_background', e.target.value)}
                                        label="Educational Background"
                                    >
                                        {educationalBackgroundOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.educational_background && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.educational_background}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.work_status} required>
                                    <InputLabel>Work Status</InputLabel>
                                    <Select
                                        value={formData.work_status}
                                        onChange={(e) => onChange('work_status', e.target.value)}
                                        label="Work Status"
                                    >
                                        {workStatusOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.work_status && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.work_status}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Survey Section */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Voting Survey
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.registered_voter} required>
                                    <InputLabel>Registered Voter in Barangay?</InputLabel>
                                    <Select
                                        value={formData.registered_voter}
                                        onChange={(e) => onChange('registered_voter', e.target.value)}
                                        label="Registered Voter in Barangay?"
                                    >
                                        {yesNoOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.registered_voter && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.registered_voter}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.registered_national_voter} required>
                                    <InputLabel>Registered National Voter?</InputLabel>
                                    <Select
                                        value={formData.registered_national_voter}
                                        onChange={(e) => onChange('registered_national_voter', e.target.value)}
                                        label="Registered National Voter?"
                                    >
                                        {yesNoOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.registered_national_voter && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.registered_national_voter}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.vote_last_election} required>
                                    <InputLabel>Voted in Last Election?</InputLabel>
                                    <Select
                                        value={formData.vote_last_election}
                                        onChange={(e) => onChange('vote_last_election', e.target.value)}
                                        label="Voted in Last Election?"
                                    >
                                        {yesNoOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.vote_last_election && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.vote_last_election}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Meeting Survey Section */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Meeting Attendance
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth error={!!errors.attended} required>
                                    <InputLabel>Attended SK Meetings?</InputLabel>
                                    <Select
                                        value={formData.attended}
                                        onChange={(e) => onChange('attended', e.target.value)}
                                        label="Attended SK Meetings?"
                                    >
                                        {yesNoOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.attended && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            {errors.attended}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {formData.attended === 'yes' && (
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth error={!!errors.times_attended} required>
                                        <InputLabel>How Many Times?</InputLabel>
                                        <Select
                                            value={formData.times_attended}
                                            onChange={(e) => onChange('times_attended', e.target.value)}
                                            label="How Many Times?"
                                        >
                                            {timesAttendedOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.times_attended && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                {errors.times_attended}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}

                            {formData.attended === 'no' && (
                                <Grid item xs={12} sm={8}>
                                    <FormControl fullWidth error={!!errors.reason_not_attend} required>
                                        <InputLabel>Reason for Not Attending</InputLabel>
                                        <Select
                                            value={formData.reason_not_attend}
                                            onChange={(e) => onChange('reason_not_attend', e.target.value)}
                                            label="Reason for Not Attending"
                                        >
                                            {reasonNotAttendOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.reason_not_attend && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                {errors.reason_not_attend}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Household Section */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Household Information
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Household Information"
                                    placeholder="e.g., Family of 5, living with parents, etc."
                                    value={formData.household}
                                    onChange={(e) => onChange('household', e.target.value)}
                                    error={!!errors.household}
                                    helperText={errors.household || "Please provide information about your household"}
                                    required
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CombinedDetailsStep;
