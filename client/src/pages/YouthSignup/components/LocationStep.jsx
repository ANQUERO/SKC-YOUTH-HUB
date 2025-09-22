import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
    Grid
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const LocationStep = ({ formData, errors, onChange, puroks, loading, error }) => {
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                Location Information
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    Location details are automatically set for Cordova, Cebu. Please select your purok from the dropdown below.
                </Typography>
            </Alert>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Region - Read Only */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Region"
                        value={formData.region}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Province - Read Only */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Province"
                        value={formData.province}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Municipality - Read Only */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Municipality"
                        value={formData.municipality}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Barangay - Read Only */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Barangay"
                        value={formData.barangay}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Purok - User Selectable */}
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.purok_id} required>
                        <InputLabel>Purok</InputLabel>
                        <Select
                            value={formData.purok_id}
                            onChange={(e) => onChange('purok_id', e.target.value)}
                            label="Purok"
                        >
                            {loading ? (
                                <MenuItem disabled>Loading puroks...</MenuItem>
                            ) : puroks && puroks.length > 0 ? (
                                puroks.map((purok) => (
                                    <MenuItem key={purok.purok_id} value={purok.purok_id}>
                                        {purok.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No puroks available</MenuItem>
                            )}
                        </Select>
                        {errors.purok_id && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                {errors.purok_id}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" />
                    Your location: {formData.region}, {formData.province}, {formData.municipality}, {formData.barangay}
                    {formData.purok_id && puroks && (
                        <span> - {puroks.find(p => p.purok_id === formData.purok_id)?.name}</span>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default LocationStep;
