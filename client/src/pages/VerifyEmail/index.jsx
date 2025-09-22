import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Container
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import axiosInstance from '@lib/axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('No verification token provided');
            setLoading(false);
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const response = await axiosInstance.post('/auth/verify-email', { token });
            setSuccess(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Email verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                {loading ? (
                    <Box>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Verifying your email...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please wait while we verify your email address.
                        </Typography>
                    </Box>
                ) : success ? (
                    <Box>
                        <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom color="success.main">
                            Email Verified Successfully!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Your email has been verified. You can now log in to your account.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleContinue}
                            sx={{ minWidth: 200 }}
                        >
                            Continue to Login
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom color="error.main">
                            Verification Failed
                        </Typography>
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/signup')}
                            sx={{ minWidth: 200 }}
                        >
                            Back to Signup
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default VerifyEmail;
