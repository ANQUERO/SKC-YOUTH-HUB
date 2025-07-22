import { useState } from 'react';
import axiosInstance from '@lib/axios.js';
import { useAuthContext } from '@context/AuthContext';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { setAuthUser, setActiveRole } = useAuthContext();

    const login = async (email, password) => {
        setLoading(true);
        setErrors({});
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            const loggedInUser = res.data.user;

            localStorage.setItem("auth-user", JSON.stringify(loggedInUser));

            setAuthUser(loggedInUser);

            if (loggedInUser.role?.length > 0) {
                setActiveRole(loggedInUser.role[0]);
                localStorage.setItem("active-role", loggedInUser.role[0]);
            }

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

    return { login, loading, errors };
};

export default useLogin;
