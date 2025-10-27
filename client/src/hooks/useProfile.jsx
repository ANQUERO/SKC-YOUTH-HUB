import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useProfile = () => {
    const { isSkYouth } = useAuthContext();
    const isAuthorized = isSkYouth;

    // Profile states
    const [accountName, setAccountName] = useState("");
    const [genderInfo, setGenderInfo] = useState(null);
    const [demoSurvey, setDemoSurvey] = useState(null);
    const [meetingHousehold, setMeetingHousehold] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [error, setError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


    const fetchProfile = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
            const res = await axiosInstance.get("/profile");
            const { accountName, genderInfo, demoSurvey, meetingHousehold } =
                res.data.data;

            setAccountName(accountName || "");
            setGenderInfo(genderInfo || null);
            setDemoSurvey(demoSurvey || null);
            setMeetingHousehold(meetingHousehold || null);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoadingProfile(false);
        }
    };

    const updateProfile = async (profileData) => {
        setUpdatingProfile(true);
        setUpdateError(null);
        setSuccessMessage(null);
        
        try {
            const res = await axiosInstance.put("/profile", profileData);
            
            setSuccessMessage(res.data.message || "Profile updated successfully");
            
            // Refresh profile data after successful update
            await fetchProfile();
            
            return res.data;
        } catch (err) {
            console.error("Update profile error:", err);
            const errorMessage = err.response?.data?.message || "Failed to update profile";
            setUpdateError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setUpdatingProfile(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setUpdateError(null);
        setSuccessMessage(null);
    };

    return {
        isAuthorized,
        accountName,
        genderInfo,
        demoSurvey,
        meetingHousehold,
        loadingProfile,
        updatingProfile,
        error,
        updateError,
        successMessage,
        fetchProfile,
        updateProfile,
        clearMessages,
    };
};

export default useProfile;
