import React, { useState } from 'react';
import style from '@styles/navbarFeed.module.scss';
import Logo from '@images/logo.jpg';
import { useAuthContext } from '@context/AuthContext';
import { useNotifications } from '@context/NotificationContext';
import { useLogout } from '@hooks/useLogout';
import useCurrentUser from '@hooks/useCurrentUser';
import { Link } from 'react-router-dom';
import {
  Bell,
  House,
  Megaphone,
  CalendarRange,
  MessageCircle,
  Search,
  User,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const { userData, profilePicture, loading: userLoading } = useCurrentUser();
  const logout = useLogout();
  const canManage = isSkSuperAdmin || isSkNaturalAdmin;
  const { notifications, unreadCount, markAllRead, clear, clearRead } = useNotifications();

  return (
    <nav className={style.nav}>
      {/* Logo and Search */}
      <div className={style.logoWrapper}>
        <NavLink to="/feed" className={style.logoLink}>
          <img src={Logo} alt="SKC Youth Hub" className={style.logo} />
          <span className={style.logoText}>SKC Youth Hub</span>
        </NavLink>
        <div className={style.searchWrapper}>
          <Search className={style.searchIcon} />
          <input
            type="search"
            className={style.searchInput}
            placeholder="Search posts, announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Links - Desktop */}
      <ul className={style.navLinks}>
        <li>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <House className={style.navIcon} />
            <span className={style.navLabel}>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/announcements"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <Megaphone className={style.navIcon} />
            <span className={style.navLabel}>Announcements</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/activities"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <CalendarRange className={style.navIcon} />
            <span className={style.navLabel}>Activities</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/feedback"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <MessageCircle className={style.navIcon} />
            <span className={style.navLabel}>Feedback</span>
          </NavLink>
        </li>
      </ul>

      {/* Icons & Profile */}
      <div className={style.actions}>
        <div className={style.iconWrapper}>
          <Bell
            onClick={() => setNotifOpen(!isNotifOpen)}
            className={style.icon}
          />
          {unreadCount > 0 && <span className={style.badge}>{unreadCount}</span>}

          {isNotifOpen && (
            <div className={style.notifDropdown}>
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

        <div
          className={style.profileWrapper}
          onClick={() => setProfileOpen(!isProfileOpen)}
        >
          <div className={style.avatarContainer}>
            <img
              src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData?.name || 'User'
              )}&background=random&color=fff`}
              alt="Profile"
              className={style.avatar}
            />
            {userLoading && <div className={style.avatarLoading}></div>}
          </div>
          <div className={style.userInfo}>
            <span className={style.userName}>{userData?.name || 'User'}</span>
            <span className={style.userRole}>
              {canManage ? (userData?.position || 'Official') : 'Youth Member'}
            </span>
          </div>
          {isProfileOpen && (
            <div className={style.dropdown}>
              <div className={style.profileHeader}>
                <div className={style.profileAvatar}>
                  <img
                    src={profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userData?.name || 'User'
                    )}&background=random&color=fff`}
                    alt="Profile"
                  />
                </div>
                <div className={style.profileDetails}>
                  <strong>{userData?.name || 'User'}</strong>
                  <small>{userData?.email || ''}</small>
                  <span className={style.userBadge}>
                    {canManage ? (userData?.position || 'Official') : 'Youth Member'}
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
                {canManage && (
                  <li>
                    <Link to="/official-profile" className={style.dropdownItem}>
                      <User className={style.dropdownIcon} />
                      My Profile
                    </Link>
                  </li>
                )}
                {!canManage && (
                  <li>
                    <Link to="/profile" className={style.dropdownItem}>
                      <User className={style.dropdownIcon} />
                      My Profile
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/account" className={style.dropdownItem}>
                    <Settings className={style.dropdownIcon} />
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

      {/* Mobile Navigation Links */}
      <ul className={style.mobileNavLinks}>
        <li>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
            }
          >
            <House className={style.mobileNavIcon} />
            <span className={style.mobileNavLabel}>Home</span>
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
            <span className={style.mobileNavLabel}>News</span>
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
            <span className={style.mobileNavLabel}>Events</span>
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
            <span className={style.mobileNavLabel}>Chat</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
