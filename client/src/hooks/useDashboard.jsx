import React, { useState, useCallback } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useDashboard = () => {
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

    const [dashboardData, setDashboardData] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const runAuthorized = useCallback(async (callback) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            await callback();
            setSuccess("Fetched successfully");
        } catch (_) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [isAuthorized]);

    /** FETCH TOTAL VOTERS */
    const fetchTotalVoters = useCallback(() => {
        return runAuthorized(async () => {
            const res = await axiosInstance.get('/dashboard/v1');
            setDashboardData(prev => ({
                ...prev,
                registered_voters: res.data.registered_voters,
                unregistered_voters: res.data.unregistered_voters,
                total_youths: res.data.total_youths,
            }));
        });
    }, [runAuthorized]);

    /** FETCH GENDER STATS */
    const fetchTotalGender = useCallback(() => {
        return runAuthorized(async () => {
            const res = await axiosInstance.get('/dashboard/v2');
            setDashboardData(prev => ({
                ...prev,
                gender_stats: res.data.data,
            }));
        });
    }, [runAuthorized]);

    /** FETCH PUROK RESIDENTS */
    const fetchResidentsPerPurok = useCallback(() => {
        return runAuthorized(async () => {
            const res = await axiosInstance.get('/dashboard/v3');
            setDashboardData(prev => ({
                ...prev,
                purok_stats: res.data.data,
            }));
        });
    }, [runAuthorized]);

    /** FETCH RECENT ACTIVITY */
    const fetchRecentActivity = useCallback((limit = 20) => {
        return runAuthorized(async () => {
            const res = await axiosInstance.get(`/dashboard/activity?limit=${limit}`);
            setDashboardData(prev => ({
                ...prev,
                recent_activity: res.data.data,
            }));
        });
    }, [runAuthorized]);

    /** RETURN API */
    return {
        dashboardData,
        loading,
        error,
        success,
        setDashboardData,
        fetchTotalVoters,
        fetchTotalGender,
        fetchResidentsPerPurok,
        fetchRecentActivity
    };
};

export default useDashboard;
