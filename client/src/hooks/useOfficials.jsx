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
    setLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.get('/official');
        
        // Handle different response structures
        if (response.data && response.data.data) {
            setOfficials(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
            setOfficials(response.data);
        } else if (response.data && response.data.officials) {
            setOfficials(response.data.officials);
        } else {
            setOfficials([]);
            setError('Invalid response format from server');
        }
    } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch officials');
    } finally {
        setLoading(false);
    }
};

    const fetchOfficialById = async (official_id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/official/${official_id}`);
            
            
            const data = response.data?.data || response.data?.official || null;
            setOfficial(data);
        } catch (err) {
            console.error('Error fetching official:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to fetch official');
        } finally {
            setLoading(false);
        }
    };

    const updateOfficial = async (official_id, updateData) => { // Added updateData parameter
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(`/official/${official_id}`, updateData);
            
            // Update the officials list with the updated data
            setOfficials(prev => prev.map(o => 
                o.official_id === official_id ? { ...o, ...updateData } : o
            ));
            
            // Update the current official if it's the same one
            if (official?.official_id === official_id) {
                setOfficial(prev => ({ ...prev, ...updateData }));
            }
            
            return response.data;
        } catch (err) {
            console.error('Error updating official:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to update official');
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
        isAuthorized,
    };
};

export default useOfficials;