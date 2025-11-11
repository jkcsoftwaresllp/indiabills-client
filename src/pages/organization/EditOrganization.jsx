import { FiArrowLeft, FiEdit, FiSave } from 'react-icons/fi';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateOrganization } from "../../network/api";
import { getOrganizationContext, validateOrganizationData } from "../../utils/authHelper";
import { useStore } from "../../store/store";
import PageAnimate from "../../components/Animate/PageAnimate";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getOption } from "../../utils/FormHelper";
import { getOrganizationById } from "../../network/api/organizationApi";

const EditOrganization = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { errorPopup, successPopup } = useStore();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateOrganizationData(organization);
    if (!validation.isValid) {
      setErrors(validation.errors);
      errorPopup('Please fix the validation errors');
      return;
    }

    setSaving(true);

    try {
      // Map frontend data to backend API format
      const updateData = {
        ...organization,
        id: orgContext.id,
        businessName: organization.business_name || organization.businessName,
        logoUrl: organization.logo_url || organization.logoUrl,
        addressLine: organization.address_line || organization.addressLine,
        pinCode: organization.pin_code || organization.pinCode,
        brandPrimaryColor: organization.brand_primary_color || organization.brandPrimaryColor,
        brandAccentColor: organization.brand_accent_color || organization.brandAccentColor,
        isActive: organization.is_active !== undefined ? organization.is_active : organization.isActive,
        updatedBy: 'admin_user' // This should come from current user session
      };
      
      const response = await updateOrganization(updateData);
      
      if (response.status === 200) {
        successPopup("Organization updated successfully!");
        navigate("/organization");
      } else {
        errorPopup(response.data?.message || "Failed to update organization");
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      errorPopup("Failed to update organization");
    } finally {
      setSaving(false);
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

  if (!organization) {
    return (
      <PageAnimate>
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="error">
            Organization not found
          </Typography>
        </Box>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 flex items-center gap-4">
          <button 
            className="flex items-center" 
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> Go back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Organization</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Organization Name"
                        name="name"
                        value={organization.name || ''}
                        onChange={handleChange}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Business Name"
                        name="businessName"
                        value={organization.businessName || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="About"
                        name="about"
                        value={organization.about || ''}
                        onChange={handleChange}
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Tagline"
                        name="tagline"
                        value={organization.tagline || ''}
                        onChange={handleChange}
                        placeholder="Your organization's motto"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="GSTIN"
                        name="gstin"
                        value={organization.gstin || ''}
                        onChange={handleChange}
                        placeholder="GST Identification Number"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={organization.email || ''}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={organization.phone || ''}
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
                        value={organization.website || ''}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                        error={!!errors.website}
                        helperText={errors.website}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Address Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address Line"
                        name="addressLine"
                        value={organization.addressLine || ''}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={organization.city || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          name="state"
                          value={organization.state || ''}
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
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                          name="country"
                          value={organization.country || 'India'}
                          onChange={handleChange}
                        >
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PIN Code"
                        name="pinCode"
                        value={organization.pinCode || ''}
                        onChange={handleChange}
                        error={!!errors.pinCode}
                        helperText={errors.pinCode}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Domain Settings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Domain Settings</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Domain"
                        name="domain"
                        value={organization.domain || ''}
                        onChange={handleChange}
                        placeholder="yourcompany.com"
                        error={!!errors.domain}
                        helperText={errors.domain}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subdomain"
                        name="subdomain"
                        value={organization.subdomain || ''}
                        onChange={handleChange}
                        placeholder="yourcompany"
                        error={!!errors.subdomain}
                        helperText={errors.subdomain}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Logo URL"
                        name="logoUrl"
                        value={organization.logoUrl || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        error={!!errors.logoUrl}
                        helperText={errors.logoUrl}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Brand Colors */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Brand Colors</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Primary Color"
                        name="brandPrimaryColor"
                        type="color"
                        value={organization.brandPrimaryColor || '#1e2938'}
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
                        value={organization.brandAccentColor || '#c42032'}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.brandAccentColor}
                        helperText={errors.brandAccentColor}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={20} /> : <FiSave />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </div>
    </PageAnimate>
  );
};

export default EditOrganization;