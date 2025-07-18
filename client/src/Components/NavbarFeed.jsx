import React, { useState } from 'react';
import style from '@styles/navbarFeed.module.scss';
import Logo from '@images/logo.jpg';
import Avatar from '@images/hero.jpg';
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
          <span className={style.badge}>3</span>

          {isNotifOpen && (
            <div className={style.dropdown}>
              <p>You have 3 new notifications</p>
              <ul>
                <li>New comment on your post</li>
                <li>Announcement posted</li>
                <li>Activity starts soon</li>
              </ul>
            </div>
          )}
        </div>

        <div
          className={style.profileWrapper}
          onClick={() => setProfileOpen(!isProfileOpen)}
        >
          <img src={Avatar} alt="Profile" className={style.avatar} />
          {isProfileOpen && (
            <div className={style.dropdown}>
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                <li>Logout</li>
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
