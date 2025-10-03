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
import styles from '@styles/signup.module.scss';

const LocationStep = ({ formData, errors, onChange, puroks, loading, error }) => {
    return (
        <Box className={styles.locationContainer}>
            <Typography variant="h6" gutterBottom className={styles.title}>
                Location Information
            </Typography>

            <Alert severity="info" className={styles.infoAlert}>
                <Typography variant="body2">
                    Location details are automatically set for Cordova, Cebu. Please select your purok from the dropdown below.
                </Typography>
            </Alert>

            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    <Typography variant="body2">{error}</Typography>
                </Alert>
            )}

            <Grid container spacing={3} className={styles.formGrid}>
                {/* Region - Read Only */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Region"
                        value={formData.region}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Province */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Province"
                        value={formData.province}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Municipality */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Municipality"
                        value={formData.municipality}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>

                {/* Barangay */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Barangay"
                        value={formData.barangay}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        helperText="Automatically set"
                    />
                </Grid>
            </Grid>

            {/* Purok Dropdown - Moved to bottom with max-width */}
            <Box className={styles.purokContainer}>
                <FormControl fullWidth error={!!errors.purok_id} required className={styles.purokSelect}>
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
                        <Typography variant="caption" color="error" className={styles.errorText}>
                            {errors.purok_id}
                        </Typography>
                    )}
                </FormControl>
            </Box>

            {/* Location Preview */}
            <Box className={styles.previewBox}>
                <Typography variant="body2" color="text.secondary" className={styles.previewText}>
                    <LocationOn fontSize="small" />
                    Your location: {formData.region}, {formData.province}, {formData.municipality}, {formData.barangay}
                    {formData.purok_id && puroks && (
                        <span> - {puroks.find((p) => p.purok_id === formData.purok_id)?.name}</span>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default LocationStep;