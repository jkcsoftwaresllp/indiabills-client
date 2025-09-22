import React, { useState } from "react";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import logo from "../../assets/IndiaBills_logo.png";
import { useNavigate } from "react-router-dom";
import buttons from "./sidebar_buttons";
import { fetchLogo, logout } from "../../network/api";
import { getBaseURL } from "../../network/api/api-config";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Sidebar.module.css";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

// Icons
import { FiBarChart2, FiBriefcase, FiSettings, FiShoppingCart, FiTool } from "react-icons/fi";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const groupIcons = {
  Dashboard: <FiBarChart2 />,
  Management: <FiBriefcase />,
  Operations: <FiTool />,
  Shop: <FiShoppingCart />,
  "Setup Dashboard": <FiSettings />,
};

const Sidebar = () => {
  const { collapse, openAudit, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // NEW: State for Logout Dialog
  const [logoutDialog, setLogoutDialog] = useState(false);

  if (session === null) return null;

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

  // Logout from ALL orgs
  const handleLogoutAll = async () => {
    try {
      const response = await logout("ALL");
      if (response.status === 200) {
        authLogout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      authLogout();
      navigate("/login");
    }
  };

  // Logout from current org only
  const handleLogoutOrg = async () => {
    try {
      const response = await logout("ORG");
      if (response.status === 200) {
        localStorage.removeItem("session");
        localStorage.removeItem("organizationContext");
        navigate("/organization-selector");
      }
    } catch (error) {
      console.error("Organization logout error:", error);
      navigate("/organization-selector");
    }
  };

  const handleViewOrganization = () => {
    navigate("/organization");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  return (
    <div className={`${styles.sidebar} ${collapse ? styles.collapsed : ""}`}>
      {/* Logo Section */}
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

      {/* User Section */}
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
            <button className={styles.menuItem} onClick={() => window.location.reload()}>
              Refresh
            </button>
            <button className={styles.menuItem} onClick={() => navigate("/help")}>
              Get Help
            </button>
            <button className={styles.menuItem} onClick={() => navigate("/settings")}>
              Settings
            </button>
            {/* NEW: Logout triggers dialog */}
            <button
              className={styles.menuItem}
              onClick={() => setLogoutDialog(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Options Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Logout Options</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            How would you like to logout?
          </Typography>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Button
              variant="outlined"
              onClick={handleLogoutOrg}
              startIcon={<SwitchAccountIcon />}
              fullWidth
            >
              Logout from Current Organization
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogoutAll}
              startIcon={<LogoutRoundedIcon />}
              fullWidth
            >
              Logout from All Organizations
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
