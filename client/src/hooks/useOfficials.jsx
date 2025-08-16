import { useState } from 'react';
import axiosInstance from '@lib/axios';
import { useAuthContext } from '@context/AuthContext';

const useOfficials = () => {
    const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();

    const [officials, setOfficials] = useState([]);
    const [official, setOfficial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAuthorized = isSkNaturalAdmin || isSkSuperAdmin;

    // Fetch all officials (admins)
    const fetchOfficials = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access")
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/admin');
            setOfficials(response.data.data || []);
        } catch (err) {
            console.error('Error fetching officials:', err);
            setError(err?.response?.data?.message || 'Failed to fetch officials');
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficialById = async (offial_id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/admin/${offial_id}`);
            setOfficial(response.data.data || null);
        } catch (err) {
            console.error('Error fetching official:', err);
            setError(err?.response?.data?.message || 'Failed to fetch official');
        } finally {
            setLoading(false);
        }
    };

    const updateOfficial = async (offial_id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`/admin/${offial_id}`);
            setOfficial(response.data.data);
            return response.data.data;
        } catch (err) {
            console.error('Error updating official:', err);
            setError(err?.response?.data?.message || 'Failed to update official');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        authUser,
        officials,
        official,
        loading,
        error,
        fetchOfficials,
        fetchOfficialById,
        updateOfficial,
    };
};

export default useOfficials;
