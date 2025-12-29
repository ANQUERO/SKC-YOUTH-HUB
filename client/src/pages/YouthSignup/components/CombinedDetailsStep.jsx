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
    Alert
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

    // State to track age validation error
    const [ageError, setAgeError] = React.useState('');
    // State to track phone number validation error
    const [phoneError, setPhoneError] = React.useState('');

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
        
        if (ageNum >= 15 && ageNum <= 17) {
            return 'Child Youth (15–17 years old)';
        } else if (ageNum >= 18 && ageNum <= 24) {
            return 'Core Youth (18–24 years old)';
        } else if (ageNum >= 25 && ageNum <= 30) {
            return 'Young Adult (25–30 years old)';
        } else if (ageNum < 15) {
            return 'Age is below youth range (must be 15+)';
        } else {
            return 'Age is above youth range (must be 30 or below)';
        }
    };

    // Function to validate age for registration (16-30 years old)
    const validateAgeForRegistration = (age) => {
        const ageNum = parseInt(age);
        if (isNaN(ageNum)) return 'Invalid age input';

        if (ageNum < 16) {
            return 'Age must be 16 or older to register';
        } else if (ageNum > 30) {
            return 'Age must be 30 or younger to register';
        }

        return null; // No error - age is valid
    };

    // Function to validate Philippine phone number
    const validatePhoneNumber = (phone) => {
        if (!phone) return null; // Phone is optional, so empty is valid
        
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, '');
        
        // Check if the number starts with the correct prefixes
        const validPrefixes = ['09', '08', '07'];
        const isValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));
        
        if (!isValidPrefix) {
            return 'Phone number must start with 09, 08, or 07';
        }
        
        // Check length (11 digits for mobile numbers)
        if (digitsOnly.length !== 11) {
            return 'Phone number must be 11 digits (including prefix)';
        }
        
        // Check if all digits are valid (no special characters slipped through)
        if (!/^\d+$/.test(digitsOnly)) {
            return 'Phone number contains invalid characters';
        }
        
        // Check if the number is within valid Philippine mobile ranges
        const areaCode = digitsOnly.substring(0, 4);
        const validAreaCodes = [
            // Globe/TM prefixes
            '0915', '0916', '0917', '0926', '0927', '0935', '0936', '0937', 
            '0945', '0946', '0947', '0953', '0954', '0955', '0956', 
            '0965', '0966', '0967', '0975', '0976', '0977', '0978', 
            '0979', '0995', '0996', '0997',
            // Smart/TNT prefixes
            '0905', '0906', '0907', '0908', '0909', '0910', '0912', '0913', 
            '0914', '0918', '0919', '0920', '0921', '0928', '0929', '0930', 
            '0938', '0939', '0946', '0947', '0948', '0949', '0950', '0951',
            '0961', '0962', '0963', '0970', '0971', '0981', '0989', '0992',
            '0998', '0999',
            // DITO prefixes
            '0895', '0896', '0897', '0898', '0991', '0992', '0993', '0994'
        ];
        
        if (!validAreaCodes.includes(areaCode)) {
            return 'Phone number prefix is not a valid Philippine mobile prefix';
        }
        
        return null; // Phone number is valid
    };

    // Handle birthday change - calculate age and youth_age_gap
    const handleBirthdayChange = (birthday) => {
        // Clear previous errors
        setAgeError('');
        
        // Update birthday field
        onChange('birthday', birthday);
        
        if (birthday) {
            const calculatedAge = calculateAge(birthday);
            if (calculatedAge !== null) {
                const ageStr = calculatedAge.toString();
                
                // Validate age for registration (16-30 years)
                const validationError = validateAgeForRegistration(ageStr);
                
                if (validationError) {
                    // Age is not valid for registration (16-30)
                    setAgeError(validationError);
                    // Still show the calculated age for transparency
                    onChange('age', ageStr);
                    const youthAgeGap = getYouthAgeGap(calculatedAge);
                    onChange('youth_age_gap', youthAgeGap);
                } else {
                    // Age is valid (16-30), update all fields normally
                    onChange('age', ageStr);
                    const youthAgeGap = getYouthAgeGap(calculatedAge);
                    onChange('youth_age_gap', youthAgeGap);
                }
            }
        } else {
            // Birthday cleared
            onChange('age', '');
            onChange('youth_age_gap', '');
        }
    };

    // Handle phone number change with validation
    const handlePhoneChange = (phone) => {
        // Clear previous phone errors
        setPhoneError('');
        
        // Update phone field
        onChange('contact_number', phone);
        
        // Validate if phone is provided (optional field)
        if (phone) {
            const phoneValidationError = validatePhoneNumber(phone);
            if (phoneValidationError) {
                setPhoneError(phoneValidationError);
            }
        }
    };

    // Format phone number as user types
    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters
        const phoneNumber = value.replace(/\D/g, '');
        
        // Format: 09XX XXX XXXX
        if (phoneNumber.length <= 4) {
            return phoneNumber;
        } else if (phoneNumber.length <= 7) {
            return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
        } else {
            return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 11)}`;
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            {/* Age validation error alert - shows when age is outside 16-30 range */}
            {ageError && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={() => setAgeError('')}
                >
                    {ageError}
                </Alert>
            )}

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
                        error={!!errors.birthday || !!errors.age || !!ageError}
                        helperText={errors.birthday || errors.age || ageError || "Select your birthday (you must be between 16-30 years old)"}
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
                        error={!!ageError}
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

                    {/* Contact Number with validation and formatting */}
                    <TextField
                        fullWidth
                        label="Contact Number"
                        type="tel"
                        value={formData.contact_number || ''}
                        onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            handlePhoneChange(formatted);
                        }}
                        error={!!errors.contact_number || !!phoneError}
                        helperText={
                            phoneError || 
                            errors.contact_number || 
                            "Optional: Enter a valid Philippine mobile number (e.g., 0912 345 6789)"
                        }
                        placeholder="0912 345 6789"
                        inputProps={{
                            maxLength: 13, // 4 + space + 3 + space + 4 = 13 characters
                            pattern: "^(09|08|07)\\d{2}[\\s]?\\d{3}[\\s]?\\d{4}$"
                        }}
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