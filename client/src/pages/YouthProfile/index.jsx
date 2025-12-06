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
    location, // Add location
    nameDetails, // Add name details
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
  }, []);

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
  ]);

  const getStatusClass = (value) => {
    if (typeof value === "boolean") {
      return value ? style.statusYes : style.statusNo;
    }
    if (typeof value === "string") {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === "yes" || lowerValue === "true") return style.statusYes;
      if (lowerValue === "no" || lowerValue === "false") return style.statusNo;
    }
    return value && value !== "N/A" ? style.statusYes : style.statusNeutral;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
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
              userName={userData?.name || accountName?.fullName || "Youth"}
              onPictureUpdate={handleProfilePictureUpdate}
              size={120}
            />
          </div>
          <div className={style.sidebarContent}>
            <h1 className={style.name}>
              {accountName?.fullName || userData?.name || "Youth Member"}
            </h1>
            <p className={style.email}>
              {accountName?.email || userData?.email || "No email available"}
            </p>
            <p className={style.verification}>
              {accountName?.verified ? "✅ Verified" : "⏳ Pending Verification"}
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
          {/* Personal Information Section */}
          <section className={style.section}>
            <h2>Personal Information</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>First Name</span>
                <span className={style.value}>
                  {nameDetails?.first_name || accountName?.first_name || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Middle Name</span>
                <span className={style.value}>
                  {nameDetails?.middle_name || accountName?.middle_name || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Last Name</span>
                <span className={style.value}>
                  {nameDetails?.last_name || accountName?.last_name || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Suffix</span>
                <span className={style.value}>
                  {nameDetails?.suffix || accountName?.suffix || "N/A"}
                </span>
              </div>
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
                  {formatDate(genderInfo?.birthday)}
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

          {/* Location Information Section */}
          <section className={style.section}>
            <h2>Location Information</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>Region</span>
                <span className={style.value}>
                  {location?.region || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Province</span>
                <span className={style.value}>
                  {location?.province || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Municipality</span>
                <span className={style.value}>
                  {location?.municipality || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Barangay</span>
                <span className={style.value}>
                  {location?.barangay || "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Purok</span>
                <span className={style.value}>
                  {location?.purok_name || location?.purok_id || "N/A"}
                </span>
              </div>
            </div>
          </section>

          {/* Demographics & Survey Section */}
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
                <span className={style.label}>Youth Age Gap</span>
                <span className={style.value}>
                  {demoSurvey?.youth_age_gap || "N/A"}
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
                <span className={style.label}>Registered Voter (Barangay)</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    demoSurvey?.registered_voter
                  )}`}
                >
                  {demoSurvey?.registered_voter === true || 
                   demoSurvey?.registered_voter === "yes" || 
                   String(demoSurvey?.registered_voter).toLowerCase() === "true" 
                    ? "Yes" 
                    : demoSurvey?.registered_voter === false || 
                      demoSurvey?.registered_voter === "no" || 
                      String(demoSurvey?.registered_voter).toLowerCase() === "false"
                      ? "No"
                      : "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Registered National Voter</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    demoSurvey?.registered_national_voter
                  )}`}
                >
                  {demoSurvey?.registered_national_voter === true || 
                   demoSurvey?.registered_national_voter === "yes" || 
                   String(demoSurvey?.registered_national_voter).toLowerCase() === "true" 
                    ? "Yes" 
                    : demoSurvey?.registered_national_voter === false || 
                      demoSurvey?.registered_national_voter === "no" || 
                      String(demoSurvey?.registered_national_voter).toLowerCase() === "false"
                      ? "No"
                      : "N/A"}
                </span>
              </div>
              <div className={style.infoItem}>
                <span className={style.label}>Voted Last Election</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    demoSurvey?.vote_last_election
                  )}`}
                >
                  {demoSurvey?.vote_last_election === true || 
                   demoSurvey?.vote_last_election === "yes" || 
                   String(demoSurvey?.vote_last_election).toLowerCase() === "true" 
                    ? "Yes" 
                    : demoSurvey?.vote_last_election === false || 
                      demoSurvey?.vote_last_election === "no" || 
                      String(demoSurvey?.vote_last_election).toLowerCase() === "false"
                      ? "No"
                      : "N/A"}
                </span>
              </div>
            </div>
          </section>

          {/* Meeting & Household Section */}
          <section className={style.section}>
            <h2>Meeting & Household</h2>
            <div className={style.infoGrid}>
              <div className={style.infoItem}>
                <span className={style.label}>Attended SK Meeting</span>
                <span
                  className={`${style.value} ${getStatusClass(
                    meetingHousehold?.attended
                  )}`}
                >
                  {meetingHousehold?.attended ? "Yes" : "No"}
                </span>
              </div>
              {meetingHousehold?.attended && (
                <div className={style.infoItem}>
                  <span className={style.label}>Times Attended</span>
                  <span className={style.value}>
                    {meetingHousehold?.times_attended || "0"}
                  </span>
                </div>
              )}
              {!meetingHousehold?.attended && meetingHousehold?.reason_not_attend && (
                <div className={style.infoItem}>
                  <span className={style.label}>Reason for Not Attending</span>
                  <span className={style.value}>
                    {meetingHousehold?.reason_not_attend || "N/A"}
                  </span>
                </div>
              )}
              <div className={style.infoItem}>
                <span className={style.label}>Household Information</span>
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
          nameDetails: nameDetails,
          info: genderInfo,
          gender: genderInfo,
          demographics: demoSurvey,
          survey: demoSurvey,
          meetingSurvey: meetingHousehold,
          location: location
        }}
        loading={updatingProfile}
      />
    </div>
  );
};

export default YouthProfile;