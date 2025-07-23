import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '@lib/axios.js';


export const useLogout = () => {
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        try {
            await axiosInstance.post("/auth/logout");

            localStorage.removeItem("auth-user");
            sessionStorage.removeItem("auth-user");

            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [navigate]);

    return logout;
};
