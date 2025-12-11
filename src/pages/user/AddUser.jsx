import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiUploadCloud, FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiShield, FiCheck } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createUser, uploadUserImage } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { Button, Input, CircularProgress } from "@mui/material";
import styles from './AddUser.module.css';

const AddUser = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_enter_password: '',
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    job_title: '',
    department: '',
    avatar_url: '',
    role: ''
  });
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validateCurrentStep = () => {
    const newErrors = {};

    if (page === 1) {
      // Step 1 validation: Personal Information
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.re_enter_password) newErrors.re_enter_password = 'Please confirm password';

      // Password validation
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Must be at least 8 characters long';
      }

      // Password confirmation
      if (formData.password && formData.re_enter_password && formData.password !== formData.re_enter_password) {
        newErrors.re_enter_password = 'Passwords do not match';
      }

      // Username validation (optional but if provided)
      if (formData.username && formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    } else if (page === 2) {
      // Step 2 validation: Contact & Avatar
      if (!formData.email) newErrors.email = 'Email is required';

      // Email validation
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Must be a valid email address';
      }

      // Phone validation (optional but if provided)
      if (formData.phone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
        newErrors.phone = 'Invalid phone number (7-15 digits)';
      }

      // Avatar URL validation (optional but if provided)
      if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
        newErrors.avatar_url = 'Invalid avatar URL';
      }
    } else if (page === 3) {
      // Step 3 validation: Role & Permissions
      if (!formData.role) newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const nextPage = useCallback(() => {
    if (validateCurrentStep() && page < 3) {
      setPage(page + 1);
    } else if (!validateCurrentStep()) {
      errorPopup("Please fill all required fields correctly");
    }
  }, [page, formData, errorPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.re_enter_password) newErrors.re_enter_password = 'Please confirm password';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.role) newErrors.role = 'Role is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Must be a valid email address';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Must be at least 8 characters long';
    }

    if (formData.password !== formData.re_enter_password) {
      newErrors.re_enter_password = 'Passwords do not match';
    }

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.phone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number (7-15 digits)';
    }

    if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
      newErrors.avatar_url = 'Invalid avatar URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file) => {
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

  const submit = async () => {
    if (!validateForm()) {
      errorPopup("Please fix the validation errors!");
      return;
    }

    try {
      const response = await createUser(formData);
      
      if (response.status === 201 || response.status === 200) {
        successPopup("User registered successfully!");
        navigate('/users');
      } else {
        const errorMessage = response.data?.message || "Failed to register the user";
        errorPopup(errorMessage);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      errorPopup("Failed to register the user");
    }
  };

  const steps = ["Personal", "Contact", "Permissions"];

  return (
    <PageAnimate>
      <div className={styles.pageContainer}>
        <div className={styles.backgroundElements}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>

        <div className={styles.contentWrapper}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>

          <div className={styles.mainContent}>
            {/* Left Side - Progress & Info */}
            <div className={styles.leftSide}>
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h2>New User Setup</h2>
                  <span className={styles.stepCounter}>{page}/3</span>
                </div>
                
                <div className={styles.stepsVertical}>
                  {steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className={`${styles.stepItem} ${page === idx + 1 ? styles.active : ''} ${page > idx + 1 ? styles.completed : ''}`}
                    >
                      <div className={styles.stepCircle}>
                        {page > idx + 1 ? <FiCheck /> : idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>


              </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.rightSide}>
              <div className={styles.formCard}>
                {page === 1 && <BasicPage formData={formData} handleChange={handleChange} errors={errors} />}
                {page === 2 && <ContactPage formData={formData} handleChange={handleChange} errors={errors} handleImageUpload={handleImageUpload} uploading={uploading} />}
                {page === 3 && <RolePage formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors} />}

                <div className={styles.formFooter}>
                  {page > 1 && (
                    <button className={styles.prevBtn} onClick={backPage}>
                      <FiArrowLeft />
                      <span>Back</span>
                    </button>
                  )}
                  {page === 3 ? (
                    <button className={styles.submitBtn} onClick={submit}>
                      <FiCheckCircle />
                      <span>Complete Registration</span>
                    </button>
                  ) : (
                    <button className={styles.nextBtn} onClick={nextPage}>
                      <span>Continue</span>
                      <FiArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddUser;

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiUser className={styles.pageIcon} />
          <h1>Personal Information</h1>
          <p>Let's start with your basic details</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>First Name *</label>
            <input
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.first_name ? styles.error : ''}`}
            />
            {errors.first_name && <span className={styles.errorMsg}>{errors.first_name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Last Name *</label>
            <input
              type="text"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.last_name ? styles.error : ''}`}
            />
            {errors.last_name && <span className={styles.errorMsg}>{errors.last_name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Middle Name</label>
            <input
              type="text"
              name="middle_name"
              placeholder="Michael"
              value={formData.middle_name}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.username ? styles.error : ''}`}
            />
            {errors.username && <span className={styles.errorMsg}>{errors.username}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.password ? styles.error : ''}`}
            />
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Confirm Password *</label>
            <input
              type="password"
              name="re_enter_password"
              placeholder="Re-enter your password"
              value={formData.re_enter_password}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.re_enter_password ? styles.error : ''}`}
            />
            {errors.re_enter_password && <span className={styles.errorMsg}>{errors.re_enter_password}</span>}
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const ContactPage = React.memo(({ formData, handleChange, errors, handleImageUpload, uploading }) => {
  const handleAvatarUrlChange = (e) => {
    const { value } = e.target;
    handleChange(e);
    // Clear the preview if user is editing the URL input
    if (value && formData.avatar_url && formData.avatar_url.includes('blob:')) {
      // URL is being edited after file upload, keep it
    }
  };

  const clearImageUpload = () => {
    // This will be called if user wants to use URL instead
    document.getElementById('avatar-upload-add').value = '';
  };

  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiMail className={styles.pageIcon} />
          <h1>Contact & Avatar</h1>
          <p>Add your contact details and profile picture</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.email ? styles.error : ''}`}
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+1-555-123-4567"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.phone ? styles.error : ''}`}
            />
            {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Avatar</label>
            <div className={styles.avatarSection}>
              <div className={styles.avatarOption}>
                <h3 className={styles.optionTitle}>Option 1: Avatar URL</h3>
                <input
                  type="url"
                  name="avatar_url"
                  placeholder="https://example.com/avatar.png"
                  value={formData.avatar_url}
                  onChange={handleAvatarUrlChange}
                  disabled={uploading}
                  className={`${styles.fieldInput} ${errors.avatar_url ? styles.error : ''}`}
                />
                {errors.avatar_url && <span className={styles.errorMsg}>{errors.avatar_url}</span>}
              </div>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <div className={styles.avatarOption}>
                <h3 className={styles.optionTitle}>Option 2: Upload Image</h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  sx={{ display: 'none' }}
                  id="avatar-upload-add"
                />
                <label htmlFor="avatar-upload-add" className={styles.uploadZone}>
                  <div className={styles.uploadContent}>
                    {uploading ? (
                      <>
                        <CircularProgress size={40} sx={{ color: '#dc2032' }} />
                        <span>Uploading image...</span>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className={styles.uploadIcon} />
                        <span className={styles.uploadText}>Drag & drop or click to upload</span>
                        <small>PNG, JPG, GIF up to 5MB</small>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {formData.avatar_url && (
              <div className={styles.avatarPreview}>
                <img src={formData.avatar_url} alt="Avatar preview" />
                <button
                  type="button"
                  className={styles.clearAvatarBtn}
                  onClick={() => {
                    handleChange({ target: { name: 'avatar_url', value: '' } });
                    clearImageUpload();
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

ContactPage.displayName = 'ContactPage';

const RolePage = React.memo(({ formData, setFormData, handleChange, errors }) => {
  const roleOptions = ["admin", "manager", "operator", "customer"];
  
  const roleDescriptions = {
    admin: "Full system access and user management capabilities",
    manager: "Department management, reporting and team oversight",
    operator: "Data entry, basic operations and task execution",
    customer: "View-only access to assigned resources"
  };

  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiBriefcase className={styles.pageIcon} />
          <h1>Role & Permissions</h1>
          <p>Define user role and job responsibilities</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>User Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.role ? styles.error : ''}`}
            >
              <option value="">Select a role</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
            {errors.role && <span className={styles.errorMsg}>{errors.role}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Job Title</label>
            <input
              type="text"
              name="job_title"
              placeholder="e.g., Software Engineer"
              value={formData.job_title}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g., Engineering"
              value={formData.department}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          {formData.role && (
            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <div className={styles.roleCard}>
                <div className={styles.roleCardHeader}>
                  <FiShield />
                  <h3>{formData.role.toUpperCase()}</h3>
                </div>
                <p>{roleDescriptions[formData.role]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MultiPageAnimate>
  );
});

RolePage.displayName = 'RolePage';
