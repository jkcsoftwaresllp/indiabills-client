import { FiEdit, FiPlus, FiBriefcase } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrganizations, createOrganization, switchOrganization } from '../../network/api';
import { getOrganizationContext, validateOrganizationData, setSession, setOrganizationContext } from '../../utils/authHelper';
import { useStore } from '../../store/store';
import PageAnimate from '../../components/Animate/PageAnimate';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { getOption } from '../../utils/FormHelper';
import { getOrganizationById } from '../../network/api/organizationApi';
import { getSession } from '../../utils/cacheHelper';

const SetupPage = () => {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [otherOrgs, setOtherOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [switchingOrg, setSwitchingOrg] = useState(false);
  
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();
  const orgContext = getOrganizationContext();
  const session = getSession();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    about: '',
    tagline: '',
    domain: '',
    subdomain: '',
    logoUrl: '',
    phone: '',
    email: '',
    website: '',
    addressLine: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    brandPrimaryColor: '#1e2938',
    brandAccentColor: '#c42032'
  });

  const steps = ['Basic Information', 'Contact & Address', 'Branding & Domain'];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Get list of organizations
      const orgsResponse = await getUserOrganizations();
      if (orgsResponse.status === 200) {
        const organizations = orgsResponse.data;
        
        // Find current organization
        const current = organizations.find(org => org.id === orgContext?.id);
        if (current) {
          // Get detailed info for current org
          const detailResponse = await getOrganizationById(current.id);
          if (detailResponse.status === 200) {
            setCurrentOrg(detailResponse.data);
          }
        }
        
        // Set other organizations
        const others = organizations.filter(org => org.id !== orgContext?.id);
        setOtherOrgs(others);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      errorPopup('Failed to load organization details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !formData.name) {
      setErrors({ name: 'Organization name is required' });
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleCreateOrganization = async () => {
    const validation = validateOrganizationData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      errorPopup('Please fix the validation errors');
      return;
    }

    setCreating(true);
    try {
      const response = await createOrganization(formData);
      
      if (response.status === 200 || response.status === 201) {
        successPopup('Organization created successfully!');
        setCreateDialogOpen(false);
        setFormData({
          name: '',
          businessName: '',
          about: '',
          tagline: '',
          domain: '',
          subdomain: '',
          logoUrl: '',
          phone: '',
          email: '',
          website: '',
          addressLine: '',
          city: '',
          state: '',
          country: 'India',
          pinCode: '',
          brandPrimaryColor: '#1e2938',
          brandAccentColor: '#c42032'
        });
        setActiveStep(0);
        setErrors({});
        fetchOrganizations(); // Refresh the list
      } else {
        errorPopup(response.data?.message || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      errorPopup('Failed to create organization');
    } finally {
      setCreating(false);
    }
  };

  const handleSwitchOrganization = async (orgId) => {
    setSwitchingOrg(true);
    try {
      const response = await switchOrganization(orgId);
      if (response.status === 200) {
        const { token, activeOrg, user } = response.data;
        
        // Update session with new organization context
        const currentSession = getSession();
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            role: activeOrg.role.toLowerCase(),
            organizationId: activeOrg.orgId,
            token: token,
            orgs: user.orgs || currentSession.orgs
          };
          
          setSession(updatedSession);
          
          // Update organization context
          const orgData = (user.orgs || currentSession.orgs)?.find(org => org.orgId === activeOrg.orgId);
          if (orgData) {
            setOrganizationContext({
              id: activeOrg.orgId,
              name: orgData.name || 'Organization',
              domain: orgData.domain,
              subdomain: orgData.subdomain,
              logoUrl: orgData.logoUrl,
              role: activeOrg.role.toLowerCase()
            });
          }
          
          successPopup(`Switched to ${orgData?.name || 'Organization'}`);
          // Reload to refresh with new organization context
          window.location.reload();
        }
      } else {
        errorPopup('Failed to switch organization');
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      errorPopup('Failed to switch organization');
    } finally {
      setSwitchingOrg(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'warning';
      case 'expired': return 'error';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Legal business name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About"
                name="about"
                value={formData.about}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Tell us about your organization"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Your organization's motto"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Street address, building, etc."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {getOption("state").map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PIN Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                error={!!errors.pinCode}
                helperText={errors.pinCode}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                error={!!errors.logoUrl}
                helperText={errors.logoUrl}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="yourcompany.com"
                error={!!errors.domain}
                helperText={errors.domain || "Either domain or subdomain is required"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subdomain"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="yourcompany"
                error={!!errors.subdomain}
                helperText={errors.subdomain}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Primary Color"
                name="brandPrimaryColor"
                type="color"
                value={formData.brandPrimaryColor}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.brandPrimaryColor}
                helperText={errors.brandPrimaryColor}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Accent Color"
                name="brandAccentColor"
                type="color"
                value={formData.brandAccentColor}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.brandAccentColor}
                helperText={errors.brandAccentColor}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <PageAnimate>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Organization Setup
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your organizations and create new ones
          </Typography>
        </div>

        {/* Current Organization */}
{currentOrg && (
  <div className="mb-8">
    <Typography variant="h5" className="font-semibold mb-4">
      Current Organization
    </Typography>
    <Card className="shadow-md rounded-2xl">
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar
            src={currentOrg.logoUrl}
            alt={`${currentOrg.name} logo`}
            sx={{ width: 72, height: 72 }}
          >
            <FiBriefcase sx={{ fontSize: 36 }} />
          </Avatar>

          <div className="flex-1">
            <Typography variant="h5" className="font-bold">
              {currentOrg.name}
            </Typography>
            {currentOrg.businessName && (
              <Typography variant="subtitle1" color="textSecondary">
                {currentOrg.businessName}
              </Typography>
            )}
            {currentOrg.tagline && (
              <Typography variant="body2" className="italic text-gray-600 mt-1">
                "{currentOrg.tagline}"
              </Typography>
            )}

            <div className="flex gap-2 mt-3">
              <Chip
                label={currentOrg.subscriptionStatus || 'trial'}
                color={getStatusColor(currentOrg.subscriptionStatus)}
                size="small"
                className="capitalize"
              />
              {currentOrg.domain && (
                <Chip
                  label={`${currentOrg.subdomain}.${currentOrg.domain}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {session?.orgs && session.orgs.length > 1 && (
              <Button
                variant="outlined"
                startIcon={<FiSettings />}
                onClick={() => navigate('/organization-selector')}
                sx={{ mr: 1 }}
              >
                Switch Organization
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<FiEdit />}
              onClick={() => navigate('/organization/edit')}
            >
              FiEdit
            </Button>
          </div>
        </div>

        {/* Collapsible details */}
        <Box mt={3}>
          <details className="text-sm">
            <summary className="cursor-pointer text-primary-600 font-medium">
              View more details
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-gray-700">
              {currentOrg.email && (
                <div>
                  <Typography variant="caption" color="textSecondary">Email</Typography>
                  <Typography variant="body2">{currentOrg.email}</Typography>
                </div>
              )}
              {currentOrg.phone && (
                <div>
                  <Typography variant="caption" color="textSecondary">Phone</Typography>
                  <Typography variant="body2">{currentOrg.phone}</Typography>
                </div>
              )}
              {currentOrg.addressLine && (
                <div className="md:col-span-2">
                  <Typography variant="caption" color="textSecondary">Address</Typography>
                  <Typography variant="body2">
                    {currentOrg.addressLine}, {currentOrg.city}, {currentOrg.state} {currentOrg.pinCode}
                  </Typography>
                </div>
              )}
              {currentOrg.createdAt && (
                <div>
                  <Typography variant="caption" color="textSecondary">Created</Typography>
                  <Typography variant="body2">
                    {new Date(currentOrg.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              )}
              {currentOrg.about && (
                <div className="md:col-span-2">
                  <Typography variant="caption" color="textSecondary">About</Typography>
                  <Typography variant="body2">{currentOrg.about}</Typography>
                </div>
              )}
            </div>
          </details>
        </Box>
      </CardContent>
    </Card>
  </div>
)}


        {/* Other Organizations */}
        {otherOrgs.length > 0 && (
          <div className="mb-8">
            <Typography variant="h5" className="font-semibold mb-4">
              Other Organizations
            </Typography>
            <Grid container spacing={3}>
              {otherOrgs.map((org) => (
                <Grid item xs={12} md={6} lg={4} key={org.id}>
                  <Card className="h-full">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          src={org.logoUrl}
                          alt={org.name}
                          sx={{ width: 50, height: 50 }}
                        >
                          <FiBriefcase />
                        </Avatar>
                        <div className="flex-1">
                          <Typography variant="h6" className="font-bold">
                            {org.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {org.domain ? `${org.subdomain}.${org.domain}` : org.subdomain}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Chip 
                          label={org.role || 'member'} 
                          color="primary" 
                          size="small"
                          className="capitalize"
                        />
                        <Chip 
                          label={org.subscriptionStatus || 'active'} 
                          color={getStatusColor(org.subscriptionStatus)}
                          size="small"
                        />
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        Status: {org.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleSwitchOrganization(org.id)}
                        disabled={switchingOrg}
                        sx={{ mt: 1 }}
                      >
                        {switchingOrg ? 'Switching...' : 'Switch to this org'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {/* Create New Organization */}
        <div>
          <Typography variant="h5" className="font-semibold mb-4">
            Create New Organization
          </Typography>
          <Card>
            <CardContent className="text-center py-8">
              <FiBriefcase size={60} style={{ color: 'gray', marginBottom: 16 }} />
              <Typography variant="h6" className="mb-2">
                FiPlus Another Organization
              </Typography>
              <Typography variant="body1" color="textSecondary" className="mb-4">
                Create a new organization to manage multiple businesses
              </Typography>
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setCreateDialogOpen(true)}
                size="large"
              >
                Create Organization
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Create Organization Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => !creating && setCreateDialogOpen(false)}
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={activeStep} className="mb-6">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Typography variant="h6" gutterBottom>
                {steps[activeStep]}
              </Typography>
              {renderStepContent(activeStep)}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setCreateDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<FiArrowLeft />}
                  disabled={creating}
                >
                  Back
                </Button>
              )}
              
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<FiArrowRight />}
                  disabled={creating}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleCreateOrganization}
                  startIcon={creating ? <CircularProgress size={20} /> : <FiCheckCircle />}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Organization'}
                </Button>
              )}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </PageAnimate>
  );
};

export default SetupPage;