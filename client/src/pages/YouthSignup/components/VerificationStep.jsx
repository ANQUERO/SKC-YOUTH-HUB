import React, { useRef, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    InputAdornment,
    Grid
} from '@mui/material';
import { CloudUpload, AttachFile, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

const VerificationStep = ({ formData, errors, onChange, isVerified, onVerified }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid file type (JPEG, PNG, or PDF)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            onChange('attachment', file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        onChange('attachment', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                Verification & Account Setup
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Please upload a document to verify your location, then provide your email and password to complete registration.
            </Typography>

            <Grid container spacing={3}>
                {/* File Upload Section */}
                <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, border: '2px dashed #ccc' }}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Location Validation Document
                        </Typography>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Please upload a document that validates your location in Cordova, Cebu.
                                This can be a barangay certificate, utility bill, or any official document
                                showing your address.
                            </Typography>
                        </Alert>

                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                onClick={handleUploadClick}
                                sx={{ mb: 2 }}
                            >
                                Choose File
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileChange}
                            />
                        </Box>

                        {selectedFile && (
                            <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <List dense>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" onClick={handleRemoveFile}>
                                                <Delete />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemIcon>
                                            <AttachFile />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={selectedFile.name}
                                            secondary={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        )}

                        {errors.attachment && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {errors.attachment}
                            </Typography>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                            Accepted formats: JPEG, PNG, PDF (Max size: 5MB)
                        </Typography>
                    </Paper>
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        autoComplete="email"
                    />
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => onChange('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        autoComplete="new-password"
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
                            )
                        }}
                    />
                </Grid>

                {/* Confirm Password */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => onChange('confirmPassword', e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        required
                        autoComplete="new-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    After submitting this form, you will receive an email verification link.
                    Please check your email and click the verification link to activate your account.
                </Typography>
            </Alert>
        </Box>
    );
};

export default VerificationStep;
