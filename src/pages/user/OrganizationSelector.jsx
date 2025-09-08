import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/store';
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
  Box
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const OrganizationSelector = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await getUserOrganizations();
        
        // Mock data for now
        const mockOrganizations = [
          {
            id: 1,
            name: 'Acme Corporation',
            businessName: 'Acme Business Group',
            logoUrl: 'https://via.placeholder.com/100',
            domain: 'acme.com',
            subdomain: 'acme',
            role: 'admin',
            isActive: true,
            lastAccessed: '2025-01-15T10:30:00Z'
          },
          {
            id: 2,
            name: 'Tech Solutions Ltd',
            businessName: 'Tech Solutions Private Limited',
            logoUrl: 'https://via.placeholder.com/100',
            domain: 'techsolutions.com',
            subdomain: 'tech',
            role: 'operator',
            isActive: true,
            lastAccessed: '2025-01-10T15:20:00Z'
          }
        ];
        
        setOrganizations(mockOrganizations);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        errorPopup('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrganizations();
  }, [errorPopup]);

  const handleOrganizationSelect = async (org) => {
    try {
      // TODO: Replace with actual API call to set organization context
      // const response = await setOrganizationContext(org.id);
      
      // Mock successful organization selection
      const userSession = JSON.parse(localStorage.getItem('tempUserSession'));
      const payload = {
        ...userSession,
        organizationId: org.id,
        organizationName: org.name,
        role: org.role
      };

      login(payload);
      successPopup(`Welcome to ${org.name}!`);

      // Redirect based on role
      if (org.role === 'admin') {
        navigate('/');
      } else if (org.role === 'operator') {
        navigate('/operator');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error selecting organization:', error);
      errorPopup('Failed to access organization');
    }
  };

  const handleCreateNewOrganization = () => {
    navigate('/organization/create');
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
        <div className={styles.loginForm}>
          <div className={styles.header}>
            <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
            <Typography variant="h5" className="text-white">Loading...</Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-4xl">
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
              <Grid item xs={12} md={6} key={org.id}>
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleOrganizationSelect(org)}
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
                          {org.businessName}
                        </Typography>
                        <div className="flex gap-2 mt-2">
                          <Chip 
                            label={org.role} 
                            color="primary" 
                            size="small"
                            className="capitalize"
                          />
                          <Chip 
                            label={org.isActive ? 'Active' : 'Inactive'} 
                            color={org.isActive ? 'success' : 'error'}
                            size="small"
                          />
                        </div>
                      </div>
                      <ArrowForwardIcon className="text-gray-400" />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Domain:</strong> {org.subdomain}.{org.domain}</p>
                      <p><strong>Last Accessed:</strong> {new Date(org.lastAccessed).toLocaleDateString()}</p>
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
            startIcon={<BusinessIcon />}
          >
            Create New Organization
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default OrganizationSelector;