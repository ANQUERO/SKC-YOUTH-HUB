import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
    IconButton,
    Typography,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const BasicInfoStep = ({ formData, errors, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                Basic Information
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Please provide your basic personal information.
            </Typography>

            <Grid container spacing={3}>

                {/* First Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={formData.first_name}
                        onChange={(e) => onChange('first_name', e.target.value)}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                        required
                        autoComplete="given-name"
                    />
                </Grid>

                {/* Middle Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Middle Name"
                        value={formData.middle_name}
                        onChange={(e) => onChange('middle_name', e.target.value)}
                        autoComplete="additional-name"
                    />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.last_name}
                        onChange={(e) => onChange('last_name', e.target.value)}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        required
                        autoComplete="family-name"
                    />
                </Grid>

                {/* Suffix */}
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Suffix (Jr., Sr., III, etc.)"
                        value={formData.suffix}
                        onChange={(e) => onChange('suffix', e.target.value)}
                        autoComplete="honorific-suffix"
                    />
                </Grid>

                {/* Gender */}
                <Grid item xs={12}>
                    <FormControl component="fieldset" error={!!errors.gender} required>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                            row
                            value={formData.gender}
                            onChange={(e) => onChange('gender', e.target.value)}
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                        {errors.gender && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                {errors.gender}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BasicInfoStep;
