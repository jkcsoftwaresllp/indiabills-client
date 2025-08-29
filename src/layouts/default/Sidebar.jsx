import React, { useState, useEffect } from "react";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import logo from "../../assets/IndiaBills_logo.png";
import { useNavigate } from "react-router-dom";
import buttons from "./sidebar_buttons";
import { fetchLogo } from "../../network/api";
import { getBaseURL } from "../../network/api/api-config";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Sidebar.module.css";

// React Icons
import {
  FiBarChart2,
  FiBriefcase,
  FiSettings,
  FiShoppingCart,
  FiTool,
} from "react-icons/fi";

const groupIcons = {
  // Dashboard: "\u{1F4CA}",
  // Dashboard: "\u2302",   // House icon
  Dashboard: <FiBarChart2 />,
  // Management: "\u{1F4BC}",
  // Management: "\u2699",  // Gear icon
  Management: <FiBriefcase />,
  // Operations: "\u{1F6E0}",
  // Operations: "\u2692", // Hammer and Pick
  Operations: <FiTool />,
  // Shop: "\u{1F6D2}",
  // Shop: "\u26D1",       // Shopping Cart
  Shop: <FiShoppingCart />,
  // "Setup Dashboard": "\u{1F9F0}", // Toolbox
  "Setup Dashboard": <FiSettings />,
};

const Sidebar = () => {
  const { collapse, setCollapse, openAudit, Organization, setOrganization } =
    useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // useEffect(() => {
  //   if (
  //     session !== null &&
  //     !logoFetched &&
  //     (!Organization.logo || Organization.logo === "")
  //   ) {
  //     fetchLogo().then((res) => {
  //       setOrganization({ ...res, fiscalStart: res.fiscalStart.split("T")[0] });
  //       setLogoFetched(true);
  //     });
  //   }
  // }, [session, Organization, setOrganization, logoFetched]);

  if (session === null) {
    return null;
  }

  const userRole = session.role;

  const filteredGroups = buttons
    .map((group) => ({
      ...group,
      items: group.items.filter((button) => button.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  const handleItemClick = (path) => {
    navigate(path);
    setSelectedPath(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleViewOrganization = () => {
    navigate("/organization");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleGroup = (groupName) => {
    if (expandedGroup === groupName) {
      setExpandedGroup(null); // Collapse if already open
    } else {
      setExpandedGroup(groupName); // Open the clicked group
    }
  };

  return (
    <div className={`${styles.sidebar} ${collapse ? styles.collapsed : ""}`}>
      <div className={styles.logoContainer}>
        {Organization.logo ? (
          <img
            src={`${getBaseURL()}/${Organization.logo}`}
            onClick={handleViewOrganization}
            alt="Logo"
            className={styles.logo}
          />
        ) : (
          <img
            src={logo}
            onClick={handleViewOrganization}
            alt="Logo"
            className={styles.logo}
          />
        )}
        <h1 className={styles.orgName}>{Organization.name}</h1>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {filteredGroups.map((group) => (
          <div key={group.group} className={styles.group}>
            <button
              className={styles.groupTitle}
              onClick={() => toggleGroup(group.group)}
            >
              <span className={styles.groupIcon}>
                {groupIcons[group.group] || <FiSettings />}
              </span>
              {group.group}
            </button>
            {expandedGroup === group.group && (
              <ul>
                {group.items.map((button) => (
                  <li key={button.label}>
                    <button
                      className={`${styles.navItem} ${
                        selectedPath === button.to ? styles.active : ""
                      }`}
                      onClick={() => handleItemClick(button.to)}
                    >
                      <span className={styles.icon}>{button.icon}</span>
                      {button.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo} onClick={toggleUserMenu}>
          <img
            src={`${getBaseURL()}/${session.avatar}`}
            alt="User Avatar"
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <p className={styles.userName}>{session.name}</p>
            <p className={styles.userRole}>{session.role}</p>
          </div>
        </div>

        {showUserMenu && (
          <div className={styles.userMenu}>
            {session.role === "admin" && (
              <button className={styles.menuItem} onClick={openAudit}>
                Audit
              </button>
            )}
            <button
              className={styles.menuItem}
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <button
              className={styles.menuItem}
              onClick={() => navigate("/help")}
            >
              Get Help
            </button>
            <button
              className={styles.menuItem}
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
