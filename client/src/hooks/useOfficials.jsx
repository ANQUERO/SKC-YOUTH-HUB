import { useState } from 'react';
import axiosInstance from '@lib/axios';
import { useAuthContext } from '@context/AuthContext';

const useOfficials = () => {
    const { authUser } = useAuthContext();

    const [officials, setOfficials] = useState([]);
    const [official, setOfficial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all officials (admins)
    const fetchOfficials = async () => {
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

    // Fetch a specific official by ID
    const fetchOfficialById = async (admin_id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/admin/${admin_id}`);
            setOfficial(response.data.data || null);
        } catch (err) {
            console.error('Error fetching official:', err);
            setError(err?.response?.data?.message || 'Failed to fetch official');
        } finally {
            setLoading(false);
        }
    };

    // Optional: Update official (e.g. for profile settings)
    const updateOfficial = async (admin_id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`/admin/${admin_id}`, updatedData);
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
