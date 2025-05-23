// Sidebar.jsx
import { useState, useEffect } from "react";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import logo from "../../assets/IndiaBills_logo.png";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, ListSubheader, Box, Avatar, Typography, Popover, MenuItem, Divider, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ExpandIcon from "@mui/icons-material/Expand";
import DvrIcon from "@mui/icons-material/Dvr";
import CachedIcon from "@mui/icons-material/Cached";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import buttons from "./sidebar_buttons";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLogo } from "../../network/api";
import { getBaseURL } from "../../network/api/api-config";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { collapse, setCollapse, openAudit, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [expandedGroup, setExpandedGroup] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);

  useEffect(() => {
    if (
      session !== null &&
      !logoFetched &&
      (!Organization.logo || Organization.logo === "")
    ) {
      fetchLogo().then((res) => {
        setOrganization({ ...res, fiscalStart: res.fiscalStart.split("T")[0] });
        setLogoFetched(true);
      });
    }
  }, [session, Organization, setOrganization, logoFetched]);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const handleItemClick = (groupName, path) => {
    navigate(path);
    setExpandedGroup(groupName);
    setSelectedPath(path);
  };

  const variants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleViewOrganization = () => {
    navigate("/organization");
  };

  const sidebarState = collapse ? "Expand" : "Collapse";

  // console.log(Organization)

  const drawer = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Organization Logo at the Top */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {Organization.logo ? (
          <img
            src={`${getBaseURL()}/${Organization.logo}`}
            onClick={handleViewOrganization}
            alt="Logo"
            style={{ height: "3rem", cursor: "pointer" }}
          />
        ) : (
          <img
            src={logo}
            onClick={handleViewOrganization}
            alt="Logo"
            style={{ height: "3rem", cursor: "pointer" }}
          />
        )}{" "}
        <h1 className="text-sm mt-1 text-white">{Organization.name}</h1>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {filteredGroups.map((group) => (
          <div
            key={group.group}
            onMouseEnter={() => setHoveredGroup(group.group)}
            onMouseLeave={() => setHoveredGroup(null)}
            style={{ position: "relative" }}
          >
            <ListSubheader
              sx={{
                backgroundColor: "transparent",
                color: "#f1f1e6",
                fontWeight: "bold",
                cursor: "default",
                textAlign: "center",
                pt: 2,
                pb: 2,
              }}
            >
              {group.group}
            </ListSubheader>
            <AnimatePresence>
              {(expandedGroup === group.group ||
                hoveredGroup === group.group) && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                >
                  <List component="div" disablePadding>
                    {group.items.map((button) => (
                      <ListItem
                        button
                        key={button.label}
                        onClick={() => handleItemClick(group.group, button.to)}
                        selected={selectedPath === button.to}
                        sx={{
                          pl: 4,
                          "&:hover": { backgroundColor: "#334155" },
                          backgroundColor:
                            selectedPath === button.to ? "#f8fafc" : "inherit",
                        }}
                      >
                        <ListItemIcon sx={{ color: "#b9c5d8" }}>
                          {button.icon}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                          sx={{ color: "#b9c5d8" }}
                          primary={button.label}
                        />
                      </ListItem>
                    ))}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </List>

      {/* User Info and Settings at the Bottom */}
      <Box sx={{ p: 2, borderTop: "1px solid #334155" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={session.name}
            src={`${getBaseURL()}/${session.avatar}`}
            sx={{ width: 32, height: 32 }}
          />
          {!isMobile && (
            <Box sx={{ ml: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  fontSize: "0.875rem",
                }}
              >
                {session.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  ml: "2px",
                  color: "beige",
                  textTransform: "capitalize",
                  fontSize: "0.75rem",
                }}
              >
                {session.role}
              </Typography>
            </Box>
          )}
          <IconButton onClick={handleMenuClick} sx={{ color: "#ffffff" }}>
            <ArrowDropDownRoundedIcon />
          </IconButton>
        </Box>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: 200,
              p: 1,
            }}
          >
            {session.role === "admin" && (
              <MenuItem
                sx={{ padding: ".6rem" }}
                onClick={() => {
                  openAudit();
                  handleMenuClose();
                }}
              >
                <DvrIcon sx={{ mr: 1 }} />
                Audit
              </MenuItem>
            )}
            <MenuItem
              sx={{ padding: ".6rem" }}
              onClick={() => {
                window.location.reload();
                handleMenuClose();
              }}
            >
              <CachedIcon sx={{ mr: 1 }} />
              Refresh
            </MenuItem>
            <MenuItem
              sx={{ padding: ".6rem" }}
              onClick={() => {
                navigate("/help");
                handleMenuClose();
              }}
            >
              <ContactSupportRoundedIcon sx={{ mr: 1 }} />
              Get Help
            </MenuItem>
            <MenuItem
              sx={{ padding: ".6rem" }}
              onClick={() => {
                navigate("/settings");
                handleMenuClose();
              }}
            >
              <TuneRoundedIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem sx={{ padding: ".6rem" }} onClick={handleLogout}>
              <LogoutRoundedIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Box>
        </Popover>
      </Box>
    </div>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={isMobile ? mobileOpen : !collapse}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
            height: "100vh",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
