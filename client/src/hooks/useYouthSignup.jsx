import { useState } from 'react';
import axiosInstance from '@lib/axios';

const useYouthSignup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const signup = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add all form fields
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);
            submitData.append('first_name', formData.first_name);
            submitData.append('middle_name', formData.middle_name || '');
            submitData.append('last_name', formData.last_name);
            submitData.append('suffix', formData.suffix || '');
            submitData.append('gender', formData.gender);

            // Location data
            submitData.append('region', formData.region);
            submitData.append('province', formData.province);
            submitData.append('municipality', formData.municipality);
            submitData.append('barangay', formData.barangay);
            submitData.append('purok_id', formData.purok_id);

            // Demographics
            submitData.append('civil_status', formData.civil_status);
            submitData.append('youth_age_gap', formData.youth_age_gap);
            submitData.append('youth_classification', formData.youth_classification);
            submitData.append('educational_background', formData.educational_background);
            submitData.append('work_status', formData.work_status);

            // Survey
            submitData.append('registered_voter', formData.registered_voter);
            submitData.append('registered_national_voter', formData.registered_national_voter);
            submitData.append('vote_last_election', formData.vote_last_election);

            // Meeting Survey
            submitData.append('attended', formData.attended);
            submitData.append('times_attended', formData.times_attended || '');
            submitData.append('reason_not_attend', formData.reason_not_attend || '');

            // Household
            submitData.append('household', formData.household);

            // Add file attachment if exists
            if (formData.attachment) {
                submitData.append('attachment', formData.attachment);
            }

            const response = await axiosInstance.post('/auth/signup', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Registration successful! Please check your email for verification.');
            return response.data;

        } catch (err) {
            console.error('Signup error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Registration failed. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendVerificationEmail = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/send-verification', { email });
            setSuccess('Verification email sent successfully!');
            return response.data;
        } catch (err) {
            console.error('Send verification error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to send verification email. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (token) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/verify-email', { token });
            setSuccess('Email verified successfully!');
            return response.data;
        } catch (err) {
            console.error('Email verification error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Email verification failed. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            setSuccess('Password reset email sent successfully!');
            return response.data;
        } catch (err) {
            console.error('Forgot password error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to send password reset email. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                token,
                password: newPassword
            });
            setSuccess('Password reset successfully!');
            return response.data;
        } catch (err) {
            console.error('Reset password error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Password reset failed. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        signup,
        sendVerificationEmail,
        verifyEmail,
        forgotPassword,
        resetPassword,
        loading,
        error,
        success
    };
};

export default useYouthSignup;
