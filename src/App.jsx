// App.jsx
import Sidebar from "../src/layouts/default/Sidebar";
import Popup from "../src/components/core/Popup";
import AuditLogTable from "../src/pages/more/audit";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import { IconButton, Box } from "@mui/material";
import { FiMenu } from "react-icons/fi";
import { checkSetup, getData } from "./network/api/index";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSession } from "./utils/cacheHelper";
import { AuthProvider } from "./store/context";
import { HotKeys } from "react-hotkeys";
import Routing from "../src/routes/router";
import PageAnimate from "./components/Animate/PageAnimate";
import { useStore } from "./store/store";
import CommandPalette from "./components/core/CommandPallete";
import { useHotkeys } from "react-hotkeys-hook";
import styles from "./App.module.css";
import ReportsLayout from "./components/reports/ReportsLayout";
import Setup from "../src/pages/setup/Setup";
import Login from "../src/pages/user/Login";
import CustomerLogin from "../src/pages/customer/CustomerLogin";
import logo from "./assets/IndiaBills_logo.png";
import { getBaseURL } from "./network/api/api-config";
import NotificationPanel from "./components/Notifications/NotificationPanel";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const session = getSession();

  const { collapse, Organization } = useStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useHotkeys("ctrl+shift+p", (e) => {
    e.preventDefault();
    setIsCommandPaletteOpen(true);
  });

  const handleCloseCommandPalette = () => {
    setIsCommandPaletteOpen(false);
  };

  useEffect(() => {
    const fetchThemeColors = async () => {
      try {
        const data = await getData("/settings/theme/colors");
        document.documentElement.style.setProperty(
          "--color-primary",
          data.primary
        );
        document.documentElement.style.setProperty(
          "--color-accent",
          data.accent
        );
      } catch (err) {
        console.error("Error fetching theme colors:", err);
        // Optionally handle the error
      }
    };

    // TODO : Ask backend to implement the API
    // fetchThemeColors();
  }, []);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Let the router handle all redirects based on protected route wrappers
  // Don't auto-redirect here as it interferes with route matching

  const keyMap = {
    SHOW_POPUP: "ctrl+k",
    GO_HOME: "ctrl+h",
  };

  const handlers = {
    SHOW_POPUP: () => {
      console.log("Popup shortcut triggered");
    },
    GO_HOME: () => {
      navigate("/");
    },
  };

  // Determine if we should show the default layout (sidebar, header, etc.)
  // Exclude: /customer/* (customer portal), /operator/*, /manager/*, /setup, /login, /register, /register/:domain/* (public register), /organization/setup
  // Include: /customers (admin customer management - note the 's' at end)
  const showDefaultLayout =
    location.pathname !== "/setup" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    !location.pathname.startsWith("/register/") &&
    location.pathname !== "/organization/setup" &&
    !/^\/customer(\/|$)/.test(location.pathname) &&
    !location.pathname.startsWith("/operator") &&
    !location.pathname.startsWith("/manager");

  return (
    <AuthProvider>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div id="appbar" className={styles.appWrapper}>
          {/* Mobile Header with Menu Button - only for default layout */}
          {showDefaultLayout && (
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0.75rem 1rem', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
              <IconButton 
                onClick={handleMobileMenuToggle}
                sx={{ color: '#ffffff', position: 'absolute', left: '1rem' }}
              >
                <FiMenu size={24} />
              </IconButton>
              <img 
                src={Organization.logo ? `${getBaseURL()}/${Organization.logo}` : logo}
                alt="Logo"
                style={{ height: '45px', objectFit: 'contain' }}
              />
            </Box>
          )}
          {showDefaultLayout ? (
            // Default Layout (Sidebar + Content)
            <div className={styles.layoutWrapper}>
              {/* Sidebar */}
              <div
                className={`${styles.sidebarWrapper} ${
                  collapse ? styles.collapsed : ""
                }`}
              >
                <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
              </div>

              {/* Scrollable Main Content */}
              <div className={styles.contentWrapper}>
                <main className={styles.mainContent}>
                  <ReportsLayout>
                    <Routing />
                  </ReportsLayout>
                </main>
                <Popup />
                {/* <AuditLogTable /> */}
                {/* TODO : Ask backend to implement the pending API */}
              </div>
            </div>
          ) : (
            // Setup/Login/Customer Layout (No Sidebar, Header, etc.)
            <>
              <main className={styles.mainContent}>
                <ReportsLayout>
                  <Routing />
                </ReportsLayout>
              </main>
              <Popup />
            </>
          )}
        </div>

        <CommandPalette
          open={isCommandPaletteOpen}
          onClose={handleCloseCommandPalette}
        />
        
        {/* Notification Panel */}
        {session && <NotificationPanel />}
      </HotKeys>
    </AuthProvider>
  );
}

export default App;
