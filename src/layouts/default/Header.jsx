import { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Avatar, Popover, MenuItem, Typography, Box, Container, useMediaQuery, useTheme, } from "@mui/material";
import ExpandIcon from "@mui/icons-material/Expand";
import DvrIcon from "@mui/icons-material/Dvr";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import CachedIcon from "@mui/icons-material/Cached";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { getSession } from "../../utils/cacheHelper";
import { useStore } from "../../store/store";
import { useAuth } from "../../hooks/useAuth";
import { fetchLogo } from "../../network/api";
import { useNavigate } from "react-router-dom";
import DivAnimate from "../../components/Animate/DivAnimate";
import { getBaseURL } from "../../network/api/api-config";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const navigate = useNavigate();
  const { collapse, setCollapse, openAudit, Organization, setOrganization, setFiscalStart } = useStore();
  const { logout } = useAuth();
  const session = getSession();

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   if (session !== null && !logoFetched && (!Organization.logo || Organization.logo === "")) {
  //     fetchLogo().then((res) => {
  //       console.log(res);
  //       setOrganization({ ...Organization, logo: res });
  //       setFiscalStart(res.fiscalStart);
        
  //       setLogoFetched(true);
  //     });
  //   }
  // }, [session, Organization, setOrganization, logoFetched, setFiscalStart]);

  if (session === null) {
    return null;
  }

  return (
    <DivAnimate>
      <AppBar id="appbar" position="fixed" color="default" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={`${getBaseURL()}/${Organization.logo}`}
                onClick={handleViewOrganization}
                alt="Logo"
                style={{ marginLeft:'1rem', height: '3rem', cursor: 'pointer' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'transparent', borderRadius: 1, p: 1, boxShadow: 0 }}>
                <Avatar
                  alt={session.name}
                  src={`${getBaseURL()}/${session.avatar}`}
                />
                {!isMobile && (
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {session.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                      {session.role}
                    </Typography>
                  </Box>
                )}
                <IconButton onClick={handleMenuClick}>
                  <ArrowDropDownRoundedIcon />
                </IconButton>
              </Box>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 200, borderRadius: 20, padding: '0.4rem' }}>
                  <MenuItem sx={{ padding: '.6rem' }} onClick={() => { setCollapse(); handleMenuClose(); }}>
                    <ExpandIcon sx={{ mr: 1 }} />
                    {sidebarState}
                  </MenuItem>
                  {session.role === "admin" && (
                    <MenuItem sx={{ padding: '.6rem' }} onClick={() => { openAudit(); handleMenuClose(); }}>
                      <DvrIcon sx={{ mr: 1 }} />
                      Audit
                    </MenuItem>
                  )}
                  <MenuItem sx={{ padding: '.6rem' }} onClick={() => { window.location.reload(); handleMenuClose(); }}>
                    <CachedIcon sx={{ mr: 1 }} />
                    Refresh
                  </MenuItem>
                  <MenuItem sx={{ padding: '.6rem' }} onClick={() => { navigate('/help'); handleMenuClose(); }}>
                    <ContactSupportRoundedIcon sx={{ mr: 1 }} />
                    Get Help
                  </MenuItem>
                  <MenuItem sx={{ padding: '.6rem' }} onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                    <TuneRoundedIcon sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  <MenuItem sx={{ padding: '.6rem' }} onClick={handleLogout}>
                    <LogoutRoundedIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Box>
              </Popover>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </DivAnimate>
  );
};

export default Header;
