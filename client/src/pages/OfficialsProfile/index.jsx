import React, { useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "@lib/axios";
import { ProfileNavbar } from "Components/Navbar";
import { useState } from "react";

const OfficialsProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    const [name, setName] = useState(null);
    const [info, setInfo] = useState(null);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get("/profile");
            const { account, name, info } = res.data.data || {};
            setAccount(account || null);
            setName(name || null);
            setInfo(info || null);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    if (loading) {
        return (
            <Centered>
                <Spinner />
                <p>Loading profile...</p>
            </Centered>
        );
    }

    if (error) {
        return (
            <Centered>
                <ErrorBox>⚠️ Failed to load profile. Please try again later.</ErrorBox>
            </Centered>
        );
    }

    return (
        <Wrapper>
            <ProfileNavbar />
            <Content>
                <Sidebar>
                    <Avatar>
                        <img
                            src={`https://ui-avatars.com/api/?name=${name?.first_name || "Official"}`}
                            alt="User Avatar"
                        />
                    </Avatar>
                    <Name>
                        {name?.first_name || ""} {name?.middle_name || ""} {name?.last_name || ""}
                    </Name>
                    <Email>{account?.email || "No email available"}</Email>
                    <p>{account?.official_position || ""}</p>
                </Sidebar>

                <Main>
                    <Section>
                        <h2>Personal Info</h2>
                        <p>Gender: {info?.gender || "N/A"}</p>
                        <p>Age: {info?.age || "N/A"}</p>
                        <p>Contact: {info?.contact_number || "N/A"}</p>
                    </Section>

                    <Section>
                        <h2>Account</h2>
                        <p>Role: {account?.role || "N/A"}</p>
                        <p>Status: {account?.is_active ? "Active" : "Inactive"}</p>
                        <p>Created: {account?.created_at ? new Date(account.created_at).toLocaleString() : "N/A"}</p>
                    </Section>
                </Main>
            </Content>
        </Wrapper>
    );
};

export default OfficialsProfile;

// Styled Components (matching YouthProfile)
const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f9fb;
`;

const Content = styled.div`
  display: flex;
  max-width: 1100px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  flex: 1;
  max-width: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Avatar = styled.div`
  img {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: cover;
    border: 3px solid #e5e7eb;
  }
`;

const Name = styled.h1`
  margin: 1rem 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
    color: #111;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.95rem;
    color: #333;
  }
`;

const Centered = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBox = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
`;


