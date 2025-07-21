import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import style from '@styles/authenticated.module.scss';

import {
  LayoutGrid,
  User,
  MapPinned,
  Inbox,
  IdCard,
  Users,
  Settings,
  LogOut,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Menu as MenuIcon
} from 'lucide-react';

import styled from 'styled-components';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
`;

const MenuContainer = styled.div`
  padding: 2rem 1.25rem;
  background-color: #31578B;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 20;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => (props.$collapsed ? '80px' : '250px')};
  transition: width 0.3s ease;
  display: flex;
  left: 0;
  top: 0;

  @media (max-width: 640px) {
    width: ${(props) => (props.$open ? '250px' : '0')};
    padding: ${(props) => (props.$open ? '2rem 1.25rem' : '0')};
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 15;

  @media (min-width: 640px) {
    display: none;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 10% 90%;
  overflow: hidden;

  @media (min-width: 640px) {
    margin-left: ${(props) => (props.$collapsed ? '80px' : '250px')};
    transition: margin-left 0.3s ease;
  }

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

const TopContainer = styled.div`
  background-color: #ffffff;
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

const ToggleSidebarButton = styled.button`
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

const UserContainer = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 1024px) {
    display: inline-flex;
  }
`;

const Content = styled.div`
  padding: 0.5rem;
  padding-bottom: 1rem;
  height: 100%;
  overflow-y: auto;

  @media (min-width: 1024px) {
    padding: 2rem;
    padding-bottom: 2rem;
  }
`;

const SearchContainer = styled.input`
  width: 100%;
  border: none;
  background-color: #f3f4f6;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 440px;
  }
`;

const CreatePostLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #31578B;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  text-decoration: none;
  width: 100%;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  margin-bottom: 1.5rem;

  &:hover {
    background-color: #e0e7ff;
    color: #1e3a8a;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  span {
    display: ${(props) => (props.$collapsed ? 'none' : 'inline')};
  }
`;

const CollapseToggle = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  align-items: center;
  margin-bottom: 1rem;

  img {
    height: 40px;
    width: auto;
    max-width: ${(props) => (props.$collapsed ? '40px' : '150px')};
    transition: max-width 0.3s ease;
  }
`;

const Authenticated = () => {
  const [searchValue, setSearchValue] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCollapsed(true);
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menu = [
    { title: "Dashboard", path: "/", visible: true, icon: <LayoutGrid /> },
    { title: "Youth", path: "/youth", visible: true, icon: <User /> },
    { title: "Purok", path: "/purok", visible: true, icon: <MapPinned /> },
    { title: "Inbox", path: "/inbox", visible: true, icon: <Inbox /> },
    { title: "Verification", path: "/verification", visible: true, icon: <IdCard /> },
    { title: "Officials", path: "/officials", visible: true, icon: <Users /> }
  ];

  const menusBottom = [
    { title: "Settings", path: "/account", visible: true, icon: <Settings /> },
    { title: "Logout", path: "/logout", visible: true, icon: <LogOut /> }
  ];

  return (
    <MainContainer>
      {isSidebarOpen && <MobileOverlay onClick={() => setIsSidebarOpen(false)} />}

      <MenuContainer $collapsed={collapsed} $open={isSidebarOpen}>
        <div>
          <div className={style.top}>
            <LogoWrapper $collapsed={collapsed}>
              <Logo />
            </LogoWrapper>
          </div>

          <CollapseToggle
            onClick={() => setCollapsed((prev) => !prev)}
            $collapsed={collapsed}
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </CollapseToggle>

          <CreatePostLink to="/feed" $collapsed={collapsed} title="Create Post">
            <Plus />
            <span>Create Post</span>
          </CreatePostLink>

          {!collapsed && (
            <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Menu</h4>
          )}
          <Menu menus={menu} collapsed={collapsed} />
        </div>

        <Menu menus={menusBottom} collapsed={collapsed} />
      </MenuContainer>

      <ContentContainer $collapsed={collapsed}>
        <TopContainer>
          {collapsed && (
            <ToggleSidebarButton onClick={() => setIsSidebarOpen(prev => !prev)}>
              <MenuIcon />
            </ToggleSidebarButton>
          )}
          <SearchContainer
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <UserContainer>
            <span>User</span>
          </UserContainer>
        </TopContainer>

        <Content>
          <Outlet context={{ searchValue }} />
        </Content>
      </ContentContainer>
    </MainContainer>
  );
};

export default Authenticated;
