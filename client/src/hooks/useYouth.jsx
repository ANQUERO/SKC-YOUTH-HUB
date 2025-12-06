import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useYouth = () => {
    const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
    const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

    const [youthData, setYouthData] = useState([]); // Change to array
    const [youth, setYouth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
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
            console.log("API Response:", res.data); // Debug log
            
            // The backend returns { youth: [...] }
            // Extract the array and set it directly
            setYouthData(res.data.youth || []);
        } catch (err) {
            console.error("Fetch youth error:", err);
            setError(err.response?.data?.message || "Failed to fetch youth data");
        } finally {
            setLoading(false);
        }
    };

    const fetchYouth = async (youth_id) => {
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
        setSuccess(null);

        try {
            const res = await axiosInstance.post('/youth/', formData);
            if (res.data?.youth_id) {
                setSuccess("Youth added successfully");
                // Refresh the list
                await fetchYouths();
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

    const updateYouth = async (youth_id, updateData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axiosInstance.put(`/youth/${youth_id}`, updateData);
            
            if (res.data.status === "Success") {
                setSuccess("Youth profile updated successfully");
                
                // Update local youth data if we have it
                if (youth) {
                    setYouth(prevYouth => ({
                        ...prevYouth,
                        ...updateData,
                        name: updateData.name ? { ...prevYouth.name, ...updateData.name } : prevYouth.name,
                        location: updateData.location ? { ...prevYouth.location, ...updateData.location } : prevYouth.location,
                        info: updateData.info ? { ...prevYouth.info, ...updateData.info } : prevYouth.info,
                        demographics: updateData.demographics ? { ...prevYouth.demographics, ...updateData.demographics } : prevYouth.demographics,
                        survey: updateData.survey ? { ...prevYouth.survey, ...updateData.survey } : prevYouth.survey,
                        meetingSurvey: updateData.meetingSurvey ? { ...prevYouth.meetingSurvey, ...updateData.meetingSurvey } : prevYouth.meetingSurvey
                    }));
                }
                
                // Refresh the list
                await fetchYouths();
                
                return res.data;
            } else {
                setError(res.data.message || "Failed to update youth");
                return null;
            }
        } catch (error) {
            console.error("Update youth error:", error);
            setError(error.response?.data?.message || "Failed to update youth profile");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const destroyYouth = async (youth_id) => {
        if (!isAuthorized) {
            setError("Unauthorized access");
            return false;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axiosInstance.delete(`/youth/${youth_id}`);
            
            if (res.data.status === "Success") {
                setSuccess("Youth profile deleted successfully");
                
                // Update local youth data list
                setYouthData(prevData => 
                    prevData.filter(y => y.youth_id !== youth_id)
                );
                
                // Clear current youth if it's the one being deleted
                if (youth?.youth_id === youth_id) {
                    setYouth(null);
                }
                
                return true;
            } else {
                setError(res.data.message || "Failed to delete youth");
                return false;
            }
        } catch (error) {
            console.error("Delete youth error:", error);
            setError(error.response?.data?.message || "Failed to delete youth profile");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Helper function for partial updates
    const updateYouthField = async (youth_id, field, value) => {
        let updateData = {};
        
        // Handle different field structures
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            updateData[parent] = { [child]: value };
        } else {
            updateData[field] = value;
        }
        
        return await updateYouth(youth_id, updateData);
    };

    // Clear messages
    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        youthData, // Now this is an array
        youth,
        loading,
        error,
        success,
        fetchYouths,
        fetchYouth,
        storeYouth,
        updateYouth,
        destroyYouth,
        updateYouthField,
        clearMessages
    };
};

export default useYouth;