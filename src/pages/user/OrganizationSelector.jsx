import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/store';
import { switchOrganization, getUserOrganizations } from '../../network/api';
import { getTempSession, setSession, clearTempSession, setOrganizationContext } from '../../utils/authHelper';
import logo from '../../assets/IndiaBills_logo.png';
import bg from '../../assets/bglogo.png';
import styles from './Login.module.css';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

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
        console.error('Error fetching organizations:', error);
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
        const { token, activeOrg } = response.data;
        
        // Create final session
        const finalSession = {
          id: tempSession.user.id,
          name: tempSession.user.name,
          email: tempSession.user.email,
          username: tempSession.user.username,
          role: activeOrg.role.toLowerCase(),
          token: token,
          organizationId: activeOrg.orgId,
          orgs: tempSession.user.orgs
        };

        // Set organization context
        setOrganizationContext({
          id: org.id,
          name: org.name,
          domain: org.domain,
          subdomain: org.subdomain,
          logoUrl: org.logoUrl,
          role: activeOrg.role.toLowerCase()
        });

        setSession(finalSession);
        login(finalSession);
        clearTempSession();
        
        successPopup(`Welcome to ${org.name}!`);

        // Redirect based on role
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
    } catch (error) {
      console.error('Error selecting organization:', error);
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

  if (loading) {
    return (
      <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
        <div className={styles.loginForm}>
          <div className={styles.header}>
            <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
            <CircularProgress sx={{ color: 'white' }} />
            <Typography variant="h6" className="text-white">Loading organizations...</Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="IndiaBills Logo" className="w-32 mx-auto mb-4" />
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Select Organization
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Choose the organization you want to access
          </Typography>
        </div>

        {organizations.length > 0 ? (
          <Grid container spacing={3}>
            {organizations.map((org) => (
              <Grid item xs={12} md={6} lg={4} key={org.id}>
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => !switching && handleOrganizationSelect(org)}
                  sx={{ opacity: switching ? 0.7 : 1 }}
                >
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar
                        src={org.logoUrl}
                        alt={org.name}
                        sx={{ width: 60, height: 60 }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <div className="flex-1">
                        <Typography variant="h6" className="font-bold">
                          {org.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {org.domain ? `${org.subdomain}.${org.domain}` : org.subdomain}
                        </Typography>
                        <div className="flex gap-2 mt-2">
                          <Chip 
                            label={org.role} 
                            color="primary" 
                            size="small"
                            className="capitalize"
                          />
                          <Chip 
                            label={org.subscriptionStatus || 'active'} 
                            color={org.subscriptionStatus === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </div>
                      </div>
                      <ArrowForwardIcon className="text-gray-400" />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Status:</strong> {org.isActive ? 'Active' : 'Inactive'}</p>
                      {org.subscriptionStatus && (
                        <p><strong>Subscription:</strong> {org.subscriptionStatus}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className="text-center py-8">
            <BusinessIcon sx={{ fontSize: 80, color: 'gray' }} />
            <Typography variant="h6" color="textSecondary" className="mt-4 mb-2">
              No organizations found
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              You don't have access to any organizations yet.
            </Typography>
          </div>
        )}

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            onClick={handleCreateNewOrganization}
            startIcon={<AddIcon />}
            disabled={switching}
          >
            Create New Organization
          </Button>
          <Button
            variant="text"
            onClick={handleBackToLogin}
            disabled={switching}
          >
            Back to Login
          </Button>
        </Box>

        {switching && (
          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="body2" color="textSecondary">
              Switching organization...
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default OrganizationSelector;