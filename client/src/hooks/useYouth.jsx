import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useYouth = () => {
    const { isSkAdmin, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkAdmin || isSkSuperAdmin || isSkNaturalAdmin;

    const [youthData, setYouthData] = useState(null);
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
            const res = await axiosInstance.get("/youth"); // adjust if needed
            const { data } = res.data;

            setYouthData(data); // 🔁 store full response: { youth, name, survey, ... }
        } catch (err) {
            console.error("❌ Fetch youth error:", err);
            setError(err.response?.data?.message || "Failed to fetch youth data");
        } finally {
            setLoading(false);
        }
    };


    const fetchYouth = (youth_id) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return
        }

    }

    return {
        youthData,
        loading,
        error,
        fetchYouths,
    };
};

export default useYouth;
