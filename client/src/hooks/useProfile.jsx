import { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useProfile = () => {
    const { isSkYouth } = useAuthContext();
    const isAuthorized = isSkYouth;

    {/** Account/Name States */ }
    const [accountName, setAccountName] = useState([]);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [errorAccount, setErrorAcount] = useState(null);

    {/** Gedner/Info States */ }
    const [genderInfo, setGenderInfo] = useState([]);
    const [loadingGender, setLoadingGender] = useState(false);
    const [errorGender, setErrorGender] = useState(null);

    {/** Demo/Survey States */ }
    const [demoSurvey, setDemoSurvey] = useState([]);
    const [loadingDemo, setLoadingDemo] = useState(false);
    const [errorDemo, setErrorDemo] = useState(null);

    {/** Meeting/Household States */ }
    const [meetingHousehold, setMeetingHousehold] = useState([]);
    const [loadingMeeting, setLoadingMeeting] = useState(false);
    const [errorMeeting, setErrorMeeting] = useState(null);


    {/**Function for fetching Account/Name */ }
    const fetchAccountName = async () => {
        if (!isAuthorized) {
            setErrorAcount("Unauthorized access");
            return;
        }

        loadingAccount(true);
        errorAccount(null);

        try {
            const res = await axiosInstance.get('/profile/v1');
            setAccountName(res.data.data);
        } catch (error) {
            setErrorAcount(error.response?.data?.message || 'Failed to fetch Account/Name');
            throw error;
        } finally {
            setLoadingAccount(false);
        }
    };

    {/**Function for fetching Gender/Info */ }
    const fetchGenderInfo = async () => {
        if (!isAuthorized) {
            setErrorGender("Unauthorized access");
            return;
        }

        loadingGender(true);
        errorGender(null);

        try {
            const res = await axiosInstance.get('/profile/v2');
            setGenderInfo(res.data.data);
        } catch (error) {
            setErrorGender(error.response?.data?.message || 'Failed to fetch Gender/Info');
            throw error;
        } finally {
            setLoadingGender(false);
        }
    }

    {/**Function for fetching Demo/Survey */ }
    const fetchDemoSurvey = async () => {
        if (!isAuthorized) {
            setErrorDemo("Unauthorized access");
            return;
        }

        loadingDemo(true);
        errorDemo(null);

        try {
            const res = await axiosInstance.get('/profile/v3');
            setDemoSurvey(res.data.data);
        } catch (error) {
            setErrorDemo(error.response?.data?.message || 'Failed to fetch Demo/Survey')
            throw error;
        } finally {
            setLoadingDemo(false);
        }

    }

    {/**Function for fetching Meeting/Household */ }
    const fetchMeetingHoushold = async () => {
        if (!isAuthorized) {
            setErrorMeeting('Unauthorized access');
            return;
        }

        loadingMeeting(true);
        errorMeeting(null);

        try {
            const res = await axiosInstance.get('/profile/v4');
            setMeetingHousehold(res.data.data)
        } catch (error) {
            setErrorMeeting(error.response?.data?.message || 'Failed to fetch Meeting/Houshold');
            throw error;
        } finally {
            setLoadingMeeting(false);
        }
    }


    return {
        accountName,
        genderInfo,
        demoSurvey,
        meetingHousehold,
        fetchAccountName,
        fetchDemoSurvey,
        fetchGenderInfo,
        fetchMeetingHoushold,
        errorAccount,
        errorDemo,
        errorGender,
        errorMeeting,
        loadingAccount,
        loadingDemo,
        loadingGender,
        loadingMeeting
    };
};

export default useProfile;