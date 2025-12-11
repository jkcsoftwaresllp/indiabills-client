import { FiArrowLeft, FiUploadCloud, FiUser, FiBriefcase } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createCustomer, uploadImg } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { renameAndOptimize } from "../../utils/FormHelper";
import styles from './AddCustomers.module.css';

const AddCustomers = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState();

  const validateSlideFields = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Validate first slide (Basic Information)
      const requiredFields = ["first_name", "last_name", "email", "phone", "password", "confirm_password"];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === "") {
          newErrors[field] = field.replace(/_/g, " ").charAt(0).toUpperCase() + field.replace(/_/g, " ").slice(1) + " is required";
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      // Validate phone format
      if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = "Invalid phone number format";
      }

      // Validate password match
      if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }

      // Validate password length
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    } else if (pageNum === 2) {
      // Validate second slide (Business Details)
      if (formData.customer_type === "business") {
        if (!formData.business_name || formData.business_name.trim() === "") {
          newErrors.business_name = "Business Name is required for business customers";
        }
        if (!formData.gstin || formData.gstin.trim() === "") {
          newErrors.gstin = "GSTIN is required for business customers";
        }
      }

      // Validate customer type is selected
      if (!formData.customer_type) {
        newErrors.customer_type = "Customer Type is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

    setImage(file);
  };

  const submit = async () => {
    if (!validateSlideFields(2)) {
      errorPopup("Please fix the validation errors!");
      return;
    }

    setIsSubmitting(true);

    let avatar = "";
    if (image) {
      try {
        const ImageData = await renameAndOptimize(formData.first_name, image);
        const response = await uploadImg(ImageData.image, true);
        if (response !== 200) {
          errorPopup("Failed to upload the image");
          setIsSubmitting(false);
          return;
        }
        avatar = ImageData.name;
      } catch (err) {
        errorPopup("Failed to upload the image");
        setIsSubmitting(false);
        return;
      }
    }

    const finalData = {
      ...formData,
      avatar: avatar,
    };

    try {
      const status = await createCustomer(finalData);
      if (status === 201 || status === 200) {
        successPopup("Customer registered successfully!");
        setTimeout(() => {
          navigate("/customers");
        }, 500);
      } else {
        errorPopup("Failed to register the customer");
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to register the customer";
      errorPopup(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Personal Info", "Business Details"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      setImage={handleImageUpload}
      uploading={uploading}
    />,
    <BusinessPage
      key="business"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      setFormData={setFormData}
    />
  ];

  return (
    <>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 10
        }}
      >
        <FiArrowLeft />
      </button>
      <AddForm
        title="New Customer"
        steps={steps}
        pages={pages}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        onSubmit={submit}
        validatePage={validateSlideFields}
        isSubmitting={isSubmitting}
        onError={errorPopup}
      />
    </>
  );
};

export default AddCustomers;

const BasicPage = React.memo(({ formData, handleChange, errors, setImage, uploading }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiUser className={styles.pageIcon} />
          <h1>Personal Information</h1>
          <p>Let's start with your basic customer details</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>First Name *</label>
            <input
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name || ''}
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
              value={formData.last_name || ''}
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
              value={formData.middle_name || ''}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput}`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.email ? styles.error : ''}`}
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Phone *</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.phone ? styles.error : ''}`}
            />
            {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.password ? styles.error : ''}`}
            />
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Confirm Password *</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter your password"
              value={formData.confirm_password || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.confirm_password ? styles.error : ''}`}
            />
            {errors.confirm_password && <span className={styles.errorMsg}>{errors.confirm_password}</span>}
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              disabled={uploading}
              className={styles.fileInput}
              id="avatar-upload-add"
            />
            <label htmlFor="avatar-upload-add" className={styles.uploadZone}>
              <div className={styles.uploadContent}>
                {uploading ? (
                  <>
                    <div className={styles.spinner}></div>
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
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = "BasicPage";

const BusinessPage = React.memo(({ formData, handleChange, errors, setFormData }) => {
  const isBusinessCustomer = formData.customer_type === "business";

  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiBriefcase className={styles.pageIcon} />
          <h1>Business Details</h1>
          <p>Complete your customer type and business information</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Customer Type *</label>
            <select
              name="customer_type"
              value={formData.customer_type || ''}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.customer_type ? styles.error : ''}`}
            >
              <option value="">Select customer type</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
            {errors.customer_type && <span className={styles.errorMsg}>{errors.customer_type}</span>}
          </div>

          {isBusinessCustomer && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Business Name *</label>
                <input
                  type="text"
                  name="business_name"
                  placeholder="Your Business Name"
                  value={formData.business_name || ''}
                  onChange={handleChange}
                  className={`${styles.fieldInput} ${errors.business_name ? styles.error : ''}`}
                />
                {errors.business_name && <span className={styles.errorMsg}>{errors.business_name}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>GSTIN *</label>
                <input
                  type="text"
                  name="gstin"
                  placeholder="XXXXXXXXXXXX"
                  value={formData.gstin || ''}
                  onChange={handleChange}
                  className={`${styles.fieldInput} ${errors.gstin ? styles.error : ''}`}
                />
                {errors.gstin && <span className={styles.errorMsg}>{errors.gstin}</span>}
              </div>
            </>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>PAN Number</label>
            <input
              type="text"
              name="pan_number"
              placeholder="ABCDE1234F"
              value={formData.pan_number || ''}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Aadhar Number</label>
            <input
              type="text"
              name="aadhar_number"
              placeholder="123456789012"
              value={formData.aadhar_number || ''}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          {isBusinessCustomer && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>FSSAI Number</label>
                <input
                  type="text"
                  name="fssai_number"
                  placeholder="FSSAI Number"
                  value={formData.fssai_number || ''}
                  onChange={handleChange}
                  className={styles.fieldInput}
                />
              </div>
            </>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Credit Limit</label>
            <input
              type="number"
              name="credit_limit"
              placeholder="0"
              value={formData.credit_limit || ''}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Loyalty Points</label>
            <input
              type="number"
              name="loyalty_points"
              placeholder="0"
              value={formData.loyalty_points || ''}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
            />
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BusinessPage.displayName = "BusinessPage";
