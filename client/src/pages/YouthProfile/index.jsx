import React, { useEffect } from "react";
import styled from "styled-components";
import useProfile from "@hooks/useProfile";

const YouthProfile = () => {
    const {
        fetchProfile,
        accountName,
        genderInfo,
        demoSurvey,
        meetingHousehold,
        loadingProfile,
        error,
    } = useProfile();

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loadingProfile) return <p>Loading profile...</p>;
    if (error) return <p>Failed to load profile.</p>;

    return (
        <Wrapper>
            <Sidebar>
                <Avatar>
                    <img
                        src={`https://ui-avatars.com/api/?name=${accountName?.first_name || "Youth"}`}
                        alt="User Avatar"
                    />
                </Avatar>
                <Name>
                    {accountName?.first_name || ""} {accountName?.middle_name || ""} {accountName?.last_name || ""}
                </Name>
                <Email>{accountName?.email || "No email available"}</Email>
            </Sidebar>

            <Main>
                <Section>
                    <h2>Personal Info</h2>
                    <p>Gender: {genderInfo?.gender || "N/A"}</p>
                    <p>Age: {genderInfo?.age || "N/A"}</p>
                    <p>Birthday: {genderInfo?.birthday || "N/A"}</p>
                    <p>Contact: {genderInfo?.contact_number || "N/A"}</p>
                </Section>

                <Section>
                    <h2>Demographics & Survey</h2>
                    <p>Civil Status: {demoSurvey?.civil_status || "N/A"}</p>
                    <p>Classification: {demoSurvey?.youth_classification || "N/A"}</p>
                    <p>Education: {demoSurvey?.educational_background || "N/A"}</p>
                    <p>Work Status: {demoSurvey?.work_status || "N/A"}</p>
                    <p>Registered Voter: {demoSurvey?.registered_voter ? "Yes" : "No"}</p>
                </Section>

                <Section>
                    <h2>Meeting & Household</h2>
                    <p>Attended: {meetingHousehold?.attended ? "Yes" : "No"}</p>
                    <p>Times Attended: {meetingHousehold?.times_attended || "0"}</p>
                    <p>Reason Not Attend: {meetingHousehold?.reason_not_attend || "N/A"}</p>
                    <p>Household: {meetingHousehold?.household || "N/A"}</p>
                </Section>
            </Main>
        </Wrapper>
    );
};

export default YouthProfile;

// ---------------- Styled Components ----------------
const Wrapper = styled.div`
  display: flex;
  max-width: 1000px;
  margin: 2rem auto;
  gap: 2rem;
`;

const Sidebar = styled.aside`
  flex: 1;
  max-width: 250px;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const Avatar = styled.div`
  img {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
`;

const Name = styled.h1`
  margin: 1rem 0 0.25rem;
  font-size: 1.5rem;
`;

const Email = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const Main = styled.main`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.95rem;
    color: #333;
  }
`;
