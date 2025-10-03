import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Divider
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
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            {/* Demographics Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Demographics
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    </FormControl>

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
                    </FormControl>

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
                    </FormControl>

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
                    </FormControl>

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
                    </FormControl>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Voting Survey Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Voting Survey
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    </FormControl>

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
                    </FormControl>

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
                    </FormControl>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Meeting Attendance Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Meeting Attendance
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl sx={{ minWidth: 200 }} error={!!errors.attended} required>
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
                        </FormControl>

                        {formData.attended === 'yes' && (
                            <FormControl sx={{ minWidth: 200 }} error={!!errors.times_attended} required>
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
                            </FormControl>
                        )}

                        {formData.attended === 'no' && (
                            <FormControl sx={{ minWidth: 300, flex: 1 }} error={!!errors.reason_not_attend} required>
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
                            </FormControl>
                        )}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Household Information Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Household Information
                </Typography>

                <TextField
                    fullWidth
                    label="Household Information"
                    placeholder="e.g., Family of 5, living with parents, etc."
                    value={formData.household}
                    onChange={(e) => onChange('household', e.target.value)}
                    error={!!errors.household}
                    helperText="Please provide detailed information about your household composition and living situation"
                    required
                    multiline
                    rows={3}
                />
            </Box>
        </Box>
    );
};

export default CombinedDetailsStep;