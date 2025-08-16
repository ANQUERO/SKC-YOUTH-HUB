import { useState } from 'react';
import axiosInstance from '@lib/axios';
import { useAuthContext } from '@context/AuthContext';

const useYouthAdmin = () => {
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

    const [youthData, setYouthData] = useState([]);
    const [youthDetails, setYouthDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch unverified youth signups
    const fetchUnverifiedYouths = async () => {
        if (!isAuthorized) return setError("Unauthorized access");

        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get("/unverified");
            setYouthData(res.data.youth || []);
        } catch (err) {
            console.error("Fetch unverified error", err);
            setError(err.response?.data?.message || "Failed to fetch unverified youth");
        } finally {
            setLoading(false);
        }
    };

    // Fetch deleted youth signups
    const fetchDeletedYouths = async () => {
        if (!isAuthorized) return setError("Unauthorized access");

        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get("/deleted");
            setYouthData(res.data.data || []);
        } catch (err) {
            console.error("Fetch deleted error", err);
            setError(err.response?.data?.message || "Failed to fetch deleted youth");
        } finally {
            setLoading(false);
        }
    };

    const fetchYouthDetails = async (youth_id) => {
        if (!isAuthorized) return setError("Unauthorized access");

        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get(`/details/${youth_id}`);
            setYouthDetails(res.data.data || null);
        } catch (err) {
            console.error("Fetch details error", err);
            setError(err.response?.data?.message || "Failed to fetch youth details");
        } finally {
            setLoading(false);
        }
    };

    const verifyYouth = async (youth_id) => {
        if (!isAuthorized) return setError("Unauthorized access");

        setLoading(true);
        setError(null);
        try {
            await axiosInstance.put(`/verify/${youth_id}`);
            setYouthData(prev =>
                prev.map(youth =>
                    youth.youth_id === youth_id ? { ...youth, verified: true } : youth
                )
            );
        } catch (err) {
            console.error("Verification error", err);
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const deleteSignup = async (youth_id) => {
        if (!isAuthorized) return setError("Unauthorized access");

        setLoading(true);
        setError(null);
        try {
            await axiosInstance.delete(`/delete/${youth_id}`);
            setYouthData(prev => prev.filter(youth => youth.youth_id !== youth_id));
        } catch (err) {
            console.error("Delete error", err);
            setError(err.response?.data?.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        youthData,
        youthDetails,
        loading,
        error,
        fetchUnverifiedYouths,
        fetchDeletedYouths,
        fetchYouthDetails,
        verifyYouth,
        deleteSignup
    };
};

export default useYouthAdmin;
