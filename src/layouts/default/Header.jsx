import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Popover,
  MenuItem,
  Typography,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import ExpandIcon from '@mui/icons-material/Expand';
import DvrIcon from '@mui/icons-material/Dvr';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CachedIcon from '@mui/icons-material/Cached';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import BusinessIcon from '@mui/icons-material/Business';
import { getSession, getOrganizationContext } from '../../utils/cacheHelper';
import { useStore } from '../../store/store';
import { useAuth } from '../../hooks/useAuth';
import { logout, switchOrganization, getUserOrganizations } from '../../network/api';
import { useNavigate } from 'react-router-dom';
import DivAnimate from '../../components/Animate/DivAnimate';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orgSwitchDialog, setOrgSwitchDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [switchingOrg, setSwitchingOrg] = useState(false);
  const navigate = useNavigate();
  const {
    collapse,
    setCollapse,
    openAudit,
    Organization,
    setOrganization,
  } = useStore();
  const { logout: authLogout } = useAuth();
  const session = getSession();
  const orgContext = getOrganizationContext();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutAll = async () => {
    try {
      await logout('ALL');
      authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      authLogout();
      navigate('/login');
    }
  };

  const handleLogoutOrg = async () => {
    try {
      await logout('ORG');
      navigate('/organization-selector');
    } catch (error) {
      console.error('Organization logout error:', error);
      navigate('/organization-selector');
    }
  };

  const handleSwitchOrganization = async () => {
    try {
      const response = await getUserOrganizations();
      if (response.status === 200) {
        setOrganizations(response.data);
        setOrgSwitchDialog(true);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
    handleMenuClose();
  };

  const handleOrgSwitch = async (orgId) => {
    setSwitchingOrg(true);
    try {
      const response = await switchOrganization(orgId);
      if (response.status === 200) {
        // Reload the page to refresh with new organization context
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching organization:', error);
    } finally {
      setSwitchingOrg(false);
      setOrgSwitchDialog(false);
    }
  };

  const handleViewOrganization = () => {
    navigate('/organization');
  };

  const sidebarState = collapse ? 'Expand' : 'Collapse';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (session === null) {
    return null;
  }

  return (
    <DivAnimate>
      <AppBar
        id="appbar"
        position="fixed"
        color="default"
        elevation={1}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Container
            maxWidth="xl"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={orgContext?.logoUrl || Organization.logo || logo}
                onClick={handleViewOrganization}
                alt="Logo"
                style={{
                  marginLeft: '1rem',
                  height: '3rem',
                  cursor: 'pointer',
                }}
              />
              {!isMobile && orgContext && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {orgContext.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {orgContext.domain ? `${orgContext.subdomain}.${orgContext.domain}` : orgContext.subdomain}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'transparent',
                  borderRadius: 1,
                  p: 1,
                  boxShadow: 0,
                }}
              >
                <Avatar
                  alt={session.name}
                  src={session.avatar ? `${process.env.REACT_APP_SERVER_URL}/${session.avatar}` : undefined}
                />
                {!isMobile && (
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    >
                      {session.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ textTransform: 'capitalize' }}
                    >
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 200,
                    borderRadius: 20,
                    padding: '0.4rem',
                  }}
                >
                  <MenuItem
                    sx={{ padding: '.6rem' }}
                    onClick={() => {
                      setCollapse();
                      handleMenuClose();
                    }}
                  >
                    <ExpandIcon sx={{ mr: 1 }} />
                    {sidebarState}
                  </MenuItem>
                  
                  {session.orgs && session.orgs.length > 1 && (
                    <MenuItem
                      sx={{ padding: '.6rem' }}
                      onClick={handleSwitchOrganization}
                    >
                      <SwitchAccountIcon sx={{ mr: 1 }} />
                      Switch Organization
                    </MenuItem>
                  )}
                  
                  <MenuItem
                    sx={{ padding: '.6rem' }}
                    onClick={() => {
                      handleViewOrganization();
                      handleMenuClose();
                    }}
                  >
                    <BusinessIcon sx={{ mr: 1 }} />
                    Organization
                  </MenuItem>
                  
                  {session.role === 'admin' && (
                    <MenuItem
                      sx={{ padding: '.6rem' }}
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
                    sx={{ padding: '.6rem' }}
                    onClick={() => {
                      window.location.reload();
                      handleMenuClose();
                    }}
                  >
                    <CachedIcon sx={{ mr: 1 }} />
                    Refresh
                  </MenuItem>
                  
                  <MenuItem
                    sx={{ padding: '.6rem' }}
                    onClick={() => {
                      navigate('/help');
                      handleMenuClose();
                    }}
                  >
                    <ContactSupportRoundedIcon sx={{ mr: 1 }} />
                    Get Help
                  </MenuItem>
                  
                  <MenuItem
                    sx={{ padding: '.6rem' }}
                    onClick={() => {
                      navigate('/settings');
                      handleMenuClose();
                    }}
                  >
                    <TuneRoundedIcon sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem 
                    sx={{ padding: '.6rem' }} 
                    onClick={() => {
                      setLogoutDialog(true);
                      handleMenuClose();
                    }}
                  >
                    <LogoutRoundedIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Box>
              </Popover>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Organization Switch Dialog */}
      <Dialog
        open={orgSwitchDialog}
        onClose={() => !switchingOrg && setOrgSwitchDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Switch Organization</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {organizations.map((org) => (
              <Grid item xs={12} key={org.id}>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => !switchingOrg && handleOrgSwitch(org.id)}
                  sx={{ 
                    opacity: switchingOrg ? 0.7 : 1,
                    border: orgContext?.id === org.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <div className="flex items-center gap-3">
                      <Avatar src={org.logoUrl} sx={{ width: 40, height: 40 }}>
                        <BusinessIcon />
                      </Avatar>
                      <div className="flex-1">
                        <Typography variant="subtitle1" className="font-semibold">
                          {org.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {org.domain ? `${org.subdomain}.${org.domain}` : org.subdomain}
                        </Typography>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Chip 
                          label={org.role} 
                          color="primary" 
                          size="small"
                          className="capitalize"
                        />
                        {orgContext?.id === org.id && (
                          <Chip label="Current" color="success" size="small" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {switchingOrg && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Switching organization...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrgSwitchDialog(false)} disabled={switchingOrg}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                handleLogoutOrg();
                setLogoutDialog(false);
              }}
              startIcon={<SwitchAccountIcon />}
              fullWidth
            >
              Logout from Current Organization
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleLogoutAll();
                setLogoutDialog(false);
              }}
              startIcon={<LogoutRoundedIcon />}
              fullWidth
            >
              Logout from All Organizations
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DivAnimate>
  );
};

export default Header;