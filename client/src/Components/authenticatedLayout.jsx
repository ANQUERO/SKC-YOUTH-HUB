import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  background-color: #FBFCFA;
`;

export const MenuContainer = styled.div`
  padding: 2rem 1.25rem;
  background-color: #31578B;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  transition: transform 0.3s ease;
  display: flex;
  left: 0;
  top: 0;
  transform: ${props => props.$open ? 'translateX(0)' : 'translateX(-100%)'};

  @media (min-width: 1024px) {
    transform: translateX(0);
    position: fixed;
  }

  @media (max-width: 640px) {
    width: 280px;
  }
`;

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s ease;
  min-height: 100vh;

  @media (min-width: 1024px) {
    margin-left: 250px;
  }

  @media (max-width: 1023px) {
    margin-left: 0;
  }
`;

export const TopContainer = styled.div`
  background-color: #FBFCFA;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 64px;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 56px;
  }
`;

export const ToggleSidebarButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const CreatePostLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  width: calc(100% - 2rem);
  margin: 0 1rem 1.5rem;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  span {
    font-size: 0.875rem;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.5rem;

  img {
    height: 40px;
    width: auto;
    max-width: 100%;
    transition: all 0.3s ease;
  }
`;