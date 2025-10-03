import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link,
    CircularProgress,
    Card,
    CardContent,
    Container
} from '@mui/material';
import { ArrowBack, Email } from '@mui/icons-material';

import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';
import axiosInstance from '@lib/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: token, 3: success
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSendResetEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
            setStep(2);

            // In development, show the token
            if (response.data.resetToken) {
                setToken(response.data.resetToken);
                setMessage(`${response.data.message} (Development: Use this token: ${response.data.resetToken})`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/reset-password-token', {
                token,
                newPassword
            });
            setMessage(response.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Card elevation={3} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h4" gutterBottom>
                                    Forgot Password?
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {message && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {message}
                                </Alert>
                            )}

                            <form onSubmit={handleSendResetEmail}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading || !email}
                                    sx={{ mb: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Link component={RouterLink} to="/login" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <ArrowBack fontSize="small" />
                                        Back to Sign In
                                    </Link>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <Card elevation={3} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="h4" gutterBottom>
                                    Reset Your Password
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Enter the reset token and your new password.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {message && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    {message}
                                </Alert>
                            )}

                            <form onSubmit={handleResetPassword}>
                                <TextField
                                    fullWidth
                                    label="Reset Token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                    helperText="Check your email for the reset token"
                                />

                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                    helperText="Minimum 6 characters"
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading || !token || !newPassword || !confirmPassword}
                                    sx={{ mb: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => setStep(1)}
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mx: 'auto' }}
                                    >
                                        <ArrowBack fontSize="small" />
                                        Back to Email
                                    </Link>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 3:
                return (
                    <Card elevation={3} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" gutterBottom color="success.main">
                                    Password Reset Successful!
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Your password has been reset successfully. You can now sign in with your new password.
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                component={RouterLink}
                                to="/signin"
                                sx={{ mb: 2 }}
                            >
                                Go to Sign In
                            </Button>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className={style.container}>
            {/* LEFT SIDE */}
            <div className={style.left}>
                <div className={style.text}>
                    <img src={Logo} alt="SK Logo" className={style.logo} />
                    <h1 className={style.title}>Catarman community</h1>
                    <p className={style.tagline}>
                        Our philosophy is simple: transparency, engagement, and accountability.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className={style.right}>
                <Container maxWidth="sm">
                    {renderStepContent()}
                </Container>
            </div>
        </div>
    );
};

export default ForgotPassword;