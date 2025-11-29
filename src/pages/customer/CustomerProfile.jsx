import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { MdVerified, MdCreditCard, MdStar } from "react-icons/md";
import { useState, useEffect } from "react";
import { useStore } from "../../store/store";
import { getSessions } from "../../utils/authHelper";
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
import {
  getCustomerProfile,
  updateCustomerSelf,
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../../network/api/customersApi";

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    transition: "all 0.3s ease",
    "&:hover fieldset": {
      borderColor: "#c42032",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#c42032",
      boxShadow: "0 0 0 3px rgba(196, 32, 50, 0.08)",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f1f5f9",
    },
  },
};

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
  const [profileError, setProfileError] = useState(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    contact_name: "",
    label: "",
    address_type: "shipping",
    address_line1: "",
    address_line2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pin_code: "",
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
          setProfileError(null);
        } else {
          setProfileError(
            "Unable to load customer profile. Please contact support."
          );
        }

        // Ensure addressList is always an array
        setAddresses(Array.isArray(addressList) ? addressList : []);
      } catch (error) {
        console.error("Error loading profile data:", error);
        setProfileError("Failed to load profile data. Please try again.");
        setAddresses([]); // Ensure addresses is always an array
        errorPopup("Failed to load profile data");
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
      contact_name: "",
      label: "",
      address_type: "shipping",
      address_line1: "",
      address_line2: "",
      landmark: "",
      city: "",
      state: "",
      country: "India",
      pin_code: "",
      contact_phone: "",
      contact_email: "",
      is_default: false,
    });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData({
      contact_name: address.contact_name || "",
      label: address.label || "",
      address_type: address.address_type || "shipping",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      pin_code: address.pin_code || "",
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
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}
        <div className="relative overflow-hidden px-6 pt-8 pb-12 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 opacity-5 blur-3xl" />
          <div className="relative">
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-300 text-lg">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-12">
          {profileError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{profileError}</p>
            </div>
          )}

          <Grid container spacing={3}>
            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        Personal Information
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mt: 0.5 }}
                      >
                        Update your account details
                      </Typography>
                    </div>
                    <Button
                      variant={isEditing ? "outlined" : "contained"}
                      onClick={() => setIsEditing(!isEditing)}
                      startIcon={<FiEdit size={18} />}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        padding: "8px 20px",
                        background: isEditing ? "transparent" : "#c42032",
                        border: isEditing ? "2px solid #d1d5db" : "none",
                        color: isEditing ? "#374151" : "#ffffff",
                        "&:hover": {
                          background: isEditing ? "#f3f4f6" : "#a01b26",
                        },
                      }}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Customer Type</InputLabel>
                        <Select
                          name="customer_type"
                          value={profileData.customer_type}
                          onChange={handleInputChange}
                          sx={{
                            borderRadius: "8px",
                            backgroundColor: "#f9fafb",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#c42032",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#c42032",
                              boxShadow: "0 0 0 3px rgba(196, 32, 50, 0.08)",
                            },
                          }}
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
                          sx={{
                            borderRadius: "8px",
                            backgroundColor: "#f9fafb",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#c42032",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#c42032",
                              boxShadow: "0 0 0 3px rgba(196, 32, 50, 0.08)",
                            },
                          }}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
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
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box mt={4} display="flex" gap={2}>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          fontWeight: 600,
                          padding: "10px 24px",
                          background: "#c42032",
                          "&:hover": {
                            background: "#a01b26",
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          fontWeight: 600,
                          padding: "10px 24px",
                          borderColor: "#d1d5db",
                          color: "#374151",
                          "&:hover": {
                            backgroundColor: "#f9fafb",
                            borderColor: "#9ca3af",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Account Summary */}
            <Grid item xs={12} md={4}>
              <div className="space-y-3">
                {/* Status Card */}
                <Card
                  sx={{
                    background: "#1e2938",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Account Status
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mt: 0.5 }}
                        >
                          {profileData.is_active ? "Active" : "Inactive"}
                        </Typography>
                      </div>
                      <MdVerified size={32} />
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Limit Card */}
                <Card
                  sx={{
                    background: "#c42032",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(196, 32, 50, 0.2)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Credit Limit
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mt: 0.5 }}
                        >
                          ₹{profileData.credit_limit.toLocaleString()}
                        </Typography>
                      </div>
                      <MdCreditCard size={32} />
                    </div>
                  </CardContent>
                </Card>

                {/* Loyalty Points Card */}
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.2)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Loyalty Points
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mt: 0.5 }}
                        >
                          {profileData.loyalty_points}
                        </Typography>
                      </div>
                      <MdStar size={32} />
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Type Card */}
                <Card
                  sx={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      Customer Type
                    </Typography>
                    <Chip
                      label={
                        profileData.customer_type.charAt(0).toUpperCase() +
                        profileData.customer_type.slice(1)
                      }
                      sx={{
                        mt: 1,
                        borderRadius: "6px",
                        background: "#c42032",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </Grid>

            {/* Addresses */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        My Addresses
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mt: 0.5 }}
                      >
                        Manage your shipping and billing addresses
                      </Typography>
                    </div>
                    <Button
                      variant="contained"
                      onClick={handleAddAddress}
                      startIcon={<FiPlus size={20} />}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        padding: "10px 20px",
                        background: "#c42032",
                        "&:hover": {
                          background: "#a01b26",
                        },
                      }}
                    >
                      Add Address
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
                          <Card
                            sx={{
                              background: "#ffffff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "10px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
                                border: "1px solid #d1d5db",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 700, color: "#1e293b" }}
                                  >
                                    {address.label ||
                                      address.address_type
                                        .charAt(0)
                                        .toUpperCase() +
                                        address.address_type.slice(1)}
                                  </Typography>
                                </div>
                                {address.is_default && (
                                  <Chip
                                    label="Default"
                                    size="small"
                                    sx={{
                                      background: "#c42032",
                                      color: "white",
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </div>
                              <div className="space-y-2 mb-3">
                                {address.contact_name && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#1e2938",
                                      fontWeight: 600,
                                      mb: 1,
                                    }}
                                  >
                                    {address.contact_name}
                                  </Typography>
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <FiMapPin size={16} />
                                  {address.address_line1}
                                  {address.address_line2 &&
                                    `, ${address.address_line2}`}
                                  {address.landmark && `, ${address.landmark}`}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#6b7280" }}
                                >
                                  {address.city}, {address.state} -{" "}
                                  {address.pin_code}
                                </Typography>
                                {address.contact_phone && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#6b7280",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <FiPhone size={16} />
                                    {address.contact_phone}
                                  </Typography>
                                )}
                                {address.contact_email && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#6b7280",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <FiMail size={16} />
                                    {address.contact_email}
                                  </Typography>
                                )}
                              </div>
                              <Box mt={3} display="flex" gap={1}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditAddress(address)}
                                  sx={{
                                    color: "#c42032",
                                    backgroundColor: "rgba(196, 32, 50, 0.08)",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(196, 32, 50, 0.15)",
                                    },
                                  }}
                                >
                                  <FiEdit size={18} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                  sx={{
                                    color: "#ef4444",
                                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(239, 68, 68, 0.15)",
                                    },
                                  }}
                                >
                                  <FiTrash2 size={18} />
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
      </div>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "#c42032",
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          {editingAddress ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                name="contact_name"
                value={addressFormData.contact_name}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Label"
                name="label"
                value={addressFormData.label}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Address Type</InputLabel>
                <Select
                  name="address_type"
                  value={addressFormData.address_type}
                  onChange={handleAddressInputChange}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c42032",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c42032",
                      boxShadow: "0 0 0 3px rgba(196, 32, 50, 0.08)",
                    },
                  }}
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
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address_line2"
                value={addressFormData.address_line2}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={addressFormData.landmark}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
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
                sx={textFieldStyles}
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
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={addressFormData.country}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
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
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contact_phone"
                value={addressFormData.contact_phone}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contact_email"
                value={addressFormData.contact_email}
                onChange={handleAddressInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Is Default</InputLabel>
                <Select
                  name="is_default"
                  value={addressFormData.is_default}
                  onChange={handleAddressInputChange}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c42032",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c42032",
                      boxShadow: "0 0 0 3px rgba(196, 32, 50, 0.08)",
                    },
                  }}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setAddressDialogOpen(false)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              color: "#374151",
              "&:hover": {
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAddress}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              background: "#c42032",
              "&:hover": {
                background: "#a01b26",
              },
            }}
          >
            {editingAddress ? "Update" : "Add"} Address
          </Button>
        </DialogActions>
      </Dialog>
    </PageAnimate>
  );
};

export default CustomerProfile;
