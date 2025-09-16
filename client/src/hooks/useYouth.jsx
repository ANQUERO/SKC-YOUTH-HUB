import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useYouth = () => {
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

    const [youthData, setYouthData] = useState([]);
    const [youth, setYouth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSucces] = useState(null);
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
            setYouthData({ youth: res.data.youth });
        } catch (err) {
            console.error("Fetch youth error:", err);
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
            console.error("Fetch youth detail error:", err);
            setError(err.response?.data?.message || "Failed to fetch youth details");
        } finally {
            setLoading(false);
        }
    };

    const storeYouth = async (formData) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);
        setSucces(null);

        try {
            const res = await axiosInstance.post('/youth/', formData);
            if (res.data?.youth_id) {
                setSucces("Youth added successfully");
                return res.data;
            } else {
                setError("Failed to create youth");
            }
        } catch (error) {
            console.error("Store youth error", error);
            setError(error.response?.data?.message || "Failed to store youth");
        } finally {
            setLoading(false);
        }
    };

    return {
        youthData,
        youth,
        loading,
        error,
        success,
        fetchYouths,
        fetchYouth,
        storeYouth
    };
};

export default useYouth;
