import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '../../network/api';
import { useStore } from '../../store/store';
import PageAnimate from '../../components/Animate/PageAnimate';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getOption } from '../../utils/FormHelper';

const CreateOrganization = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

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

  const steps = ['Basic Information', 'Contact & Address', 'Branding'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await createOrganization(formData);
      if (response === 200 || response === 201) {
        successPopup('Organization created successfully!');
        navigate('/organization-selector');
      } else {
        errorPopup('Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      errorPopup('Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.email;
      case 1:
        return formData.phone && formData.addressLine;
      case 2:
        return true; // Branding is optional
      default:
        return false;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
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
                required
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
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <img src={logo} alt="IndiaBills Logo" className="w-32 mx-auto mb-4" />
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Create New Organization
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Set up your organization to get started
          </Typography>
        </div>

        <Stepper activeStep={activeStep} className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {steps[activeStep]}
            </Typography>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            onClick={() => navigate('/organization-selector')}
            startIcon={<ArrowBackIosNewIcon />}
          >
            Back to Organizations
          </Button>
          
          <div className="flex gap-2">
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                disabled={!validateStep(activeStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<CheckCircleIcon />}
                disabled={loading || !validateStep(activeStep)}
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </Button>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default CreateOrganization;