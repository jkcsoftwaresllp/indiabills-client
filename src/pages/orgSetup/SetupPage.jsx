import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheckCircle, FiEdit, FiPlus, FiSettings, FiZap } from 'react-icons/fi';
import { useState, useEffect } from 'react';
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
import styles from './SetupPage.module.css';

const SetupPage = () => {
  const [currentOrg, setCurrentOrg] = useState(null);
  const [otherOrgs, setOtherOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [switchingOrg, setSwitchingOrg] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrgForDetails, setSelectedOrgForDetails] = useState(null);
  const [loadingOrgDetails, setLoadingOrgDetails] = useState(false);
  
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
        // Apply brand colors to CSS variables immediately
        console.log('[SETUP_PAGE] API Response:', response);
        
        let primaryColor = response.data?.brand_primary_color || response.data?.brandPrimaryColor;
        let accentColor = response.data?.brand_accent_color || response.data?.brandAccentColor;
        
        // If response doesn't have colors, fetch org details
        if (!primaryColor && response.data?.id) {
          console.log('[SETUP_PAGE] Fetching org details for ID:', response.data.id);
          const orgDetails = await getOrganizationById(response.data.id);
          if (orgDetails.status === 200 && orgDetails.data) {
            primaryColor = orgDetails.data.brand_primary_color || orgDetails.data.brandPrimaryColor;
            accentColor = orgDetails.data.brand_accent_color || orgDetails.data.brandAccentColor;
          }
        }
        
        // Apply colors if they exist and differ from defaults
        if (primaryColor && primaryColor !== '#1e2938') {
          console.log('[SETUP_PAGE] Applying primary color:', primaryColor);
          document.documentElement.style.setProperty('--color-primary', primaryColor);
        }
        if (accentColor && accentColor !== '#c42032') {
          console.log('[SETUP_PAGE] Applying accent color:', accentColor);
          document.documentElement.style.setProperty('--color-accent', accentColor);
        }
        
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

  const handleViewOrgDetails = async (orgId) => {
    setLoadingOrgDetails(true);
    try {
      const response = await getOrganizationById(orgId);
      if (response.status === 200) {
        setSelectedOrgForDetails(response.data);
        setDetailsModalOpen(true);
      } else {
        errorPopup('Failed to load organization details');
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
      errorPopup('Failed to load organization details');
    } finally {
      setLoadingOrgDetails(false);
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
  orgs: user?.orgs || currentSession?.orgs || []
  };
          
          setSession(updatedSession);
          
          // Update organization context
          const orgData = (user?.orgs || currentSession?.orgs || [])?.find(org => org.orgId === activeOrg.orgId);
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
                className={styles.formField}
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
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.titleGroup}>
              <Typography variant="h3" className={styles.mainTitle}>
                Organization Hub
              </Typography>
              <Typography variant="subtitle1" className={styles.subtitle}>
                Manage and organize your business spaces
              </Typography>
            </div>
            <div className={styles.headerIcon}>
              <FiZap size={40} />
            </div>
          </div>
        </div>

        {/* Current Organization */}
        {currentOrg && (
          <div className={styles.sectionWrapper}>
            <Typography variant="h5" className={styles.sectionTitle}>
              Current Organization
            </Typography>
            <Card className={styles.currentOrgCard}>
              <CardContent>
                <div className={styles.currentOrgContent}>
                  <Avatar
                    src={currentOrg.logoUrl}
                    alt={`${currentOrg.name} logo`}
                    className={styles.avatarLarge}
                  >
                    <FiBriefcase size={40} />
                  </Avatar>

                  <div className={styles.orgDetails}>
                    <Typography variant="h5" className={styles.orgName}>
                      {currentOrg.name}
                    </Typography>
                    {currentOrg.businessName && (
                      <Typography variant="subtitle2" className={styles.businessName}>
                        {currentOrg.businessName}
                      </Typography>
                    )}
                    {currentOrg.tagline && (
                      <Typography variant="body2" className={styles.tagline}>
                        "{currentOrg.tagline}"
                      </Typography>
                    )}

                    <div className={styles.chipsContainer}>
                      <Chip
                        label={currentOrg.subscriptionStatus || 'trial'}
                        color={getStatusColor(currentOrg.subscriptionStatus)}
                        size="small"
                        className={styles.chip}
                      />
                      {currentOrg.domain && (
                        <Chip
                          label={`${currentOrg.subdomain}.${currentOrg.domain}`}
                          size="small"
                          variant="outlined"
                          className={styles.chip}
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <Button
                      variant="contained"
                      startIcon={<FiEdit />}
                      onClick={() => navigate('/organization/edit')}
                      className={styles.actionBtn}
                    >
                      Edit Organization
                    </Button>
                  </div>
                </div>

                {/* View Details Button */}
                <Box className={styles.detailsSection}>
                  <Button
                    variant="text"
                    onClick={() => handleViewOrgDetails(currentOrg.id)}
                    disabled={loadingOrgDetails}
                    className={styles.viewDetailsBtn}
                  >
                    {loadingOrgDetails ? 'Loading details...' : 'View more details'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Organizations */}
        {otherOrgs.length > 0 && (
          <div className={styles.sectionWrapper}>
            <Typography variant="h5" className={styles.sectionTitle}>
              Other Organizations
            </Typography>
            <Grid container spacing={3}>
              {otherOrgs.map((org) => (
                <Grid item xs={12} md={6} lg={4} key={org.id}>
                  <Card className={styles.otherOrgCard}>
                    <CardContent className={styles.otherOrgCardContent}>
                      <div className={styles.otherOrgHeader}>
                        <Avatar
                          src={org.logoUrl}
                          alt={org.name}
                          className={styles.avatarMedium}
                        >
                          <FiBriefcase />
                        </Avatar>
                        <div className={styles.otherOrgInfo}>
                          <Typography variant="h6" className={styles.otherOrgName}>
                            {org.name}
                          </Typography>
                          <Typography variant="caption" className={styles.otherOrgDomain}>
                            {org.domain ? `${org.subdomain}.${org.domain}` : org.subdomain}
                          </Typography>
                        </div>
                      </div>
                      <div className={styles.otherOrgChips}>
                        <Chip 
                          label={org.role || 'member'} 
                          color="primary" 
                          size="small"
                          className={styles.chip}
                        />
                        <Chip 
                          label={org.subscriptionStatus || 'active'} 
                          color={getStatusColor(org.subscriptionStatus)}
                          size="small"
                          className={styles.chip}
                        />
                      </div>
                      <Typography variant="caption" className={styles.statusText}>
                        {org.isActive ? '🟢 Active' : '⚫ Inactive'}
                      </Typography>
                      <div className={styles.orgCardButtons}>
                        <Button
                          fullWidth
                          variant="text"
                          size="small"
                          onClick={() => handleViewOrgDetails(org.id)}
                          disabled={loadingOrgDetails}
                          className={styles.detailsBtn}
                        >
                          {loadingOrgDetails ? 'Loading...' : 'View Details'}
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleSwitchOrganization(org.id)}
                          disabled={switchingOrg}
                          className={styles.switchBtn}
                        >
                          {switchingOrg ? 'Switching...' : 'Switch to this org'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {/* Create New Organization */}
        <div className={styles.sectionWrapper}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Create New Organization
          </Typography>
          <Card className={styles.createCard}>
            <CardContent className={styles.createCardContent}>
              <div className={styles.createIcon}>
                <FiPlus size={56} />
              </div>
              <Typography variant="h5" className={styles.createTitle}>
                Add Another Organization
              </Typography>
              <Typography variant="body1" className={styles.createSubtitle}>
                Expand your workspace and manage multiple businesses seamlessly
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setCreateDialogOpen(true)}
                className={styles.createBtn}
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
          PaperProps={{
            className: styles.dialog
          }}
        >
          <DialogTitle className={styles.dialogTitle}>
            Create New Organization
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Box className={styles.dialogBody}>
              <Stepper activeStep={activeStep} className={styles.stepper}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Typography variant="h6" className={styles.stepTitle} gutterBottom>
                {steps[activeStep]}
              </Typography>
              {renderStepContent(activeStep)}
            </Box>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button 
              onClick={() => setCreateDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            
            <div className={styles.dialogButtons}>
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

        {/* Organization Details Modal */}
        <Dialog
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            className: styles.detailsDialog
          }}
        >
          <DialogTitle className={styles.detailsDialogTitle}>
            <div className={styles.detailsDialogHeader}>
              <div className={styles.detailsDialogTitleText}>
                <Typography variant="h5" className={styles.detailsDialogMainTitle}>
                  {selectedOrgForDetails?.name}
                </Typography>
                <Typography variant="caption" className={styles.detailsDialogSubtitle}>
                  Organization Details
                </Typography>
              </div>
              {selectedOrgForDetails?.logoUrl && (
                <Avatar
                  src={selectedOrgForDetails.logoUrl}
                  alt={selectedOrgForDetails.name}
                  className={styles.detailsDialogAvatar}
                >
                  <FiBriefcase />
                </Avatar>
              )}
            </div>
          </DialogTitle>
          <DialogContent className={styles.detailsDialogContent}>
            {loadingOrgDetails ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box className={styles.detailsModalGrid}>
                {/* Basic Information */}
                {selectedOrgForDetails?.businessName && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Business Name
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.businessName}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.tagline && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Tagline
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.tagline}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.email && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Email
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.email}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.phone && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Phone
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.phone}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.website && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Website
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.website}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.gstin && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      GSTIN
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.gstin}
                    </Typography>
                  </div>
                )}

                {/* Address Information */}
                {selectedOrgForDetails?.addressLine && (
                  <div className={`${styles.detailsModalItem} ${styles.fullWidth}`}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Address
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.addressLine}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.city && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      City
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.city}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.state && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      State
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.state}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.country && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Country
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.country}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.pinCode && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      PIN Code
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.pinCode}
                    </Typography>
                  </div>
                )}

                {/* Domain & Subdomain */}
                {selectedOrgForDetails?.domain && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Domain
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.domain}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.subdomain && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Subdomain
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.subdomain}
                    </Typography>
                  </div>
                )}

                {/* Subscription Details */}
                {selectedOrgForDetails?.subscriptionPlan && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Plan
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.subscriptionPlan}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.subscriptionStatus && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Subscription Status
                    </Typography>
                    <Chip
                      label={selectedOrgForDetails.subscriptionStatus}
                      color={getStatusColor(selectedOrgForDetails.subscriptionStatus)}
                      size="small"
                      className={styles.statusChipModal}
                    />
                  </div>
                )}
                {selectedOrgForDetails?.trialEndsAt && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Trial Ends At
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {new Date(selectedOrgForDetails.trialEndsAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.maxUsers && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Max Users
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.maxUsers}
                    </Typography>
                  </div>
                )}

                {/* Branding */}
                {selectedOrgForDetails?.brandPrimaryColor && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Primary Color
                    </Typography>
                    <div className={styles.colorDisplay}>
                      <div 
                        className={styles.colorBox}
                        style={{ backgroundColor: selectedOrgForDetails.brandPrimaryColor }}
                      />
                      <Typography variant="body2" className={styles.detailsModalValue}>
                        {selectedOrgForDetails.brandPrimaryColor}
                      </Typography>
                    </div>
                  </div>
                )}
                {selectedOrgForDetails?.brandAccentColor && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Accent Color
                    </Typography>
                    <div className={styles.colorDisplay}>
                      <div 
                        className={styles.colorBox}
                        style={{ backgroundColor: selectedOrgForDetails.brandAccentColor }}
                      />
                      <Typography variant="body2" className={styles.detailsModalValue}>
                        {selectedOrgForDetails.brandAccentColor}
                      </Typography>
                    </div>
                  </div>
                )}
                {selectedOrgForDetails?.timezone && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Timezone
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.timezone}
                    </Typography>
                  </div>
                )}

                {/* Status */}
                {selectedOrgForDetails?.isActive !== undefined && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrgForDetails.isActive ? 'Active' : 'Inactive'}
                      color={selectedOrgForDetails.isActive ? 'success' : 'default'}
                      size="small"
                      className={styles.statusChipModal}
                    />
                  </div>
                )}

                {/* Metadata */}
                {selectedOrgForDetails?.createdAt && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Created
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {new Date(selectedOrgForDetails.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.updatedAt && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {new Date(selectedOrgForDetails.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.createdBy && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Created By
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.createdBy}
                    </Typography>
                  </div>
                )}
                {selectedOrgForDetails?.updatedBy && (
                  <div className={styles.detailsModalItem}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      Updated By
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.updatedBy}
                    </Typography>
                  </div>
                )}

                {/* About */}
                {selectedOrgForDetails?.about && (
                  <div className={`${styles.detailsModalItem} ${styles.fullWidth}`}>
                    <Typography variant="caption" className={styles.detailsModalLabel}>
                      About
                    </Typography>
                    <Typography variant="body2" className={styles.detailsModalValue}>
                      {selectedOrgForDetails.about}
                    </Typography>
                  </div>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions className={styles.detailsDialogActions}>
            <Button
              onClick={() => setDetailsModalOpen(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </PageAnimate>
  );
};

export default SetupPage;
