import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/store';
import PageAnimate from '../../components/Animate/PageAnimate';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Box,
  Chip
} from '@mui/material';
import { getBaseURL } from '../../network/api/api-config';

const CustomerProfile = () => {
  const { user } = useAuth();
  const { successPopup, errorPopup } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: 'customer@example.com',
    phone: '+91 9876543210',
    businessName: 'Customer Business',
    customerType: 'individual',
    dateOfBirth: '1990-01-01',
    gender: 'prefer_not_to_say',
    gstin: '',
    creditLimit: 50000,
    outstandingBalance: 2500,
    loyaltyPoints: 150,
    isBlacklisted: false
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      addressType: 'Home',
      addressLine: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      isDefault: true
    },
    {
      id: 2,
      addressType: 'Office',
      addressLine: '456 Business Park, Floor 3',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400002',
      isDefault: false
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement API call to update profile
    successPopup('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false);
  };

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Personal Information</Typography>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      name="businessName"
                      value={profileData.businessName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GSTIN"
                      name="gstin"
                      value={profileData.gstin}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box mt={3} display="flex" gap={2}>
                    <Button variant="contained" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Account Summary</Typography>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Customer Type:</span>
                    <Chip label={profileData.customerType} size="small" />
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Limit:</span>
                    <span className="font-semibold">₹{profileData.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding:</span>
                    <span className="font-semibold text-orange-600">₹{profileData.outstandingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loyalty Points:</span>
                    <span className="font-semibold text-green-600">{profileData.loyaltyPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Chip 
                      label={profileData.isBlacklisted ? 'Blacklisted' : 'Active'} 
                      color={profileData.isBlacklisted ? 'error' : 'success'}
                      size="small"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Addresses */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">My Addresses</Typography>
                  <Button variant="outlined">Add New Address</Button>
                </div>
                
                <Grid container spacing={3}>
                  {addresses.map((address) => (
                    <Grid item xs={12} md={6} key={address.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <div className="flex justify-between items-start mb-2">
                            <Typography variant="subtitle1" className="font-semibold">
                              {address.addressType}
                            </Typography>
                            {address.isDefault && (
                              <Chip label="Default" size="small" color="primary" />
                            )}
                          </div>
                          <Typography variant="body2" color="textSecondary">
                            {address.addressLine}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {address.city}, {address.state} - {address.pinCode}
                          </Typography>
                          <Box mt={2} display="flex" gap={1}>
                            <Button size="small">Edit</Button>
                            <Button size="small" color="error">Delete</Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </PageAnimate>
  );
};

export default CustomerProfile;