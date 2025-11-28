import { FiBarChart2, FiBriefcase, FiLogOut, FiSettings, FiShoppingCart, FiTool, FiRefreshCw, FiHelpCircle, FiArrowRightCircle, FiX } from 'react-icons/fi';
import { useState, useEffect } from "react";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import logo from "../../assets/IndiaBills_logo.png";
import { useNavigate } from "react-router-dom";
import buttons from "./sidebar_buttons";
import { fetchLogo, logout } from "../../network/api";
import { getBaseURL } from "../../network/api/api-config";
import { useAuth } from "../../hooks/useAuth";
import { setTempSession } from "../../utils/authHelper";
import { useMediaQuery, useTheme } from "@mui/material";
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

const Sidebar = ({ mobileOpen = false, setMobileOpen = () => {} }) => {
  const { collapse, openAudit, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  
  // NEW: State for Logout Dialog
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  // Mobile responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // sm is 600px
  
  // Close mobile menu when navigation happens
  useEffect(() => {
    if (mobileOpen && isMobile) {
      setMobileOpen(false);
    }
  }, [selectedPath, isMobile]);

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
    if (!showUserMenu) {
      setExpandedGroup(null); // Close any open group when opening user menu
    }
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
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.active : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      
      <div className={`${styles.sidebar} ${collapse ? styles.collapsed : ""} ${isMobile && mobileOpen ? styles.mobileOpen : ""}`}>
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
          {session.avatar ? (
            <img
              src={`${getBaseURL()}/${session.avatar}`}
              alt="User Avatar"
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={styles.avatarFallback}
            style={session.avatar ? { display: 'none' } : {}}
          >
            {session.name
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{session.name}</p>
            <p className={styles.userRole}>{session.role}</p>
          </div>
        </div>

        {showUserMenu && (
          <div className={styles.userMenu}>
            {session.orgs && session.orgs.length > 1 && (
              <button className={styles.menuItem} onClick={handleSwitchOrganization}>
                <FiArrowRightCircle className={styles.menuIcon} />
                Switch Organization
              </button>
            )}
            <button className={styles.menuItem} onClick={() => window.location.reload()}>
              <FiRefreshCw className={styles.menuIcon} />
              Refresh
            </button>
            {/* <button className={styles.menuItem} onClick={() => navigate("/help")}>
              <FiHelpCircle className={styles.menuIcon} />
              Get Help
            </button> */}
            {/* <button className={styles.menuItem} onClick={() => navigate("/settings")}>
              <FiSettings className={styles.menuIcon} />
              Settings
            </button> */}
            {/* Logout - shows dialog for admin, direct logout for others */}
            <button
              className={styles.menuItem}
              onClick={handleLogoutClick}
            >
              <FiLogOut className={styles.menuIcon} />
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
        PaperProps={{
          sx: {
            backgroundColor: "#1e293b",
            backgroundImage: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#ffffff",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: "600",
            borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
            color: "#f1f5f9"
          }}
        >
          Logout Options
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem"
          }}
        >
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{
              color: "#cbd5e1",
              marginBottom: "1.5rem",
              fontSize: "0.95rem"
            }}
          >
            How would you like to logout?
          </Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Button
              variant="outlined"
              onClick={handleLogoutOrg}
              startIcon={<FiSettings />}
              fullWidth
              sx={{
                borderColor: "rgba(148, 163, 184, 0.5)",
                color: "#94a3b8",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: "500",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#64748b",
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                  color: "#cbd5e1"
                }
              }}
            >
              Logout from Current Organization
            </Button>
            <Button
              variant="contained"
              onClick={handleLogoutAll}
              startIcon={<FiLogOut />}
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#ffffff",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: "600",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                  boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)"
                }
              }}
            >
              Logout from All Organizations
            </Button>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            padding: "1rem"
          }}
        >
          <Button 
            onClick={() => setLogoutDialog(false)}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(148, 163, 184, 0.1)",
                color: "#cbd5e1"
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};

export default Sidebar;