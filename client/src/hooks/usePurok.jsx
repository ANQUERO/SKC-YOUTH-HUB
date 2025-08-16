import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";


const usePurok = () => {
    const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const [puroks, setPuroks] = useState([]);
    const [purok, setPurok] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

    const fetchPuroks = async () => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get('/purok');
            setPuroks(res.data.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch puroks");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchPurok = async (purok_id) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.get(`/purok/${purok_id}`);
            setPurok(res.data.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch purok");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createPurok = async (name) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.post("/purok", { name });
            setPuroks((prev) => [...prev, res.data.data]);
            return res.data.data;
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create purok");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updatePurok = async (purok_id, name) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.put(`/purok/${purok_id}`, { name });
            setPuroks((prev) =>
                prev.map((p) => (p.purok_id === purok_id ? res.data.data : p))
            );
            return res.data.data;
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update purok");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deletePurok = async (purok_id) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.delete(`/purok/${purok_id}`);
            setPuroks((prev) => prev.filter((p) => p.purok_id !== purok_id));
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete purok");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    return {
        authUser,
        puroks,
        purok,
        loading,
        error,
        fetchPuroks,
        fetchPurok,
        createPurok,
        updatePurok,
        deletePurok
    };
};

export default usePurok;