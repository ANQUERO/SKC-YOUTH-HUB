import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLogout } from '@hooks/useLogout';
import { useAuthContext } from '@context/AuthContext';

import style from '@styles/authenticated.module.scss';
import {
  MainContainer,
  MenuContainer,
  MobileOverlay,
  ContentContainer,
  TopContainer,
  ToggleSidebarButton,
  UserContainer,
  Content,
  CreatePostLink,
  LogoWrapper
} from 'components/authenticatedLayout';

import {
  LayoutGrid,
  User,
  MapPinned,
  Inbox as InboxIcon,
  IdCard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Menu as MenuIcon
} from 'lucide-react';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const Authenticated = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logout = useLogout();
  const { user } = useAuthContext();

  const menu = [
    {
      title: "Dashboard",
      path: "/dashboard",
      visible: true,
      icon: <LayoutGrid />
    },
    {
      title: "Youth",
      path: "/youth",
      visible: true,
      icon: <User />
    },
    {
      title: "Purok",
      path: "/purok",
      visible: true,
      icon: <MapPinned
      />
    },
    {
      title: "Inbox",
      path: "/inbox",
      visible: true,
      icon: <InboxIcon
      />
    },
    {
      title: "Verification",
      path: "/verification",
      visible: true,
      icon: <IdCard
      />
    },
    {
      title: "Officials",
      path: "/officials",
      visible: true,
      icon: <Users />
    }
  ];

  const menusBottom = [
    {
      title: "Settings",
      path: "/account",
      visible: true,
      icon: <SettingsIcon
      />
    },
    {
      title: "Logout",
      onClick: logout,
      visible: true,
      icon: <LogOut
      />
    }
  ];

  return (
    <MainContainer>
      {isSidebarOpen && <MobileOverlay onClick={() => setIsSidebarOpen(false)} />}

      <MenuContainer $open={isSidebarOpen}>
        <div>
          <div className={style.top}>
            <LogoWrapper>
              <Logo />
            </LogoWrapper>
          </div>

          <CreatePostLink to="/feed" title="Create Post">
            <Plus />
            <span>Create Post</span>
          </CreatePostLink>

          <h4 style={{ color: 'white', marginBottom: '0.75rem' }}>Menu</h4>
          <Menu menus={menu} />
        </div>

        <Menu menus={menusBottom} />
      </MenuContainer>

      <ContentContainer>
        <TopContainer>
          <ToggleSidebarButton onClick={() => setIsSidebarOpen(prev => !prev)}>
            <MenuIcon />
          </ToggleSidebarButton>

          <UserContainer>
            <span>{user?.name || "User"}</span>
          </UserContainer>
        </TopContainer>

        <Content>
          <Outlet />
        </Content>
      </ContentContainer>
    </MainContainer>
  );
};

export default Authenticated;
