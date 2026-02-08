import React, { useState } from "react";
import styles from "@styles/navbarFeed.module.scss"; // Changed import
import Logo from "@images/logo.jpg";
import { AuthContextProvider } from "@context/AuthContext";
import { useNotifications } from "@context/NotificationContext";
import { useLogout } from "@hooks/useLogout";
import useCurrentUser from "@hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { isSkSuperAdmin, isSkNaturalAdmin, isSkYouth } = AuthContextProvider();
  const { userData, profilePicture } = useCurrentUser();
  const logout = useLogout();
  const canManage = isSkSuperAdmin || isSkNaturalAdmin;
  const { notifications, unreadCount, markRead } = useNotifications();

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (notification.meta?.post_id || notification._apiData?.post_id) {
      const postId =
        notification.meta?.post_id || notification._apiData?.post_id;
      const commentId =
        notification.meta?.comment_id || notification._apiData?.comment_id;

      if (!notification.read) {
        markRead(notification.id);
      }
      setNotifOpen(false);

      if (commentId && notification.type === "comment") {
        navigate(`/feed?post=${postId}#comment-${commentId}`);
      } else {
        navigate(`/feed?post=${postId}`);
      }
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        {/* Left Section - Logo and Search */}
        <div className={styles.left_section}>
          <NavLink to="/feed" className={styles.logo_link}>
            <img src={Logo} alt="SKC Youth Hub" className={styles.logo} />
          </NavLink>

          <div className={styles.search_wrapper}>
            <Search className={styles.search_icon} />
            <input
              type="text"
              placeholder="Search SKC Youth Hub"
              className={styles.search_input}
            />
          </div>
        </div>

        {/* Center Section - Navigation Links (Desktop) */}
        <div className={styles.center_section}>
          <ul className={styles.nav_links}>
            <li className={styles.nav_item}>
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.nav_link} ${styles.active}`
                    : styles.nav_link
                }
              >
                <House className={styles.nav_icon} />
              </NavLink>
            </li>
            <li className={styles.nav_item}>
              <NavLink
                to="/feed/announcements"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.nav_link} ${styles.active}`
                    : styles.nav_link
                }
              >
                <Megaphone className={styles.nav_icon} />
              </NavLink>
            </li>
            <li className={styles.nav_item}>
              <NavLink
                to="/feed/activities"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.nav_link} ${styles.active}`
                    : styles.nav_link
                }
              >
                <CalendarRange className={styles.nav_icon} />
              </NavLink>
            </li>
            <li className={styles.nav_item}>
              <NavLink
                to="/feed/feedback"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.nav_link} ${styles.active}`
                    : styles.nav_link
                }
              >
                <MessageCircle className={styles.nav_icon} />
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className={styles.right_section}>
          <div className={styles.action_icons}>
            <div
              className={styles.action_icon}
              onClick={() => setNotifOpen(!isNotifOpen)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) =>
                e.key === "Enter" && setNotifOpen(!isNotifOpen)
              }
            >
              <Bell className={styles.icon} />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </div>
          </div>

          <div
            className={styles.profile_wrapper}
            onClick={() => setProfileOpen(!isProfileOpen)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) =>
              e.key === "Enter" && setProfileOpen(!isProfileOpen)
            }
          >
            <img
              src={
                profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userData?.name || "User",
                )}&background=007bff&color=fff`
              }
              alt="Profile"
              className={styles.avatar}
            />
            <span className={styles.user_name}>{userData?.name || "User"}</span>
          </div>

          {/* Backdrop for mobile */}
          {(isNotifOpen || isProfileOpen) && (
            <div
              className={styles.dropdown_backdrop}
              onClick={() => {
                setNotifOpen(false);
                setProfileOpen(false);
              }}
            />
          )}

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdown_header}>
                <h4>Notifications</h4>
              </div>
              <div className={styles.dropdown_list}>
                {notifications.length === 0 ? (
                  <div className={styles.dropdown_item}>
                    <div className={styles.item_content}>
                      <div className={styles.item_title}>No notifications</div>
                      <div className={styles.item_description}>
                        You're all caught up!
                      </div>
                    </div>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={styles.dropdown_item}
                      onClick={() => handleNotificationClick(notification)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleNotificationClick(notification)
                      }
                      style={{
                        cursor:
                          notification.meta?.post_id ||
                          notification._apiData?.post_id
                            ? "pointer"
                            : "default",
                      }}
                    >
                      <Bell className={styles.item_icon} />
                      <div className={styles.item_content}>
                        <div className={styles.item_title}>
                          {notification.title}
                        </div>
                        <div className={styles.item_description}>
                          {notification.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className={`${styles.dropdown} ${styles.profile_dropdown}`}>
              <div className={styles.profile_header}>
                <div className={styles.profile_avatar}>
                  <img
                    src={
                      profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData?.name || "User",
                      )}&background=007bff&color=fff`
                    }
                    alt="Profile"
                  />
                </div>
                <div className={styles.profile_info}>
                  <div className={styles.profile_name}>
                    {userData?.name || "User"}
                  </div>
                  <div className={styles.profile_role}>
                    {canManage
                      ? userData?.position || "Official"
                      : "Youth Member"}
                  </div>
                </div>
              </div>

              <div className={styles.dropdown_menu}>
                {canManage && (
                  <Link to="/dashboard" className={styles.dropdown_item}>
                    <Shield className={styles.dropdown_icon} />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to={canManage ? "/official-profile" : "/profile"}
                  className={styles.dropdown_item}
                >
                  <User className={styles.dropdown_icon} />
                  My Profile
                </Link>

                <Link
                  to={isSkYouth ? "/settings" : "/account"}
                  className={styles.dropdown_item}
                >
                  <Settings className={styles.dropdown_icon} />
                  Settings
                </Link>

                <div className={styles.divider}></div>

                <button onClick={logout} className={styles.dropdown_item}>
                  <LogOut className={styles.dropdown_icon} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className={styles.mobile_nav}>
          <div className={styles.mobile_nav_item}>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobile_nav_link} ${styles.active}`
                  : styles.mobile_nav_link
              }
            >
              <House className={styles.mobile_nav_icon} />
              <span className={styles.mobile_nav_label}>Home</span>
            </NavLink>
          </div>
          <div className={styles.mobile_nav_item}>
            <NavLink
              to="/feed/announcements"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobile_nav_link} ${styles.active}`
                  : styles.mobile_nav_link
              }
            >
              <Megaphone className={styles.mobile_nav_icon} />
              <span className={styles.mobile_nav_label}>News</span>
            </NavLink>
          </div>
          <div className={styles.mobile_nav_item}>
            <NavLink
              to="/feed/activities"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobile_nav_link} ${styles.active}`
                  : styles.mobile_nav_link
              }
            >
              <CalendarRange className={styles.mobile_nav_icon} />
              <span className={styles.mobile_nav_label}>Events</span>
            </NavLink>
          </div>
          <div className={styles.mobile_nav_item}>
            <NavLink
              to="/feed/feedback"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobile_nav_link} ${styles.active}`
                  : styles.mobile_nav_link
              }
            >
              <MessageCircle className={styles.mobile_nav_icon} />
              <span className={styles.mobile_nav_label}>Chat</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
