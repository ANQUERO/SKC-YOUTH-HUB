import React, { useState } from 'react';
import style from '@styles/navbarFeed.module.scss';
import Logo from '@images/logo.jpg';
import Avatar from '@images/hero.jpg';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <nav className={style.nav}>
      {/* Logo and Search */}
      <div className={style.logoWrapper}>
        <img src={Logo} alt="App Logo" />
        <input
          type="search"
          className={style.searchInput}
          placeholder="Search..."
        />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className={style.menuToggle}
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Navigation Links */}
      <ul className={`${style.navLinks} ${isMobileMenuOpen ? style.mobileOpen : ''}`}>
        <li><NavLink to="/posts" className={style.navLink}>All post</NavLink></li>
        <li><NavLink to="/announcements" className={style.navLink}>Announcement</NavLink></li>
        <li><NavLink to="/activities" className={style.navLink}>Activities</NavLink></li>
        <li><NavLink to="/feedback" className={style.navLink}>Feedback/Suggestion</NavLink></li>
      </ul>

      {/* Icons & Profile */}
      <div className={style.actions}>
        <div className={style.iconWrapper}>
          <Bell onClick={() => setNotifOpen(!isNotifOpen)} className={style.icon} />
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


        <div className={style.profileWrapper} onClick={() => setProfileOpen(!isProfileOpen)}>
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
    </nav>
  );
};
