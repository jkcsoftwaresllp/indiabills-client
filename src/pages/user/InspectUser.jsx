import { FiArrowLeft, FiEdit, FiSave, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, deleteUser, uploadUserImage } from "../../network/api";
import { useStore } from "../../store/store";
import PageAnimate from "../../components/Animate/PageAnimate";
import { motion } from 'framer-motion';
import styles from './InspectUser.module.css';

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
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.username && formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (formData.phone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = 'Invalid phone number';
        }

        if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
            newErrors.avatar_url = 'Invalid avatar URL';
        }

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

        if (!file.type.startsWith('image/')) {
            errorPopup('Please select a valid image file');
            return;
        }

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
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading user details...</p>
                    </div>
                </div>
            </PageAnimate>
        );
    }

    if (!user) {
        return (
            <PageAnimate>
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <p className={styles.loadingText}>User not found</p>
                    </div>
                </div>
            </PageAnimate>
        );
    }

    return (
        <PageAnimate>
            <div className={styles.pageContainer}>
                {/* Header */}
                <motion.div 
                    className={styles.header}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button 
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className={styles.headerTitle}>User Details</h1>
                </motion.div>

                {/* Main Content */}
                <div className={styles.mainGrid}>
                    {/* Left Profile Card */}
                    <motion.div 
                        className={styles.profileCard}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className={styles.profileContent}>
                            {/* Avatar */}
                            <div className={styles.avatarWrapper}>
                                {user?.avatar_url ? (
                                    <img 
                                        src={user.avatar_url} 
                                        alt={user.first_name}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarFallback}>
                                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Upload Button */}
                            {editing && (
                                <label htmlFor="avatar-upload" style={{ width: '100%' }}>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <button 
                                        className={styles.uploadPhotoBtn}
                                        disabled={uploading}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('avatar-upload').click();
                                        }}
                                    >
                                        <FiUploadCloud />
                                        {uploading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                </label>
                            )}

                            {/* Name & Username */}
                            <div className={styles.profileName}>
                                <h2 className={styles.profileNameText}>
                                    {user.first_name} {user.middle_name} {user.last_name}
                                </h2>
                                {user.username && (
                                    <p className={styles.profileUsername}>@{user.username}</p>
                                )}
                            </div>

                            {/* Role Badge */}
                            <span className={styles.roleBadge}>
                                {user.role}
                            </span>

                            <div className={styles.profileDivider}></div>

                            {/* Profile Info */}
                            <div className={styles.profileInfo}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={styles.infoValue}>{user.email}</span>
                                </div>

                                {user.phone && (
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Phone</span>
                                        <span className={styles.infoValue}>{user.phone}</span>
                                    </div>
                                )}

                                {user.job_title && (
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Job Title</span>
                                        <span className={styles.infoValue}>{user.job_title}</span>
                                    </div>
                                )}

                                {user.department && (
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Department</span>
                                        <span className={styles.infoValue}>{user.department}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Details Card */}
                    <motion.div 
                        className={styles.detailsCard}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Header */}
                        <div className={styles.detailsCardHeader}>
                            <h2 className={styles.detailsTitle}>User Information</h2>
                            <div className={styles.actionButtons}>
                                {!editing ? (
                                    <>
                                        <motion.button 
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            onClick={() => setEditing(true)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiEdit /> Edit
                                        </motion.button>
                                        <motion.button 
                                            className={`${styles.btn} ${styles.btnDanger}`}
                                            onClick={() => setDeleteDialog(true)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiTrash2 /> Delete
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <motion.button 
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            onClick={handleSave}
                                            disabled={saving}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiSave /> {saving ? 'Saving...' : 'Save'}
                                        </motion.button>
                                        <motion.button 
                                            className={`${styles.btn} ${styles.btnSecondary}`}
                                            onClick={handleCancel}
                                            disabled={saving}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className={styles.formContent}>
                            <div className={styles.formGrid}>
                                {/* First Name */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className={`${styles.input} ${errors.first_name ? styles.error : ''}`}
                                        value={formData.first_name || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                    {errors.first_name && <span className={styles.errorMessage}>{errors.first_name}</span>}
                                </div>

                                {/* Last Name */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className={`${styles.input} ${errors.last_name ? styles.error : ''}`}
                                        value={formData.last_name || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                    {errors.last_name && <span className={styles.errorMessage}>{errors.last_name}</span>}
                                </div>

                                {/* Middle Name */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Middle Name</label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        className={styles.input}
                                        value={formData.middle_name || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>

                                {/* Username */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className={`${styles.input} ${errors.username ? styles.error : ''}`}
                                        value={formData.username || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                    {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                                </div>

                                {/* Email (Read-only) */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={styles.input}
                                        value={formData.email || ''}
                                        disabled={true}
                                    />
                                </div>

                                {/* Phone */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                                </div>

                                {/* Job Title */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Job Title</label>
                                    <input
                                        type="text"
                                        name="job_title"
                                        className={styles.input}
                                        value={formData.job_title || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>

                                {/* Department */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        className={styles.input}
                                        value={formData.department || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>

                                {/* Role */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Role</label>
                                    <select
                                        name="role"
                                        className={`${styles.select} ${errors.role ? styles.error : ''}`}
                                        value={formData.role || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="operator">Operator</option>
                                        <option value="customer">Customer</option>
                                    </select>
                                    {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}
                                </div>

                                {/* Avatar URL */}
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Avatar URL</label>
                                    <input
                                        type="url"
                                        name="avatar_url"
                                        className={`${styles.input} ${errors.avatar_url ? styles.error : ''}`}
                                        value={formData.avatar_url || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="https://example.com/avatar.png"
                                    />
                                    {errors.avatar_url && <span className={styles.errorMessage}>{errors.avatar_url}</span>}
                                </div>

                                {/* Password Fields (only when editing) */}
                                {editing && (
                                    <>
                                        <div className={styles.sectionDivider}></div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>New Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                                                value={formData.password || ''}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current password"
                                            />
                                            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                className={`${styles.input} ${errors.confirm_password ? styles.error : ''}`}
                                                value={formData.confirm_password || ''}
                                                onChange={handleChange}
                                                placeholder="Confirm your new password"
                                            />
                                            {errors.confirm_password && <span className={styles.errorMessage}>{errors.confirm_password}</span>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Delete Confirmation Dialog */}
                {deleteDialog && (
                    <motion.div 
                        className={styles.dialogOverlay}
                        onClick={() => !saving && setDeleteDialog(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={styles.dialog}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                        >
                            <div className={styles.dialogHeader}>
                                <h3 className={styles.dialogTitle}>Delete User</h3>
                            </div>
                            <div className={styles.dialogContent}>
                                <p className={styles.dialogMessage}>
                                    Are you sure you want to delete <strong>{user?.first_name} {user?.last_name}</strong>? 
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className={styles.dialogFooter}>
                                <button 
                                    className={`${styles.dialogBtn} ${styles.dialogBtnCancel}`}
                                    onClick={() => setDeleteDialog(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={`${styles.dialogBtn} ${styles.dialogBtnDelete}`}
                                    onClick={handleDelete}
                                    disabled={saving}
                                >
                                    {saving ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </PageAnimate>
    );
};

export default InspectUser;
