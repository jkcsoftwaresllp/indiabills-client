import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser, uploadUserImage } from "../../network/api";
import { useStore } from "../../store/store";
import PageAnimate from "../../components/Animate/PageAnimate";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const InspectUser = () => {
    const { userID } = useParams();
    const navigate = useNavigate();
    const { successPopup, errorPopup } = useStore();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userID);
                if (response.status === 200) {
                    setUser(response.data);
                    setFormData(response.data);
                } else {
                    errorPopup('User not found');
                    navigate('/users');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                errorPopup('Failed to load user details');
                navigate('/users');
            } finally {
                setLoading(false);
            }
        };

        if (userID) {
            fetchUser();
        } else {
            errorPopup('User ID not found');
            navigate('/users');
        }
    }, [userID, navigate, errorPopup]);

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

    const validateForm = () => {
        const newErrors = {};

        // Username validation (optional but if provided)
        if (formData.username && formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Phone validation (optional but if provided)
        if (formData.phone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Invalid phone number';
        }

        // Avatar URL validation (optional but if provided)
        if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
            newErrors.avatar_url = 'Invalid avatar URL';
        }

        // Password validation (if provided)
        if (formData.password) {
            if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters long';
            }
            if (formData.password !== formData.confirm_password) {
                newErrors.confirm_password = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            errorPopup('Please fix the validation errors');
            return;
        }

        setSaving(true);
        try {
            // Only send fields that have changed
            const updateData = {};
            Object.keys(formData).forEach(key => {
                if (formData[key] !== user[key] && formData[key] !== '') {
                    updateData[key] = formData[key];
                }
            });

            if (Object.keys(updateData).length === 0) {
                setEditing(false);
                setSaving(false);
                return;
            }

            const response = await updateUser(userID, updateData);
            
            if (response.status === 200) {
                successPopup('User updated successfully');
                setUser({ ...user, ...updateData });
                setEditing(false);
            } else {
                errorPopup(response.data?.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            errorPopup('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await deleteUser(userID);
            
            if (response.status === 200) {
                successPopup('User deleted successfully');
                navigate('/users');
            } else {
                errorPopup(response.data?.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            errorPopup('Failed to delete user');
        }
        setDeleteDialog(false);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            errorPopup('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            errorPopup('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const response = await uploadUserImage(file);
            
            if (response.status === 200) {
                const imageUrl = response.data.imageUrl || response.data.url;
                setFormData(prev => ({
                    ...prev,
                    avatar_url: imageUrl
                }));
                successPopup('Image uploaded successfully');
            } else {
                errorPopup(response.data?.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            errorPopup('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setEditing(false);
        setErrors({});
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

    if (!user) {
        return (
            <PageAnimate>
                <Box p={4} textAlign="center">
                    <Typography variant="h6" color="error">User not found</Typography>
                </Box>
            </PageAnimate>
        );
    }

    return (
        <PageAnimate>
            <div className="w-full p-6">
                <div className="mb-6 flex items-center gap-4">
                    <button className="flex items-center" onClick={() => navigate(-1)}>
                        <ArrowBackIosNewIcon /> Go back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
                </div>

                <Grid container spacing={4}>
                    {/* User Profile Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent className="text-center">
                                <Avatar
                                    src={user.avatar_url}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                                />
                                {editing && (
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            sx={{ display: 'none' }}
                                            id="avatar-upload"
                                        />
                                        <label htmlFor="avatar-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                                disabled={uploading}
                                                size="small"
                                            >
                                                {uploading ? 'Uploading...' : 'Upload Photo'}
                                            </Button>
                                        </label>
                                    </Box>
                                )}
                                <Typography variant="h5" className="font-bold mb-2">
                                    {user.first_name} {user.middle_name} {user.last_name}
                                </Typography>
                                {user.username && (
                                    <Typography variant="body1" color="textSecondary" className="mb-2">
                                        @{user.username}
                                    </Typography>
                                )}
                                <Chip 
                                    label={user.role} 
                                    color="primary" 
                                    className="capitalize mb-4"
                                />
                                <div className="space-y-2">
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {user.email}
                                    </Typography>
                                    {user.phone && (
                                        <Typography variant="body2">
                                            <strong>Phone:</strong> {user.phone}
                                        </Typography>
                                    )}
                                    {user.job_title && (
                                        <Typography variant="body2">
                                            <strong>Job Title:</strong> {user.job_title}
                                        </Typography>
                                    )}
                                    {user.department && (
                                        <Typography variant="body2">
                                            <strong>Department:</strong> {user.department}
                                        </Typography>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* User Details Form */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <Typography variant="h6">User Information</Typography>
                                    <div className="flex gap-2">
                                        {!editing ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => setEditing(true)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => setDeleteDialog(true)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleCancel}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="first_name"
                                            value={formData.first_name || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            error={!!errors.first_name}
                                            helperText={errors.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="last_name"
                                            value={formData.last_name || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            error={!!errors.last_name}
                                            helperText={errors.last_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Middle Name"
                                            name="middle_name"
                                            value={formData.middle_name || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Username"
                                            name="username"
                                            value={formData.username || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            error={!!errors.username}
                                            helperText={errors.username}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleChange}
                                            disabled={true} // Email should not be editable
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Job Title"
                                            name="job_title"
                                            value={formData.job_title || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Department"
                                            name="department"
                                            value={formData.department || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth disabled={!editing}>
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                name="role"
                                                value={formData.role || ''}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="admin">Admin</MenuItem>
                                                <MenuItem value="manager">Manager</MenuItem>
                                                <MenuItem value="operator">Operator</MenuItem>
                                                <MenuItem value="customer">Customer</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Avatar URL"
                                            name="avatar_url"
                                            value={formData.avatar_url || ''}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            error={!!errors.avatar_url}
                                            helperText={errors.avatar_url}
                                        />
                                    </Grid>
                                    
                                    {editing && (
                                        <>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="New Password"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password || ''}
                                                    onChange={handleChange}
                                                    placeholder="Leave blank to keep current password"
                                                    error={!!errors.password}
                                                    helperText={errors.password}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    name="confirm_password"
                                                    type="password"
                                                    value={formData.confirm_password || ''}
                                                    onChange={handleChange}
                                                    error={!!errors.confirm_password}
                                                    helperText={errors.confirm_password}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialog}
                    onClose={() => setDeleteDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete {user?.first_name} {user?.last_name}? 
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </PageAnimate>
    );
};

export default InspectUser;