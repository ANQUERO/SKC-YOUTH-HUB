import React, { useState } from 'react';
import style from '@styles/navbarFeed.module.scss';
import Logo from '@images/logo.jpg';
import { useAuthContext } from '@context/AuthContext';
import { useNotifications } from '@context/NotificationContext';
import { useLogout } from '@hooks/useLogout';
import { Link } from 'react-router-dom';
import {
  Bell,
  House,
  Megaphone,
  CalendarRange,
  MessageCircle
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { authUser, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const logout = useLogout();
  const canManage = isSkSuperAdmin || isSkNaturalAdmin;
  const { notifications, unreadCount, markAllRead, clear, clearRead } = useNotifications();

  return (
    <nav className={style.nav}>
      {/* Logo and Search */}
      <div className={style.logoWrapper}>
        <NavLink to="/">
          <img src={Logo} alt="App Logo" />
        </NavLink>
        <input
          type="search"
          className={style.searchInput}
          placeholder="Search..."
        />
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
            <House />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/announcements"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <Megaphone />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/activities"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <CalendarRange />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/feedback"
            className={({ isActive }) =>
              isActive ? `${style.navLink} ${style.active}` : style.navLink
            }
          >
            <MessageCircle />
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
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              authUser?.name || 'User'
            )}`}
            alt="Profile"
            className={style.avatar}
          />
          {isProfileOpen && (
            <div className={style.dropdown}>
              <div className={style.profileHeader}>
                <strong>{authUser?.name || 'User'}</strong>
                <small>{authUser?.email || ''}</small>
              </div>
              <ul>
                {canManage && (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )}
                {canManage && (
                  <li>
                    <Link to="/feed">Create Post</Link>
                  </li>
                )}
                {canManage && (
                  <li>
                    <Link to="/official-profile">My Profile</Link>
                  </li>
                )}
                {!canManage && (
                  <li>
                    <Link to="/profile">My Profile</Link>
                  </li>
                )}
                <li>
                  <Link to="/account">Settings</Link>
                </li>
                <li>
                  <button onClick={logout} className={style.dropdownButton}>Logout</button>
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
            <House />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/announcements"
            className={({ isActive }) =>
              isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
            }
          >
            <Megaphone />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/activities"
            className={({ isActive }) =>
              isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
            }
          >
            <CalendarRange />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/feed/feedback"
            className={({ isActive }) =>
              isActive ? `${style.mobileNavLink} ${style.active}` : style.mobileNavLink
            }
          >
            <MessageCircle />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
