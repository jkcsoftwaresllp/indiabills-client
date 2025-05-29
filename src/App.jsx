import Sidebar from "../src/layouts/default/Sidebar";
import Popup from "../src/components/core/Popup";
import AuditLogTable from "../src/pages/more/audit";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import Header from "./layouts/default/Header";
import {checkSetup, getData} from "./network/api/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "./utils/cacheHelper";
import { AuthProvider } from "./store/context";
import { HotKeys } from "react-hotkeys";
import Routing from "../src/routes/router";
import PageAnimate from "./components/Animate/PageAnimate";
import { useStore } from "./store/store";
import CommandPalette from "./components/core/CommandPallete";
import { useHotkeys } from 'react-hotkeys-hook';

function App() {
  const navigate = useNavigate();
  const session = getSession();

  const { collapse } = useStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useHotkeys('ctrl+shift+p', (e) => {
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
        document.documentElement.style.setProperty("--color-primary", data.primary);
        document.documentElement.style.setProperty("--color-accent", data.accent);
      } catch (err) {
        console.error("Error fetching theme colors:", err);
        // Optionally handle the error
      }
    };

    fetchThemeColors();
  }, []);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (session === null) {
        const answer = await checkSetup();
        if (answer) {
          navigate("/setup");
        } else {
          navigate("/login");
        }
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

  return (
    <AuthProvider>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div id="appbar" className="min-h-screen flex flex-col relative">
          {/* 2 types of routes -- public and private */}
          {/*<Header />*/}
          <main className="flex flex-grow min-h-full max-h-full">
            <div id="content" className="flex relative flex-grow min-h-full max-h-full">
              <div className="h-full bg-transparent overscroll-none">
                <Sidebar /> 
              </div>
              <div className={'py-2 w-full flex flex-col'}>
              <main className="min-h-full w-full shadow-inner"> <Routing /> </main>
              </div>
              <Popup />
              <AuditLogTable />
            </div>
          </main>
        </div>
      </HotKeys>
      <CommandPalette
        open={isCommandPaletteOpen}
        onClose={handleCloseCommandPalette}
      />
    </AuthProvider>
  );
}

export default App;
