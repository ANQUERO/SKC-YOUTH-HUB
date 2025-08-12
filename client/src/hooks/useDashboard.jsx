import React, { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";


const useDashboard = () => {
    const { isSkAdmin, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkAdmin || isSkSuperAdmin || isSkNaturalAdmin;

    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSucces] = useState(null);
    const [error, setError] = useState(null);


    const fetchTotalVoters = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        };

        setLoading(true);
        setSucces(null);
        setError(null);

        try {
            const res = await axiosInstance.get('/dashboard/v1');
            setDashboardData(prev => ({
                ...prev,
                registered_voters: res.data.registered_voters,
                unregistered_voters: res.data.unregistered_voters,
                total_youths: res.data.total_youths,
            }));
            setSucces('Fetched successfully');
        } catch (error) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }

    const fetchTotalGender = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        };

        setLoading(true);
        setSucces(null);
        setError(null);

        try {
            const res = await axiosInstance.get('/dashboard/v2');
            setDashboardData(prev => ({
                ...prev,
                gender_stats: res.data.data
            }));
            setSucces('Fetched successfully');
        } catch (error) {
            setError("Failed to fetch data");

        } finally {
            setLoading(false);
        }
    }

    const fetchResidentsPerPurok = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        };

        setLoading(true);
        setSucces(null);
        setError(null);

        try {
            const res = await axiosInstance.get('/dashboard/v3');
            setDashboardData(prev => ({
                ...prev,
                purok_stats: res.data.data
            }));
            setSucces('Fetched successfully');
        } catch (error) {
            setError("Failed to fetch data");

        } finally {
            setLoading(false);
        }
    }



    return {
        setDashboardData,
        dashboardData,
        loading,
        error,
        success,
        fetchTotalVoters,
        fetchTotalGender,
        fetchResidentsPerPurok
    }

}

export default useDashboard