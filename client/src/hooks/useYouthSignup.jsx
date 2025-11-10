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
            const formDataToSend = new FormData();
            
            // Add all fields in flat structure (backend expects flat structure)
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('first_name', formData.first_name);
            formDataToSend.append('middle_name', formData.middle_name || '');
            formDataToSend.append('last_name', formData.last_name);
            formDataToSend.append('suffix', formData.suffix || '');
            formDataToSend.append('gender', formData.gender);
            // Normalize location fields to match backend validation (trim and ensure proper format)
            formDataToSend.append('region', formData.region?.trim() || '');
            formDataToSend.append('province', formData.province?.trim() || '');
            formDataToSend.append('municipality', formData.municipality?.trim() || '');
            formDataToSend.append('barangay', formData.barangay?.trim() || '');
            formDataToSend.append('purok_id', formData.purok_id || '');
            formDataToSend.append('age', formData.age || '');
            formDataToSend.append('contact_number', formData.contact_number || '');
            formDataToSend.append('birthday', formData.birthday || '');
            formDataToSend.append('civil_status', formData.civil_status);
            formDataToSend.append('youth_age_gap', formData.youth_age_gap || '');
            formDataToSend.append('youth_classification', formData.youth_classification);
            formDataToSend.append('educational_background', formData.educational_background);
            formDataToSend.append('work_status', formData.work_status);
            formDataToSend.append('registered_voter', formData.registered_voter);
            formDataToSend.append('registered_national_voter', formData.registered_national_voter);
            formDataToSend.append('vote_last_election', formData.vote_last_election);
            formDataToSend.append('attended', formData.attended);
            formDataToSend.append('times_attended', formData.times_attended || '');
            formDataToSend.append('reason_not_attend', formData.reason_not_attend || '');
            formDataToSend.append('household', formData.household || '');

            // Add file if it exists
            if (formData.attachment) {
                formDataToSend.append('attachment', formData.attachment);
            }

            const response = await axiosInstance.post('/auth/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Registration successful! Please check your email for verification.');
            return response.data;

        } catch (err) {
            console.error('Signup error:', err);
            
            // Handle validation errors object - always convert to string
            let errorMessage = 'Registration failed. Please check all required fields.';
            
            if (err.response?.data?.errors) {
                // Convert errors object to readable string
                const errorsObj = err.response.data.errors;
                if (typeof errorsObj === 'object' && errorsObj !== null) {
                    const errorMessages = Object.entries(errorsObj)
                        .map(([field, message]) => {
                            // Handle case where message might be an array or object
                            const msg = Array.isArray(message) 
                                ? message.join(', ') 
                                : typeof message === 'string' 
                                    ? message 
                                    : String(message);
                            return `${field}: ${msg}`;
                        })
                        .join(', ');
                    errorMessage = errorMessages || 'Validation failed. Please check all fields.';
                } else {
                    errorMessage = String(errorsObj);
                }
            } else if (err.response?.data?.message) {
                errorMessage = typeof err.response.data.message === 'string' 
                    ? err.response.data.message 
                    : String(err.response.data.message);
            } else if (err.response?.data?.error) {
                errorMessage = typeof err.response.data.error === 'string' 
                    ? err.response.data.error 
                    : String(err.response.data.error);
            } else if (err.message) {
                errorMessage = String(err.message);
            }
            
            // Ensure errorMessage is always a string
            setError(String(errorMessage));
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
            const response = await axiosInstance.post('/auth/reset-password-token', {
                token,
                newPassword
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
