import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useLogout } from '@hooks/useLogout';
import { useAuthContext } from '@context/AuthContext';
import { useNotifications } from '@context/NotificationContext';
import useCurrentUser from '@hooks/useCurrentUser';
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
  House,
  Megaphone,
  CalendarRange,
  MessageCircle,
  Shield
} from 'lucide-react';

import Logo from '@components/Logo.jsx';
import Menu from '@components/Menu.jsx';

const Authenticated = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  const {
    userData, 
    profilePicture, 
    loading: userLoading 
  } = useCurrentUser();
  
  const [isMobile, setIsMobile] = useState(false);
  const logout = useLogout();
  const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const { notifications, unreadCount, markAllRead, clear, clearRead } = useNotifications();
  
  const canManage = isSkSuperAdmin || isSkNaturalAdmin;

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotifOpen && !event.target.closest(`.${style.notificationWrapper}`)) {
        setNotifOpen(false);
      }
      if (isProfileOpen && !event.target.closest(`.${style.profileDropdown}`)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen, isProfileOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Get user display information
  const getUserDisplayInfo = () => {
    if (userLoading) {
      return {
        name: 'Loading...',
        role: 'Loading...',
        avatar: `https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&bold=true`
      };
    }

    if (userData) {
      return {
        name: userData.name,
        role: userData.userType === 'official' 
          ? userData.position || 'Official'
          : userData.userType === 'youth'
          ? 'Youth Member'
          : 'User',
        avatar: profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=ffffff&bold=true`
      };
    }

    // Fallback to authUser if userData is not available
    return {
      name: authUser?.name || 'User',
      role: 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'User')}&background=6366f1&color=ffffff&bold=true`
    };
  };

  const displayInfo = getUserDisplayInfo();

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
      visible: userData?.userType === 'youth' || userData?.userType === 'official',
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
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <MobileOverlay onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <MenuContainer $open={isSidebarOpen} className={style.sidebar}>
        {/* Header Section */}
        <div className={style.sidebarHeader}>
          <LogoWrapper>
            <Logo />
            <h1 className={style.logoText}>
              SKC:YouthHub
            </h1>
          </LogoWrapper>
          {isMobile && (
            <div className={style.sidebarToggle} onClick={() => setIsSidebarOpen(false)}>
              <ChevronRight size={16} />
            </div>
          )}
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
          <Menu menus={menu.filter(item => item.visible)} />
        </div>

        {/* Bottom Navigation */}
        <div className={style.bottomNav}>
          <Menu menus={menusBottom.filter(item => item.visible)} />
        </div>

        {/* Mobile User Profile Section */}
        {isMobile && (
          <div className={style.userProfile}>
            <div className={style.userAvatar}>
              <img
                src={displayInfo.avatar}
                alt="User Avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayInfo.name)}&background=6366f1&color=ffffff&bold=true`;
                }}
              />
            </div>
            <div className={style.userInfo}>
              <span className={style.userName}>{displayInfo.name}</span>
              <span className={style.userRole}>{displayInfo.role}</span>
            </div>
          </div>
        )}
      </MenuContainer>

      {/* Main Content */}
      <ContentContainer $sidebarOpen={isSidebarOpen} className={style.mainContent}>
        {/* Top Navigation Bar */}
        <TopContainer className={style.topBar}>
          <div className={style.leftSection}>
            <ToggleSidebarButton 
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={style.menuButton}
            >
              <MenuIcon size={20} />
            </ToggleSidebarButton>

            {/* Mobile Navigation Links */}
            {isMobile && (
              <ul className={style.mobileNavLinks}>
                <li>
                  <NavLink
                    to="/feed"
                    className={({ isActive }) =>
                      isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
                    }
                  >
                    <House className={style.mobileNavIcon} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/feed/announcements"
                    className={({ isActive }) =>
                      isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
                    }
                  >
                    <Megaphone className={style.mobileNavIcon} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/feed/activities"
                    className={({ isActive }) =>
                      isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
                    }
                  >
                    <CalendarRange className={style.mobileNavIcon} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/feed/feedback"
                    className={({ isActive }) =>
                      isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
                    }
                  >
                    <MessageCircle className={style.mobileNavIcon} />
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          <div className={style.rightSection}>
            {/* Notifications */}
            <div className={style.notificationWrapper}>
              <button 
                className={style.iconButton}
                onClick={() => {
                  setNotifOpen(!isNotifOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className={style.notificationBadge}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className={`${style.notificationDropdown} ${style.dropdown}`}>
                  <div className={style.dropdownHeader}>
                    <h4>Notifications</h4>
                    {notifications.length > 0 && (
                      <div className={style.dropdownActions}>
                        <button onClick={markAllRead}>Mark all as read</button>
                        <button onClick={clearRead}>Clear read</button>
                        <button onClick={clear}>Clear all</button>
                      </div>
                    )}
                  </div>

                  <div className={style.notifList}>
                    {notifications.length === 0 ? (
                      <p className={style.emptyNotif}>No notifications</p>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={`${style.notifItem} ${n.read ? "" : style.unread}`}
                        >
                          <div className={style.notifContent}>
                            <strong>{n.title}</strong>
                            <p>{n.message}</p>
                            <span className={style.timestamp}>
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className={style.profileDropdown}>
              <UserContainer 
                className={style.userMenu}
                onClick={() => {
                  setProfileOpen(!isProfileOpen);
                  setNotifOpen(false);
                }}
              >
                <div className={style.avatarContainer}>
                  <img
                    src={displayInfo.avatar}
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayInfo.name)}&background=6366f1&color=ffffff&bold=true`;
                    }}
                  />
                  {userLoading && <div className={style.avatarLoading}></div>}
                </div>
                {!isMobile && (
                  <div className={style.userText}>
                    <span className={style.userName}>{displayInfo.name}</span>
                    <span className={style.userRole}>{displayInfo.role}</span>
                  </div>
                )}
              </UserContainer>

              {isProfileOpen && (
                <div className={`${style.profileDropdownMenu} ${style.dropdown}`}>
                  <div className={style.profileHeader}>
                    <div className={style.profileAvatar}>
                      <img
                        src={displayInfo.avatar}
                        alt="Profile"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayInfo.name)}&background=6366f1&color=ffffff&bold=true`;
                        }}
                      />
                    </div>
                    <div className={style.profileDetails}>
                      <strong>{displayInfo.name}</strong>
                      <small>{userData?.email || ''}</small>
                      <span className={style.userBadge}>
                        {displayInfo.role}
                      </span>
                    </div>
                  </div>
                  <ul className={style.dropdownMenu}>
                    {canManage && (
                      <li>
                        <Link to="/dashboard" className={style.dropdownItem}>
                          <Shield className={style.dropdownIcon} />
                          Dashboard
                        </Link>
                      </li>
                    )}
                    {canManage && (
                      <li>
                        <Link to="/feed" className={style.dropdownItem}>
                          <Megaphone className={style.dropdownIcon} />
                          Create Post
                        </Link>
                      </li>
                    )}
                    {canManage ? (
                      <li>
                        <Link to="/official-profile" className={style.dropdownItem}>
                          <User className={style.dropdownIcon} />
                          My Profile
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/profile" className={style.dropdownItem}>
                          <User className={style.dropdownIcon} />
                          My Profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/account" className={style.dropdownItem}>
                        <SettingsIcon className={style.dropdownIcon} />
                        Settings
                      </Link>
                    </li>
                    <li className={style.divider}></li>
                    <li>
                      <button onClick={logout} className={style.logoutButton}>
                        <LogOut className={style.dropdownIcon} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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