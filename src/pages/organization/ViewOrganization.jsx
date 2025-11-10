import { FiEdit, FiMail, FiPhone, FiGlobe, FiBriefcase, FiEdit3, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizationContext } from '../../utils/authHelper';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import PageAnimate from '../../components/Animate/PageAnimate';
import { useStore } from '../../store/store';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Box,
  CircularProgress,
  Avatar
} from '@mui/material';
import { getOrganizationById } from '../../network/api/organizationApi';

const ViewOrganization = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const { errorPopup } = useStore();
  const navigate = useNavigate();
  const orgContext = getOrganizationContext();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!orgContext?.id) {
          errorPopup('No organization context found');
          navigate('/organization-selector');
          return;
        }

        const response = await getOrganizationById(orgContext.id);
        
        if (response.status === 200 && response.data) {
          setOrganization(response.data);
        } else {
          errorPopup('Failed to load organization details');
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        errorPopup('Failed to load organization details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [errorPopup, navigate, orgContext]);

  if (loading) {
    return (
      <PageAnimate>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </PageAnimate>
    );
  }

  if (!organization) {
    return (
      <PageAnimate>
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="error">
            Organization details not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/organization/edit')}
            sx={{ mt: 2 }}
          >
            Setup Organization
          </Button>
        </Box>
      </PageAnimate>
    );
  }

  const dateAdded = organization.createdAt ? new Date(organization.createdAt) : new Date();
  const now = new Date();
  const years = differenceInYears(now, dateAdded);
  const months = differenceInMonths(now, dateAdded) % 12;
  const days = differenceInDays(now, dateAdded) % 30;

  const getThankYouMessage = () => {
    if (years > 0) {
      return `Thank you for being with us for ${years} years, ${months} months, and ${days} days!`;
    } else if (months > 0) {
      return `Thank you for being with us for ${months} months!`;
    } else {
      return "Welcome to IndiaBills! This is just the beginning of our partnership!";
    }
  };

  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'warning';
      case 'expired': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Organization Details</h1>
              <p className="text-gray-600">{getThankYouMessage()}</p>
            </div>
            <Button
              variant="contained"
              startIcon={<FiEdit />}
              onClick={() => navigate('/organization/edit')}
            >
              FiEdit Organization
            </Button>
          </div>
        </div>

        <Grid container spacing={4}>
          {/* Organization Header */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar
                    src={organization.logoUrl}
                    alt={`${organization.name} logo`}
                    sx={{ width: 96, height: 96 }}
                  >
                    <FiBriefcase sx={{ fontSize: 48 }} />
                  </Avatar>
                  <div className="flex-1">
                    <Typography variant="h4" className="font-bold mb-2">
                      {organization.name}
                    </Typography>
                    {organization.businessName && (
                      <Typography variant="h6" color="textSecondary" className="mb-2">
                        {organization.businessName}
                      </Typography>
                    )}
                    {organization.tagline && (
                      <Typography variant="body1" className="italic text-gray-600 mb-2">
                        "{organization.tagline}"
                      </Typography>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <Chip 
                        label={organization.isActive ? 'Active' : 'Inactive'} 
                        color={organization.isActive ? 'success' : 'error'}
                      />
                      <Chip 
                        label={organization.subscriptionStatus || 'trial'} 
                        color={getSubscriptionStatusColor(organization.subscriptionStatus)}
                        className="capitalize"
                      />
                      {organization.domain && (
                        <Chip 
                          label={`${organization.subdomain}.${organization.domain}`} 
                          variant="outlined" 
                        />
                      )}
                      {organization.maxUsers && (
                        <Chip 
                          label={`Max Users: ${organization.maxUsers}`} 
                          variant="outlined" 
                        />
                      )}
                    </div>
                  </div>
                </div>
                {organization.about && (
                  <Typography variant="body1" className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {organization.about}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                  <FiBriefcase />
                  Contact Information
                </Typography>
                <div className="space-y-3">
                  {organization.email && (
                    <div className="flex items-center gap-3">
                      <FiMail color="primary" />
                      <div>
                        <Typography variant="body2" color="textSecondary">Email</Typography>
                        <Typography variant="body1">{organization.email}</Typography>
                      </div>
                    </div>
                  )}
                  {organization.phone && (
                    <div className="flex items-center gap-3">
                      <FiPhone color="primary" />
                      <div>
                        <Typography variant="body2" color="textSecondary">Phone</Typography>
                        <Typography variant="body1">{organization.phone}</Typography>
                      </div>
                    </div>
                  )}
                  {organization.website && (
                    <div className="flex items-center gap-3">
                      <FiGlobe color="primary" />
                      <div>
                        <Typography variant="body2" color="textSecondary">Website</Typography>
                        <Typography variant="body1">
                          <a 
                            href={organization.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organization.website}
                          </a>
                        </Typography>
                      </div>
                    </div>
                  )}
                  {organization.gstin && (
                    <div className="flex items-center gap-3">
                      <FiBriefcase color="primary" />
                      <div>
                        <Typography variant="body2" color="textSecondary">GSTIN</Typography>
                        <Typography variant="body1">{organization.gstin}</Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} md={6}>
          <Card>
          <CardContent>
          <Typography variant="h6" gutterBottom className="flex items-center gap-2">
          <FiMapPin />
          Address Information
          </Typography>
                <div className="space-y-2">
                  {organization.addressLine && (
                    <Typography variant="body1">{organization.addressLine}</Typography>
                  )}
                  {organization.city && (
                    <Typography variant="body1">{organization.city}</Typography>
                  )}
                  {organization.state && (
                    <Typography variant="body1">{organization.state}</Typography>
                  )}
                  {organization.country && (
                    <Typography variant="body1">{organization.country}</Typography>
                  )}
                  {organization.pinCode && (
                    <Typography variant="body1">PIN: {organization.pinCode}</Typography>
                  )}
                  {organization.timezone && (
                    <Typography variant="body1">Timezone: {organization.timezone}</Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Subscription Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Subscription Details</Typography>
                <div className="space-y-3">
                  <div>
                    <Typography variant="body2" color="textSecondary">Plan</Typography>
                    <Typography variant="body1" className="capitalize">
                      {organization.subscriptionPlan || 'Trial'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={organization.subscriptionStatus || 'trial'} 
                      color={getSubscriptionStatusColor(organization.subscriptionStatus)}
                      size="small"
                      className="capitalize"
                    />
                  </div>
                  {organization.trialEndsAt && (
                    <div>
                      <Typography variant="body2" color="textSecondary">Trial Ends</Typography>
                      <Typography variant="body1">
                        {new Date(organization.trialEndsAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                  {organization.maxUsers && (
                    <div>
                      <Typography variant="body2" color="textSecondary">User Limit</Typography>
                      <Typography variant="body1">{organization.maxUsers} users</Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Brand Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                  <FiEdit3 />
                  Brand Settings
                </Typography>
                <div className="space-y-3">
                  {organization.brandPrimaryColor && (
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: organization.brandPrimaryColor }}
                      ></div>
                      <div>
                        <Typography variant="body2" color="textSecondary">Primary Color</Typography>
                        <Typography variant="body1">{organization.brandPrimaryColor}</Typography>
                      </div>
                    </div>
                  )}
                  {organization.brandAccentColor && (
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: organization.brandAccentColor }}
                      ></div>
                      <div>
                        <Typography variant="body2" color="textSecondary">Accent Color</Typography>
                        <Typography variant="body1">{organization.brandAccentColor}</Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* System Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                  <FiCalendar />
                  System Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">Organization ID</Typography>
                    <Typography variant="body1">#{organization.id}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">Created At</Typography>
                    <Typography variant="body1">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">Last Updated</Typography>
                    <Typography variant="body1">
                      {new Date(organization.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">Created By</Typography>
                    <Typography variant="body1">{organization.createdBy || 'System'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </PageAnimate>
  );
};

export default ViewOrganization;