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
    const [error, setError] = useState(null);

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

    return {
        isAuthorized,
        accountName,
        genderInfo,
        demoSurvey,
        meetingHousehold,
        loadingProfile,
        error,
        fetchProfile,
    };
};

export default useProfile;
