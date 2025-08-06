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
  z-index: 20;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  transition: left 0.3s ease;
  display: flex;
  left: 0;
  top: 0;

  @media (max-width: 640px) {
    width: 250px;
    left: ${(props) => (props.$open ? '0' : '-250px')};
    padding: ${(props) => (props.$open ? '2rem 1.25rem' : '0')};
  }
`;

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 15;

  @media (min-width: 640px) {
    display: none;
  }
`;

export const ContentContainer = styled.div`
   flex: 1;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;
  margin-left: 250px;
  transition: margin-left 0.3s ease;

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

export const TopContainer = styled.div`
  background-color: #FBFCFA;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    gap: 0;
  }
`;

export const ToggleSidebarButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  @media (min-width: 640px) {
    display: none;
  }
`;

export const UserContainer = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 1024px) {
    display: inline-flex;
  }
`;

export const Content = styled.div`
  padding: 3px;
  padding-bottom: 1rem;
  height: 100%;
  overflow-y: auto;

  @media (min-width: 1024px) {
    padding-bottom: 2rem;
  }
`;

export const SearchContainer = styled.input`
  width: 100%;
  border: none;
  background-color: #f3f4f6;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 440px;
  }
`;

export const CreatePostLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? '0' : '0.5rem')};
  background-color: #ffffff;
  color: #31578B;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: .8rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;
  width: 100%;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  margin-bottom: 1.5rem;

  svg {
    width: 2rem;
    height: 1rem;
  }

  span {
    display: ${(props) => (props.$collapsed ? 'none' : 'inline')};
    font-size: 1rem;
  }
`;

export const CollapseToggle = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: .5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-left: .5rem;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  align-items: center;
  margin-bottom: 1.5rem;

  img {
    height: 40px;
    width: auto;
    max-width: 100%;
    transition: all 0.3s ease;
    ${(props) => props.$collapsed && 'max-width: 40px;'}
  }
`;