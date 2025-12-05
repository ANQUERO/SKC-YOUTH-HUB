import React, { useState } from 'react';
import style from '@styles/navbarFeed.module.scss';
import Logo from '@images/logo.jpg';
import { useAuthContext } from '@context/AuthContext';
import { useNotifications } from '@context/NotificationContext';
import { useLogout } from '@hooks/useLogout';
import useCurrentUser from '@hooks/useCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  House,
  Megaphone,
  CalendarRange,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth } = useAuthContext();
  const { userData, profilePicture, loading: userLoading } = useCurrentUser();
  const logout = useLogout();
  const canManage = isSkSuperAdmin || isSkNaturalAdmin;
  const { notifications, unreadCount, markRead } = useNotifications();

  // Handle notification click - redirect to post (and comment if applicable)
  const handleNotificationClick = (notification) => {
    if (notification.meta?.post_id || notification._apiData?.post_id) {
      const postId = notification.meta?.post_id || notification._apiData?.post_id;
      const commentId = notification.meta?.comment_id || notification._apiData?.comment_id;
      
      // Mark as read
      if (!notification.read) {
        markRead(notification.id);
      }
      // Close notification dropdown
      setNotifOpen(false);
      
      // Navigate to feed with post focus and comment hash if it's a comment notification
      if (commentId && notification.type === 'comment') {
        navigate(`/feed?post=${postId}#comment-${commentId}`);
      } else {
        navigate(`/feed?post=${postId}`);
      }
    }
  };

  return (
    <>
      <nav className={style.nav}>
        {/* Left Section - Logo and Search */}
        <div className={style.leftSection}>
          <NavLink to="/feed" className={style.logoLink}>
            <img src={Logo} alt="SKC Youth Hub" className={style.logo} />
          </NavLink>
          
          <div className={style.searchWrapper}>
            <Search className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search SKC Youth Hub"
              className={style.searchInput}
            />
          </div>
        </div>

        {/* Center Section - Navigation Links (Desktop) */}
        <div className={style.centerSection}>
          <ul className={style.navLinks}>
            <li className={style.navItem}>
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive ? `${style.navLink} ${style.active}` : style.navLink
                }
              >
                <House className={style.navIcon} />
              </NavLink>
            </li>
            <li className={style.navItem}>
              <NavLink
                to="/feed/announcements"
                className={({ isActive }) =>
                  isActive ? `${style.navLink} ${style.active}` : style.navLink
                }
              >
                <Megaphone className={style.navIcon} />
              </NavLink>
            </li>
            <li className={style.navItem}>
              <NavLink
                to="/feed/activities"
                className={({ isActive }) =>
                  isActive ? `${style.navLink} ${style.active}` : style.navLink
                }
              >
                <CalendarRange className={style.navIcon} />
              </NavLink>
            </li>
            <li className={style.navItem}>
              <NavLink
                to="/feed/feedback"
                className={({ isActive }) =>
                  isActive ? `${style.navLink} ${style.active}` : style.navLink
                }
              >
                <MessageCircle className={style.navIcon} />
              </NavLink>
            </li>

          </ul>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className={style.rightSection}>
          <div className={style.actionIcons}>
            
            <div 
              className={style.actionIcon}
              onClick={() => setNotifOpen(!isNotifOpen)}
            >
              <Bell className={style.icon} />
              {unreadCount > 0 && <span className={style.badge}>{unreadCount}</span>}
            </div>
          </div>

          <div 
            className={style.profileWrapper}
            onClick={() => setProfileOpen(!isProfileOpen)}
          >
            <img
              src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData?.name || 'User'
              )}&background=007bff&color=fff`}
              alt="Profile"
              className={style.avatar}
            />
            <span className={style.userName}>{userData?.name || 'User'} </span>
          </div>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className={style.dropdown}>
              <div className={style.dropdownHeader}>
                <h4>Notifications</h4>
              </div>
              <div className={style.dropdownList}>
                {notifications.length === 0 ? (
                  <div className={style.dropdownItem}>
                    <div className={style.itemContent}>
                      <div className={style.itemTitle}>No notifications</div>
                      <div className={style.itemDescription}>You're all caught up!</div>
                    </div>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={style.dropdownItem}
                      onClick={() => handleNotificationClick(notification)}
                      style={{ cursor: (notification.meta?.post_id || notification._apiData?.post_id) ? 'pointer' : 'default' }}
                    >
                      <Bell className={style.itemIcon} />
                      <div className={style.itemContent}>
                        <div className={style.itemTitle}>{notification.title}</div>
                        <div className={style.itemDescription}>{notification.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className={`${style.dropdown} ${style.profileDropdown}`}>
              <div className={style.profileHeader}>
                <div className={style.profileAvatar}>
                  <img
                    src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData?.name || 'User'
                    )}&background=007bff&color=fff`}
                    alt="Profile"
                  />
                </div>
                <div className={style.profileInfo}>
                  <div className={style.profileName}>{userData?.name || 'User'}</div>
                  <div className={style.profileRole}>
                    {canManage ? (userData?.position || 'Official') : 'Youth Member'}
                  </div>
                </div>
              </div>
              
              <div className={style.dropdownMenu}>
                {canManage && (
                  <Link to="/dashboard" className={style.dropdownItem}>
                    <Shield className={style.dropdownIcon} />
                    Admin Dashboard
                  </Link>
                )}
                
                <Link to={canManage ? "/official-profile" : "/profile"} className={style.dropdownItem}>
                  <User className={style.dropdownIcon} />
                  My Profile
                </Link>
                
                <Link to={isSkYouth ? "/settings" : "/account"} className={style.dropdownItem}>
                  <Settings className={style.dropdownIcon} />
                  Settings
                </Link>
                
                <div className={style.divider}></div>
                
                <button onClick={logout} className={style.dropdownItem} style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}>
                  <LogOut className={style.dropdownIcon} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className={style.mobileNav}>
          <div className={style.mobileNavItem}>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
              }
            >
              <House className={style.mobileNavIcon} />
              <span className={style.mobileNavLabel}>Home</span>
            </NavLink>
          </div>
          <div className={style.mobileNavItem}>
            <NavLink
              to="/feed/announcements"
              className={({ isActive }) =>
                isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
              }
            >
              <Megaphone className={style.mobileNavIcon} />
              <span className={style.mobileNavLabel}>News</span>
            </NavLink>
          </div>
          <div className={style.mobileNavItem}>
            <NavLink
              to="/feed/activities"
              className={({ isActive }) =>
                isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
              }
            >
              <CalendarRange className={style.mobileNavIcon} />
              <span className={style.mobileNavLabel}>Events</span>
            </NavLink>
          </div>
          <div className={style.mobileNavItem}>
            <NavLink
              to="/feed/feedback"
              className={({ isActive }) =>
                isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
              }
            >
              <MessageCircle className={style.mobileNavIcon} />
              <span className={style.mobileNavLabel}>Chat</span>
            </NavLink>
          </div>
        
        </div>
      </nav>
    </>
  );
};