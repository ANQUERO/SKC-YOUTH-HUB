// src/hooks/useYouth.js
import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useYouth = () => {
    const { isSkAdmin, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkAdmin || isSkSuperAdmin || isSkNaturalAdmin;

    const [youthData, setYouthData] = useState([]);
    const [youth, setYouth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchYouths = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get("/youth");
            setYouthData(res.data.data);
        } catch (err) {
            console.error("❌ Fetch youth error:", err);
            setError(err.response?.data?.message || "Failed to fetch youth data");
        } finally {
            setLoading(false);
        }
    };

    const fetchYouth = async (youth_id) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get(`/youth/${youth_id}`);
            setYouth(res.data.data);
        } catch (err) {
            console.error("❌ Fetch youth detail error:", err);
            setError(err.response?.data?.message || "Failed to fetch youth details");
        } finally {
            setLoading(false);
        }
    };

    return {
        youthData,
        youth,
        loading,
        error,
        fetchYouths,
        fetchYouth,
    };
};

export default useYouth;
