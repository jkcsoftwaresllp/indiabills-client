import { useState, useEffect } from "react";
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  getCustomerProfile,
  updateCustomerSelf,
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../../network/api/customersApi";

const CustomerProfile = () => {
  const { successPopup, errorPopup } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    business_name: "",
    customer_type: "individual",
    gender: "prefer_not_to_say",
    date_of_birth: "",
    gstin: "",
    fssai_number: "",
    pan_number: "",
    aadhar_number: "",
    credit_limit: 0,
    loyalty_points: 0,
    is_active: true,
  });

  const [addresses, setAddresses] = useState([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    label: "",
    address_type: "shipping",
    address_line1: "",
    address_line2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pin_code: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    is_default: false,
  });

  // Load profile and addresses on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, addressList] = await Promise.all([
          getCustomerProfile(),
          getCustomerAddresses(),
        ]);

        if (profile) {
          setProfileData({
            first_name: profile.first_name || "",
            middle_name: profile.middle_name || "",
            last_name: profile.last_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            business_name: profile.business_name || "",
            customer_type: profile.customer_type || "individual",
            gender: profile.gender || "prefer_not_to_say",
            date_of_birth: profile.date_of_birth || "",
            gstin: profile.gstin || "",
            fssai_number: profile.fssai_number || "",
            pan_number: profile.pan_number || "",
            aadhar_number: profile.aadhar_number || "",
            credit_limit: profile.credit_limit || 0,
            loyalty_points: profile.loyalty_points || 0,
            is_active:
              profile.is_active !== undefined ? profile.is_active : true,
          });
        }

        if (addressList) {
          setAddresses(addressList);
        }
      } catch (error) {
        errorPopup("Failed to load profile data");
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [errorPopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateCustomerSelf(profileData);
      successPopup("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      errorPopup(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset to original data - reload from API
    const loadData = async () => {
      try {
        const profile = await getCustomerProfile();
        if (profile) {
          setProfileData({
            first_name: profile.first_name || "",
            middle_name: profile.middle_name || "",
            last_name: profile.last_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            business_name: profile.business_name || "",
            customer_type: profile.customer_type || "individual",
            gender: profile.gender || "prefer_not_to_say",
            date_of_birth: profile.date_of_birth || "",
            gstin: profile.gstin || "",
            fssai_number: profile.fssai_number || "",
            pan_number: profile.pan_number || "",
            aadhar_number: profile.aadhar_number || "",
            credit_limit: profile.credit_limit || 0,
            loyalty_points: profile.loyalty_points || 0,
            is_active:
              profile.is_active !== undefined ? profile.is_active : true,
          });
        }
      } catch (error) {
        console.error("Error reloading profile data:", error);
      }
    };
    loadData();
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      label: "",
      address_type: "shipping",
      address_line1: "",
      address_line2: "",
      landmark: "",
      city: "",
      state: "",
      country: "India",
      pin_code: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      is_default: false,
    });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData({
      label: address.label || "",
      address_type: address.address_type || "shipping",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      pin_code: address.pin_code || "",
      contact_name: address.contact_name || "",
      contact_phone: address.contact_phone || "",
      contact_email: address.contact_email || "",
      is_default: address.is_default || false,
    });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await updateCustomerAddress(editingAddress.id, addressFormData);
        successPopup("Address updated successfully!");
      } else {
        await createCustomerAddress(addressFormData);
        successPopup("Address added successfully!");
      }
      // Reload addresses
      const addressList = await getCustomerAddresses();
      setAddresses(addressList);
      setAddressDialogOpen(false);
    } catch (error) {
      errorPopup(error.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await deleteCustomerAddress(addressId);
      successPopup("Address deleted successfully!");
      // Reload addresses
      const addressList = await getCustomerAddresses();
      setAddresses(addressList);
    } catch (error) {
      errorPopup("Failed to delete address");
    }
  };

  return (
    <PageAnimate>
      <div className="w-full p-6">
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
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
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Middle Name"
                      name="middle_name"
                      value={profileData.middle_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={profileData.last_name}
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
                      name="business_name"
                      value={profileData.business_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Customer Type</InputLabel>
                      <Select
                        name="customer_type"
                        value={profileData.customer_type}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="individual">Individual</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEditing}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer_not_to_say">
                          Prefer not to say
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="date_of_birth"
                      type="date"
                      value={profileData.date_of_birth}
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="FSSAI Number"
                      name="fssai_number"
                      value={profileData.fssai_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      name="pan_number"
                      value={profileData.pan_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Aadhaar Number"
                      name="aadhar_number"
                      value={profileData.aadhar_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Credit Limit"
                      name="credit_limit"
                      type="number"
                      value={profileData.credit_limit}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Loyalty Points"
                      name="loyalty_points"
                      type="number"
                      value={profileData.loyalty_points}
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
                <Typography variant="h6" gutterBottom>
                  Account Summary
                </Typography>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Customer Type:</span>
                    <Chip label={profileData.customer_type} size="small" />
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Limit:</span>
                    <span className="font-semibold">
                      ₹{profileData.credit_limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loyalty Points:</span>
                    <span className="font-semibold text-green-600">
                      {profileData.loyalty_points}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Chip
                      label={profileData.is_active ? "Active" : "Inactive"}
                      color={profileData.is_active ? "success" : "error"}
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
                  <Button variant="outlined" onClick={handleAddAddress}>
                    Add New Address
                  </Button>
                </div>

                {loading ? (
                  <Typography>Loading addresses...</Typography>
                ) : addresses.length === 0 ? (
                  <Typography>
                    No addresses found. Add your first address.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {addresses.map((address) => (
                      <Grid item xs={12} md={6} key={address.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <div className="flex justify-between items-start mb-2">
                              <Typography
                                variant="subtitle1"
                                className="font-semibold"
                              >
                                {address.label || address.address_type}
                              </Typography>
                              {address.is_default && (
                                <Chip
                                  label="Default"
                                  size="small"
                                  color="primary"
                                />
                              )}
                            </div>
                            <Typography variant="body2" color="textSecondary">
                              {address.address_line1}
                              {address.address_line2 &&
                                `, ${address.address_line2}`}
                              {address.landmark && `, ${address.landmark}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {address.city}, {address.state} -{" "}
                              {address.pin_code}
                            </Typography>
                            <Box mt={2} display="flex" gap={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Label"
                name="label"
                value={addressFormData.label}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Type</InputLabel>
                <Select
                  name="address_type"
                  value={addressFormData.address_type}
                  onChange={handleAddressInputChange}
                >
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="shipping">Shipping</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="address_line1"
                value={addressFormData.address_line1}
                onChange={handleAddressInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address_line2"
                value={addressFormData.address_line2}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={addressFormData.landmark}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={addressFormData.city}
                onChange={handleAddressInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={addressFormData.state}
                onChange={handleAddressInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={addressFormData.country}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pin Code"
                name="pin_code"
                value={addressFormData.pin_code}
                onChange={handleAddressInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                name="contact_name"
                value={addressFormData.contact_name}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contact_phone"
                value={addressFormData.contact_phone}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contact_email"
                value={addressFormData.contact_email}
                onChange={handleAddressInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Is Default</InputLabel>
                <Select
                  name="is_default"
                  value={addressFormData.is_default}
                  onChange={handleAddressInputChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained">
            {editingAddress ? "Update" : "Add"} Address
          </Button>
        </DialogActions>
      </Dialog>
    </PageAnimate>
  );
};

export default CustomerProfile;
