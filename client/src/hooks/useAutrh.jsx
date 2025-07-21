import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@lib/axios.js';
import { useAuthContext } from '@context/AuthContext';


const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();


    const signin = async (credentials) => {
        setLoading(true);

        try {
            const { data } = await axios.post("/api/auth/signin", credentials);
            setAuthUser(data);
            navigate("/");
            console.log("Login", {
                description: "Successfully logged in!"
            });
        } catch (error) {
            const message = error?.response?.data?.message || "An error occurred during login";
            console.error("Login error:", error);
            console.log("Login Error", {
                description: message,
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };



    const signup = async (details) => {

    }

    const forgotPassword = async (details) => {

    }

    const logout = async () => {
        setLoading(true);

        try {
            await axios.post("api/auth/logout");
            setAuthUser(null);
            navigate("auth/login");


        } catch (error) {

        }

    }

    return {
        signin,
        loading
    };
};

export default useAuth;
