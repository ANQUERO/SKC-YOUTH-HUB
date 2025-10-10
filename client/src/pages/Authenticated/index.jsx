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
  Menu as MenuIcon,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const Authenticated = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logout = useLogout();
  const { authUser } = useAuthContext();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menu = [
    {
      title: "Dashboard",
      path: "/dashboard",
      visible: true,
      icon: <LayoutGrid size={20} />,
      badge: 3
    },
    {
      title: "Youth",
      path: "/youth",
      visible: true,
      icon: <User size={20} />
    },
    {
      title: "Purok",
      path: "/purok",
      visible: true,
      icon: <MapPinned size={20} />
    },
    {
      title: "Inbox",
      path: "/inbox",
      visible: true,
      icon: <InboxIcon size={20} />,
      badge: 12
    },
    {
      title: "Verification",
      path: "/verification",
      visible: true,
      icon: <IdCard size={20} />
    },
    {
      title: "Officials",
      path: "/officials",
      visible: true,
      icon: <Users size={20} />
    }
  ];

  const menusBottom = [
    {
      title: "Settings",
      path: "/account",
      visible: true,
      icon: <SettingsIcon size={20} />
    },
    {
      title: "Logout",
      onClick: logout,
      visible: true,
      icon: <LogOut size={20} />
    }
  ];

  return (
    <MainContainer>
      {isSidebarOpen && isMobile && (
        <MobileOverlay onClick={() => setIsSidebarOpen(false)} />
      )}

      <MenuContainer $open={isSidebarOpen} className={style.sidebar}>
        {/* Header Section */}
        <div className={style.sidebarHeader}>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
          <div className={style.sidebarToggle} onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Create Post Button */}
        <CreatePostLink to="/feed" title="Create Post" className={style.createPostBtn}>
          <div className={style.createPostIcon}>
            <Plus size={20} />
          </div>
          <span>Create Post</span>
        </CreatePostLink>

        {/* Navigation Menu */}
        <div className={style.navSection}>
          <h4 className={style.sectionTitle}>Menu</h4>
          <Menu menus={menu} />
        </div>

        {/* Bottom Navigation */}
        <div className={style.bottomNav}>
          <Menu menus={menusBottom} />
        </div>

        {/* User Profile Section */}
        <div className={style.userProfile}>
          <div className={style.userAvatar}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                authUser?.name || 'User'
              )}&background=6366f1&color=ffffff&bold=true`}
              alt="User Avatar"
            />
          </div>
          <div className={style.userInfo}>
            <span className={style.userName}>{authUser?.name || 'User'}</span>
            <span className={style.userRole}>Administrator</span>
          </div>
        </div>
      </MenuContainer>

      <ContentContainer className={style.mainContent}>
        {/* Top Navigation Bar */}
        <TopContainer className={style.topBar}>
          <div className={style.leftSection}>
            <ToggleSidebarButton 
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={style.menuButton}
            >
              <MenuIcon size={20} />
            </ToggleSidebarButton>
            
            {/* Search Bar */}
            <div className={style.searchBar}>
              <Search size={18} className={style.searchIcon} />
              <input 
                type="text" 
                placeholder="Search..." 
                className={style.searchInput}
              />
            </div>
          </div>

          <div className={style.rightSection}>
            {/* Notifications */}
            <button className={style.iconButton}>
              <Bell size={20} />
              <span className={style.notificationBadge}>5</span>
            </button>

            {/* User Menu */}
            <UserContainer className={style.userMenu}>
              <div className={style.avatarContainer}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser?.name || 'User'
                  )}&background=6366f1&color=ffffff&bold=true`}
                  alt="User Avatar"
                />
              </div>
              <div className={style.userText}>
                <span className={style.userName}>{authUser?.name || 'User'}</span>
                <span className={style.userRole}>Admin</span>
              </div>
            </UserContainer>
          </div>
        </TopContainer>

        {/* Main Content Area */}
        <Content className={style.contentArea}>
          <Outlet />
        </Content>
      </ContentContainer>
    </MainContainer>
  );
};

export default Authenticated;