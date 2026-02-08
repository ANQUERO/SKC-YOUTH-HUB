import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@lib/axios";
import { AuthContextProvider } from "@context/AuthContext";

const useCurrentUser = () => {
  const { authUser, activeRole } = AuthContextProvider();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentUserData = useCallback(async () => {
    if (!authUser) {
      setUserData(null);
      setProfilePicture(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/profile");
      if (response.data.status === "Success") {
        const data = response.data.data;

        if (activeRole === "youth") {
          const accountName = data.accountName || {};
          const name =
            `${accountName.first_name || ""} ${accountName.middle_name || ""} ${accountName.last_name || ""}`.trim();

          setUserData({
            id: accountName.youth_id,
            name: name || "Youth Member",
            email: accountName.email,
            profilePicture: accountName.profile_picture,
            userType: "youth",
            verified: accountName.verified,
            // Store the raw data for updates
            rawData: {
              accountName: accountName,
              genderInfo: data.genderInfo,
              demoSurvey: data.demoSurvey,
              meetingHousehold: data.meetingHousehold,
            },
          });
          setProfilePicture(accountName.profile_picture);
        } else {
          const account = data.account || {};
          const name = data.name || {};
          const fullName =
            `${name.first_name || ""} ${name.middle_name || ""} ${name.last_name || ""}`.trim();

          setUserData({
            id: account.official_id,
            name: fullName || "Official",
            email: account.email,
            profilePicture: account.profile_picture,
            userType: "official",
            role: account.role,
            position: account.official_position,
            isActive: account.is_active,
            // Store the raw data for updates
            rawData: {
              account: account,
              name: name,
              info: data.info,
            },
          });
          setProfilePicture(account.profile_picture);
        }
      }
    } catch (err) {
      console.error("Error fetching current user data:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [authUser, activeRole]);

  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]); // Now this is stable

  const updateProfilePicture = useCallback((newPictureUrl) => {
    setProfilePicture(newPictureUrl);
    setUserData((prev) =>
      prev
        ? {
            ...prev,
            profilePicture: newPictureUrl,
          }
        : null,
    );
  }, []); // No dependencies needed

  const updateUserData = useCallback(
    async (updateData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.put("/profile", updateData);
        if (response.data.status === "Success") {
          // Refresh user data after successful update
          await fetchCurrentUserData();
          return { success: true, message: "Profile updated successfully" };
        } else {
          setError("Failed to update profile");
          return { success: false, message: "Failed to update profile" };
        }
      } catch (err) {
        console.error("Error updating user data:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [fetchCurrentUserData],
  );

  return {
    userData,
    profilePicture,
    loading,
    error,
    refetch: fetchCurrentUserData,
    updateProfilePicture,
    updateUserData,
  };
};

export default useCurrentUser;
