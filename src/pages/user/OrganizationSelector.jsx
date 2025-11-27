import { FiArrowRight, FiBriefcase, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/store';
import { switchOrganization, getUserOrganizations } from '../../network/api';
import { getTempSession, setSession, clearTempSession, setOrganizationContext } from '../../utils/authHelper';
import logo from '../../assets/IndiaBills_logo.png';
import bg from '../../assets/bglogo.png';
import styles from './OrganizationSelector.module.css';
import { Card, CardContent, Typography, Button, Grid, Avatar, Chip, Box, CircularProgress } from '@mui/material';

const OrganizationSelector = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        const tempSession = getTempSession();
        if (!tempSession) {
          errorPopup('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        const response = await getUserOrganizations();
        if (response.status === 200) {
          setOrganizations(response.data);
        } else {
          errorPopup('Failed to load organizations');
          navigate('/login');
        }
      } catch (error) {
        errorPopup('Failed to load organizations');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrganizations();
  }, [errorPopup, navigate]);

  const handleOrganizationSelect = async (org) => {
    setSwitching(true);
    try {
      const tempSession = getTempSession();
      if (!tempSession) {
        errorPopup('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      const response = await switchOrganization(org.id);
       if (response.status === 200) {
         const { token, activeOrg, subscription } = response.data;
         const finalSession = {
           id: tempSession.user.id,
           name: tempSession.user.name,
           email: tempSession.user.email,
           username: tempSession.user.username,
           role: activeOrg.role.toLowerCase(),
           token: token,
           organizationId: activeOrg.orgId,
           orgs: tempSession.user.orgs,
           subscription: subscription
         };
         setOrganizationContext({
           id: org.id,
           name: org.name,
           domain: org.domain,
           subdomain: org.subdomain,
           logoUrl: org.logoUrl,
           role: activeOrg.role.toLowerCase(),
           subscription: subscription
         });
        setSession(finalSession);
        login(finalSession);
        clearTempSession();
        successPopup(`Welcome to ${org.name}!`);
        if (activeOrg.role.toLowerCase() === 'admin') {
          navigate('/');
        } else if (activeOrg.role.toLowerCase() === 'operator') {
          navigate('/operator');
        } else if (activeOrg.role.toLowerCase() === 'customer') {
          navigate('/customer');
        } else {
          navigate('/');
        }
      } else {
        errorPopup('Failed to switch organization');
      }
    } catch {
      errorPopup('Failed to access organization');
    } finally {
      setSwitching(false);
    }
  };

  const handleCreateNewOrganization = () => {
    navigate('/organization/create');
  };

  const handleBackToLogin = () => {
    clearTempSession();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.backdrop}>
        <div className={styles.centerForm}>
          <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
          <CircularProgress className={styles.progress} />
          <Typography variant="h6" className={styles.loadingText}>
            Loading organizations...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.centerForm}>
        <div className={styles.header}>
          <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
          <Typography variant="h4" className={styles.title}>
            Select Organization
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Choose the organization you want to access
          </Typography>
        </div>
        {organizations.length > 0 ? (
          <Grid container spacing={3} className={styles.gridArea}>
            {organizations.map((org) => (
              <Grid item xs={12} md={6} lg={4} key={org.id}>
                <Card
                  className={styles.card}
                  onClick={() => !switching && handleOrganizationSelect(org)}
                  sx={{ opacity: switching ? 0.7 : 1 }}
                  elevation={3}
                >
                  <CardContent>
                    <div className={styles.cardHeader}>
                      <Avatar src={org.logoUrl}
                        alt={org.name}
                        sx={{ width: 60, height: 60 }}
                        className={styles.avatar}
                      >
                        <FiBriefcase />
                      </Avatar>
                      <div className={styles.infoArea}>
                        <Typography variant="h6" className={styles.orgName}>
                          {org.name}
                        </Typography>
                        <Typography variant="body2" className={styles.orgDomain}>
                          {org.domain ? `${org.subdomain}.${org.domain}` : org.subdomain}
                        </Typography>
                        <div className={styles.chipArea}>
                          <Chip label={org.role || 'Member'} color="primary" size="small" className={styles.roleChip} />
                          <Chip label={org.subscriptionStatus || 'active'}
                            color={org.subscriptionStatus === 'active' ? 'success' : 'warning'} size="small" />
                        </div>
                      </div>
                      <FiArrowRight className={styles.arrowIcon} />
                    </div>
                    <div className={styles.cardMeta}>
                      <p><strong>Status:</strong> {org.isActive ? 'Active' : 'Inactive'}</p>
                      {org.subscriptionStatus && (
                        <p><strong>Subscription:</strong> {org.subscriptionStatus}</p>
                      )}
                      <p><strong>Role:</strong> {org.role || 'Member'}</p>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className={styles.emptyState}>
            <FiBriefcase sx={{ fontSize: 80 }} className={styles.emptyIcon} />
            <Typography variant="h6" className={styles.emptyTitle}>
              No organizations found
            </Typography>
            <Typography variant="body1" className={styles.emptySubtext}>
              You don't have access to any organizations yet.
            </Typography>
          </div>
        )}
        <Box mt={4} className={styles.actionBox}>
          <Button
            variant="outlined"
            onClick={handleCreateNewOrganization}
            startIcon={<FiPlus />}
            disabled={switching}
            className={styles.actionBtn}
          >
            Create New Organization
          </Button>
          <Button
            variant="text"
            onClick={handleBackToLogin}
            disabled={switching}
            className={styles.actionBtn}
          >
            Back to Login
          </Button>
        </Box>
        {switching && (
          <Box mt={2} className={styles.switchingMsg}>
            <Typography variant="body2">
              Switching organization...
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default OrganizationSelector;
