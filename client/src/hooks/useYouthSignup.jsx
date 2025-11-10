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
            // Structure the data as nested objects to match backend expectations
            const requestData = {
                email: formData.email,
                password: formData.password,
                name: {
                    first_name: formData.first_name,
                    middle_name: formData.middle_name || '',
                    last_name: formData.last_name,
                    suffix: formData.suffix || ''
                },
                location: {
                    region: formData.region,
                    province: formData.province,
                    municipality: formData.municipality,
                    barangay: formData.barangay,
                    purok_id: formData.purok_id || null
                },
                gender: {
                    gender: formData.gender
                },
                info: {
                    age: formData.age,
                    contact: formData.contact_number || '',
                    birthday: formData.birthday || ''
                },
                demographics: {
                    civil_status: formData.civil_status,
                    youth_age_gap: formData.youth_age_gap,
                    youth_classification: formData.youth_classification,
                    educational_background: formData.educational_background,
                    work_status: formData.work_status
                },
                survey: {
                    registered_voter: formData.registered_voter,
                    registered_national_voter: formData.registered_national_voter,
                    vote_last_election: formData.vote_last_election
                },
                meetingSurvey: {
                    attended: formData.attended,
                    times_attended: formData.times_attended || '',
                    reason_not_attend: formData.reason_not_attend || ''
                },
                household: {
                    household: formData.household
                }
            };

            console.log('Sending data:', requestData);

            const response = await axiosInstance.post('/auth/signup', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccess('Registration successful! Please check your email for verification.');
            return response.data;

        } catch (err) {
            console.error('Signup error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Registration failed. Please check all required fields.';
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
