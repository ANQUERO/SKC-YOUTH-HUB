import { useState } from 'react';
import axiosInstance from '@lib/axios';
import { useAuthContext } from '@context/AuthContext';

const useVerification = () => {
    const { isSkAdmin, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkAdmin || isSkSuperAdmin || isSkNaturalAdmin;
    const [youthData, setYouthData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const fetchYouthDetails = async () => {
        if (!isAuthorized) {
            setError("Unathorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get("/unverified")
            setYouthData({ youth: res.data.youth });
        } catch (error) {
            console.error("Fetch yoth error", err);
            setError(err.response?.data?.message || "Failed to fetch youth data");
        } finally {
            setLoading(false);
        }
    };


    return {
        youthData,
        setYouthData,
        loading,
        error,
        fetchYouthDetails
    };
}
export default useVerification;