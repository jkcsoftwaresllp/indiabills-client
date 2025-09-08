import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganization, updateOrganization } from "../../network/api";
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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SaveIcon from '@mui/icons-material/Save';
import { getOption } from "../../utils/FormHelper";

const EditOrganization = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { errorPopup, successPopup } = useStore();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await getOrganization();
        if (response) {
          setOrganization(response);
        } else {
          // Initialize with empty organization for new setup
          setOrganization({
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
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        errorPopup('Failed to load organization details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [errorPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await updateOrganization(organization);
      if (response === 200) {
        successPopup("Organization updated successfully!");
        navigate("/organization");
      } else {
        errorPopup("Failed to update organization");
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

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 flex items-center gap-4">
          <button 
            className="flex items-center" 
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon /> Go back
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
                        label="Logo URL"
                        name="logoUrl"
                        value={organization.logoUrl || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
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
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={organization.phone || ''}
                        onChange={handleChange}
                        required
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
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={organization.country || 'India'}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PIN Code"
                        name="pinCode"
                        value={organization.pinCode || ''}
                        onChange={handleChange}
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
              startIcon={<SaveIcon />}
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