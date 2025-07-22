import { useState } from 'react';
import axiosInstance from '@lib/axios.js';


const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setErrors({});
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            const loggedInUser = res.data.user;
            setUser(loggedInUser);
            return { success: true, user: loggedInUser };
        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                setErrors(err.response.data.errors || { general: "Invalid credentials" });
            } else {
                setErrors({ general: "Something went wrong. Please try again." });
            }
            return { success: false, user: null };
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, errors, user };
};

export default useLogin;
