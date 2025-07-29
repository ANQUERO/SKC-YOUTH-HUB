import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  SearchContainer,
  CreatePostLink,
  CollapseToggle,
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
  PanelLeft,
  PanelRight,
  Menu as MenuIcon
} from 'lucide-react';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const Authenticated = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logout = useLogout();
  const { user } = useAuthContext();

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
    { title: "Dashboard", path: "/dashboard", visible: true, icon: <LayoutGrid /> },
    { title: "Youth", path: "/youth", visible: true, icon: <User /> },
    { title: "Purok", path: "/purok", visible: true, icon: <MapPinned /> },
    { title: "Inbox", path: "/inbox", visible: true, icon: <InboxIcon /> },
    { title: "Verification", path: "/verification", visible: true, icon: <IdCard /> },
    { title: "Officials", path: "/officials", visible: true, icon: <Users /> }
  ];

  const menusBottom = [
    {
      title: "Settings",
      path: "/settings",
      visible: true,
      icon: <SettingsIcon />,
    },
    {
      title: "Logout",
      onClick: logout,
      visible: true,
      icon: <LogOut />,
    }
  ];

  return (
    <MainContainer>
      {isSidebarOpen && <MobileOverlay onClick={() => setIsSidebarOpen(false)} />}

      <MenuContainer $collapsed={collapsed} $open={isSidebarOpen}>
        <div>
          <CollapseToggle onClick={() => setCollapsed(prev => !prev)} $collapsed={collapsed}>
            {collapsed ? <PanelRight /> : <PanelLeft />}
          </CollapseToggle>

          <div className={style.top}>
            <LogoWrapper $collapsed={collapsed}>
              <Logo />
            </LogoWrapper>
          </div>

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
