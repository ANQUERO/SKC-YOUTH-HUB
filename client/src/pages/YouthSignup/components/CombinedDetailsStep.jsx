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
        { value: 'more', label: 'More than 3 times' }
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

    // Function to calculate age from birthday
    const calculateAge = (birthday) => {
        if (!birthday) return null;
        
        const today = new Date();
        const birthDate = new Date(birthday);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    // Function to determine youth age gap based on age
    const getYouthAgeGap = (age) => {
        const ageNum = parseInt(age);
        if (isNaN(ageNum)) return '';
        
        if (ageNum >= 16 && ageNum <= 17) {
            return 'Child Youth (16–17 years old)';
        } else if (ageNum >= 18 && ageNum <= 24) {
            return 'Core Youth (18–24 years old)';
        } else if (ageNum >= 25 && ageNum <= 30) {
            return 'Young Adult (25–30 years old)';
        } else if (ageNum < 16) {
            return 'Age is below youth range (must be 16+)';
        } else {
            return 'Age is above youth range (must be 30 or below)';
        }
    };

    // Handle birthday change - calculate age and youth_age_gap
    const handleBirthdayChange = (birthday) => {
        onChange('birthday', birthday);
        
        if (birthday) {
            const calculatedAge = calculateAge(birthday);
            if (calculatedAge !== null) {
                onChange('age', calculatedAge.toString());
                const youthAgeGap = getYouthAgeGap(calculatedAge);
                onChange('youth_age_gap', youthAgeGap);
            }
        } else {
            onChange('age', '');
            onChange('youth_age_gap', '');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            {/* Demographics Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Demographics
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Birthday Input Field - Primary input */}
                    <TextField
                        fullWidth
                        label="Birthday *"
                        type="date"
                        value={formData.birthday || ''}
                        onChange={(e) => handleBirthdayChange(e.target.value)}
                        error={!!errors.birthday || !!errors.age}
                        helperText={errors.birthday || errors.age || "Select your birthday (you must be between 16-30 years old)"}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0], // Max: 16 years ago (youngest, born most recently)
                            min: new Date(new Date().setFullYear(new Date().getFullYear() - 30)).toISOString().split('T')[0] // Min: 30 years ago (oldest, born longest ago)
                        }}
                    />

                    {/* Display Calculated Age (read-only) */}
                    <TextField
                        fullWidth
                        label="Age"
                        value={formData.age ? `${formData.age} years old` : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        helperText="This is automatically calculated from your birthday"
                        variant="outlined"
                    />

                    {/* Display Youth Age Gap (read-only) */}
                    <TextField
                        fullWidth
                        label="Youth Age Gap"
                        value={formData.youth_age_gap || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        helperText="This is automatically determined based on your calculated age"
                        variant="outlined"
                        error={formData.youth_age_gap && formData.youth_age_gap.includes('not')}
                    />

                    {/* Contact Number */}
                    <TextField
                        fullWidth
                        label="Contact Number"
                        type="tel"
                        value={formData.contact_number || ''}
                        onChange={(e) => onChange('contact_number', e.target.value)}
                        error={!!errors.contact_number}
                        helperText={errors.contact_number || "Optional: Enter your contact number"}
                        placeholder="e.g., 09123456789"
                    />

                    <FormControl fullWidth error={!!errors.civil_status} required>
                        <InputLabel>Civil Status</InputLabel>
                        <Select
                            value={formData.civil_status || ''}
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

                    <FormControl fullWidth error={!!errors.educational_background} required>
                        <InputLabel>Educational Background</InputLabel>
                        <Select
                            value={formData.educational_background || ''}
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
                            value={formData.work_status || ''}
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
                            value={formData.youth_classification || ''}
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
                            value={formData.registered_voter || ''}
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
                            value={formData.registered_national_voter || ''}
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
                            value={formData.vote_last_election || ''}
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
                                value={formData.attended || ''}
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
                                    value={formData.times_attended || ''}
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
                                    value={formData.reason_not_attend || ''}
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
                    value={formData.household || ''}
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