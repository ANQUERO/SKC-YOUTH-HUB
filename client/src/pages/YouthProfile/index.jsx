import React, { useEffect, useState, useCallback } from "react";
import style from "@styles/profile.module.scss";
import useProfile from "@hooks/useProfile";
import useCurrentUser from "@hooks/useCurrentUser";
import { ProfileNavbar } from "Components/Navbar";
import ProfilePictureUpload from "@components/ProfilePictureUpload";
import ProfileEditModal from "@components/ProfileEditModal";
import { Button } from "@mui/material";
import { Edit } from "@mui/icons-material";

const YouthProfile = () => {
  const {
    fetchProfile,
    updateProfile,
    accountName,
    genderInfo,
    demoSurvey,
    meetingHousehold,
    loadingProfile,
    updatingProfile,
    error,
    updateError,
    successMessage,
  } = useProfile();

  const { userData, profilePicture, updateProfilePicture } = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Use useCallback prevent unnecessary recreations
  const handleProfilePictureUpdate = useCallback(
    (newPictureUrl) => {
      updateProfilePicture(newPictureUrl);
    },
    [updateProfilePicture]
  );

  // Handle profile update from the modal
  const handleProfileUpdate = useCallback(async (updateData) => {
    try {
      await updateProfile(updateData);
      // Modal will handle closing and any success/error messages
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  }, [updateProfile]);

  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array since fetchProfile should be stable

  useEffect(() => {
    // Only update if we have a profile picture and it's different from current
    if (
      accountName?.profile_picture &&
      accountName.profile_picture !== profilePicture
    ) {
      handleProfilePictureUpdate(accountName.profile_picture);
    }
  }, [
    accountName?.profile_picture,
    profilePicture,
    handleProfilePictureUpdate,
  ]); // Add proper dependencies

  // Rest of your component remains the same...
  const getStatusClass = (value) => {
    if (typeof value === "boolean") {
      return value ? style.statusYes : style.statusNo;
    }
    return value && value !== "N/A" ? style.statusYes : style.statusNeutral;
  };

  if (loadingProfile) {
    return (
      <div className={style.centered}>
        <div className={style.spinner} />
        <p className={style.loading}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.centered}>
        <div className={style.errorBox}>
          ⚠️ Failed to load profile. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <ProfileNavbar />
      <div className={style.content}>
        <aside className={style.sidebar}>
          <div className={style.avatarContainer}>
            <ProfilePictureUpload
              currentPicture={profilePicture}
              userName={userData?.name || "Youth"}
              onPictureUpdate={handleProfilePictureUpdate}
              size={120}
            />
          </div>
          <div className={style.sidebarContent}>
            <h1 className={style.name}>{userData?.name || "Youth Member"}</h1>
            <p className={style.email}>
              {userData?.email || "No email available"}
            </p>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditModalOpen(true)}
              className={style.editButton}
              disabled={updatingProfile}
            >
              {updatingProfile ? "Updating..." : "Edit Profile"}
            </Button>
            
            {/* Success and Error Messages */}
            {successMessage && (
              <div className={style.successMessage}>
                ✅ {successMessage}
              </div>
            )}
            {updateError && (
              <div className={style.errorMessage}>
                ⚠️ {updateError}
              </div>
            )}
          </div>
        </aside>

        <main className={style.main}>
          <section className={style.section}>
            <h2>Personal Information</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>Gender</span>
                <span className={style.value}>
                  {genderInfo?.gender || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Age</span>
                <span className={style.value}>{genderInfo?.age || "N/A"}</span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Birthday</span>
                <span className={style.value}>
                  {genderInfo?.birthday || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Contact Number</span>
                <span className={style.value}>
                  {genderInfo?.contact_number || "N/A"}
                </span>
              </div>
            </div>
          </section>

          <section className={style.section}>
            <h2>Demographics & Survey</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>Civil Status</span>
                <span className={style.value}>
                  {demoSurvey?.civil_status || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Classification</span>
                <span className={style.value}>
                  {demoSurvey?.youth_classification || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Education</span>
                <span className={style.value}>
                  {demoSurvey?.educational_background || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Work Status</span>
                <span className={style.value}>
                  {demoSurvey?.work_status || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Registered Voter</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    demoSurvey?.registered_voter
                  )}`}
                >
                  {demoSurvey?.registered_voter ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </section>

          <section className={style.section}>
            <h2>Meeting & Household</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>Attended Meeting</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    meetingHousehold?.attended
                  )}`}
                >
                  {meetingHousehold?.attended ? "Yes" : "No"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Times Attended</span>
                <span className={style.value}>
                  {meetingHousehold?.times_attended || "0"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Reason for Not Attending</span>
                <span className={style.value}>
                  {meetingHousehold?.reason_not_attend || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Household</span>
                <span className={style.value}>
                  {meetingHousehold?.household || "N/A"}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ProfileEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleProfileUpdate}
        userType="youth"
        currentData={{
          name: accountName,
          info: genderInfo,
          gender: genderInfo,
          demographics: demoSurvey,
          survey: demoSurvey,
          meetingSurvey: meetingHousehold
        }}
        loading={updatingProfile}
      />
    </div>
  );
};

export default YouthProfile;