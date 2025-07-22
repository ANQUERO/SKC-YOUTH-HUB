import { useState } from 'react';
import axiosInstance from '@lib/axios.js'; // adjust if your axios path is different

const useSignupAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const signupAdmin = async (formData) => {
        setLoading(true);
        setErrors({});

        try {
            await axiosInstance.post('/auth/adminSignup', formData);
            return true;
        } catch (err) {
            if (err.response?.status === 400 && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        signupAdmin,
        loading,
        errors,
    };
};

export default useSignupAdmin;
