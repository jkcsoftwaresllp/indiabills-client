// App.jsx
import Sidebar from "../src/layouts/default/Sidebar";
import Popup from "../src/components/core/Popup";
import AuditLogTable from "../src/pages/more/audit";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import Header from "./layouts/default/Header";
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

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const session = getSession();

  const { collapse } = useStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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

  useEffect(() => {
    async function fetchData() {
      if (session === null) {
        // Always redirect to unified login page
        navigate("/login");
      }
    }

    fetchData().then();
  }, []);

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
  const showDefaultLayout =
    location.pathname !== "/setup" && 
    location.pathname !== "/login" && 
    !location.pathname.startsWith('/customer') &&
    !location.pathname.startsWith('/operator');

  return (
    <AuthProvider>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div id="appbar" className={styles.appWrapper}>
          {showDefaultLayout ? (
            // Default Layout (Sidebar + Content)
            <div className={styles.layoutWrapper}>
              {/* Sidebar */}
              <div
                className={`${styles.sidebarWrapper} ${
                  collapse ? styles.collapsed : ""
                }`}
              >
                <Sidebar />
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
            <main className={styles.mainContent}>
              <ReportsLayout>
                <Routing />
              </ReportsLayout>
            </main>
          )}
        </div>

        <CommandPalette
          open={isCommandPaletteOpen}
          onClose={handleCloseCommandPalette}
        />
      </HotKeys>
    </AuthProvider>
  );
}

export default App;
