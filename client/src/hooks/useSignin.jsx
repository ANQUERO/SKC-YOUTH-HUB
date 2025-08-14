import { useState } from 'react';
import validate from 'validate.js';
import axiosInstance from '@lib/axios.js';
import { useAuthContext } from '@context/AuthContext';

const constraints = {
    email: {
        presence: { allowEmpty: false, message: '^A valid Email address is required' },
        email: { message: '^Please enter a valid email address' },
    },
    password: {
        presence: { allowEmpty: false, message: '^Password is required' },
        length: {
            minimum: 8,
            message: '^Password must be at least 8 characters',
        },
        format: {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: '^Password must include uppercase, lowercase, number, and special character',
        }
    },
};

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { setAuthUser, setActiveRole } = useAuthContext();

    const validateField = (fieldName, value) => {
        const result = validate({ [fieldName]: value }, { [fieldName]: constraints[fieldName] });
        if (result) {
            setErrors((prev) => ({ ...prev, [fieldName]: result[fieldName][0] }));
        } else {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[fieldName];
                return updated;
            });
        }
    };

    const login = async (email, password) => {

        const validationErrors = validate({ email, password }, constraints);

        if (validationErrors) {
            const formattedErrors = Object.fromEntries(
                Object.entries(validationErrors).map(([field, messages]) => [field, messages[0]])
            );
            setErrors(formattedErrors);
            return { success: false, user: null };
        }

        setLoading(true);
        setErrors({});
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            const loggedInUser = res.data.user;

            // Ensure role is always an array
            const roles = Array.isArray(loggedInUser.role)
                ? loggedInUser.role
                : loggedInUser.role
                    ? [loggedInUser.role]
                    : [];

            localStorage.setItem('auth-user', JSON.stringify(loggedInUser));
            setAuthUser(loggedInUser);

            if (roles.length > 0) {
                setActiveRole(roles[0]);
                localStorage.setItem('active-role', roles[0]);
            }

            return { success: true, user: loggedInUser };
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.status === 400 || err.response?.status === 401) {
                setErrors(err.response.data.errors || { general: 'Invalid credentials' });
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' });
            }
            return { success: false, user: null };
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, errors, validateField };
};

export default useLogin;