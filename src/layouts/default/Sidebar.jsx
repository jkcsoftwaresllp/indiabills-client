import { FiBarChart2, FiBriefcase, FiLogOut, FiSettings, FiShoppingCart, FiTool } from 'react-icons/fi';
import { useState } from "react";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import logo from "../../assets/IndiaBills_logo.png";
import { useNavigate } from "react-router-dom";
import buttons from "./sidebar_buttons";
import { fetchLogo, logout } from "../../network/api";
import { getBaseURL } from "../../network/api/api-config";
import { useAuth } from "../../hooks/useAuth";
import { setTempSession } from "../../utils/authHelper";
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
    .map((item) => {
      // Handle independent items
      if (!item.group) {
        return item.roles.includes(userRole) ? item : null;
      }
      // Handle grouped items
      return {
        ...item,
        items: item.items.filter((button) => button.roles.includes(userRole)),
      };
    })
    .filter((item) => {
      if (!item) return false;
      // For independent items, just check if they exist
      if (item.to) return true;
      // For groups, check if they have items
      return item.items.length > 0;
    });

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
        // Keep the token but clear current org context
        const currentSession = getSession();
        if (currentSession) {
          // Set temp session for org selection
          const tempSessionData = {
            token: currentSession.token,
            user: {
              id: currentSession.id,
              name: currentSession.name,
              email: currentSession.email,
              username: currentSession.username,
              orgs: currentSession.orgs
            }
          };
          localStorage.setItem('tempUserSession', JSON.stringify(tempSessionData));
        }
        // Clear current session and org context
        localStorage.removeItem('session');
        localStorage.removeItem('organizationContext');
        navigate("/organization-selector");
      }
    } catch (error) {
      console.error("Organization logout error:", error);
      // Fallback: clear session and go to org selector
      const currentSession = getSession();
      if (currentSession) {
        localStorage.setItem('tempUserSession', JSON.stringify({
          token: currentSession.token,
          user: {
            id: currentSession.id,
            name: currentSession.name,
            email: currentSession.email,
            username: currentSession.username,
            orgs: currentSession.orgs
          }
        }));
      }
      localStorage.removeItem('session');
      localStorage.removeItem('organizationContext');
      navigate("/organization-selector");
    }
  };

  const handleViewOrganization = () => {
    navigate("/organization");
  };

  const handleSwitchOrganization = () => {
    // Set temp session for organization selector
    const tempSessionData = {
      token: session.token,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        username: session.username,
        orgs: session.orgs
      }
    };
    setTempSession(tempSessionData);
    setShowUserMenu(false);
    navigate('/organization-selector');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  // Handle logout - show dialog only for admin, direct logout for others
  const handleLogoutClick = () => {
    if (userRole === "admin") {
      setLogoutDialog(true);
    } else {
      handleLogoutAll();
    }
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
        {filteredGroups.map((item) => {
          // Render independent item (no group) - styled as a group with single item
          if (item.to && !item.group) {
            return (
              <div key={item.label} className={styles.group}>
                <button
                  className={`${styles.groupTitle} ${
                    selectedPath === item.to ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(item.to)}
                >
                  <span className={styles.groupIcon}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </div>
            );
          }
          // Render grouped items
          return (
            <div key={item.group} className={styles.group}>
              <button
                className={styles.groupTitle}
                onClick={() => toggleGroup(item.group)}
              >
                <span className={styles.groupIcon}>
                  {groupIcons[item.group] || <FiSettings />}
                </span>
                {item.group}
              </button>
              {expandedGroup === item.group && (
                <ul>
                  {item.items.map((button) => (
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
          );
        })}
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
            {session.orgs && session.orgs.length > 1 && (
            <button className={styles.menuItem} onClick={handleSwitchOrganization}>
            <FiSettings style={{ marginRight: '8px' }} />
            Switch Organization
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
            {/* Logout - shows dialog for admin, direct logout for others */}
            <button
              className={styles.menuItem}
              onClick={handleLogoutClick}
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
              startIcon={<FiSettings />}
              fullWidth
            >
              Logout from Current Organization
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogoutAll}
              startIcon={<FiLogOut />}
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