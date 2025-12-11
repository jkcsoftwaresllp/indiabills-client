import { FiArrowLeft, FiMapPin, FiUser, FiBox } from 'react-icons/fi';
import React, { useState, useCallback, useEffect } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createWarehouse } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import styles from './AddWarehouse.module.css';
import { getOption } from "../../utils/FormHelper";

const AddWarehouse = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    capacity: '',
    managerName: '',
    managerPhone: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [states, setStates] = useState([]);

  // Load states on component mount
  useEffect(() => {
    const stateOptions = getOption("state");
    setStates(Array.isArray(stateOptions) ? stateOptions : []);
  }, []);

  const validateCurrentStep = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Step 1: Basic Information
      if (!formData.name?.trim()) newErrors.name = 'Warehouse name is required';
      if (!formData.code?.trim()) newErrors.code = 'Warehouse code is required';
      if (formData.code && !/^[a-zA-Z0-9-_]+$/.test(formData.code)) {
        newErrors.code = 'Code can only contain letters, numbers, hyphens, and underscores';
      }
      if (formData.capacity !== '' && (isNaN(parseInt(formData.capacity)) || parseInt(formData.capacity) < 0)) {
        newErrors.capacity = 'Capacity must be a non-negative number';
      }
    } else if (pageNum === 2) {
      // Step 2: Address & Location
      if (!formData.addressLine?.trim()) newErrors.addressLine = 'Address is required';
      if (!formData.city?.trim()) newErrors.city = 'City is required';
      if (!formData.state?.trim()) newErrors.state = 'State is required';
      if (!formData.pinCode?.trim()) newErrors.pinCode = 'PIN code is required';
      if (formData.pinCode && !/^\d{4,10}$/.test(formData.pinCode)) {
        newErrors.pinCode = 'PIN code must be 4-10 digits';
      }
    } else if (pageNum === 3) {
      // Step 3: Manager Information
      if (formData.managerPhone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.managerPhone.replace(/[\s-]/g, ''))) {
        newErrors.managerPhone = 'Phone must be 7-15 digits with optional country code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStateChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      state: value,
    }));
    if (errors.state) {
      setErrors(prev => ({
        ...prev,
        state: ''
      }));
    }
  };

  const submit = async () => {
    if (!validateCurrentStep(3)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        addressLine: formData.addressLine.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim(),
        capacity: formData.capacity !== '' ? parseInt(formData.capacity) : 0,
        managerName: formData.managerName?.trim() || null,
        managerPhone: formData.managerPhone?.trim() || null,
        isActive: true
      };

      const response = await createWarehouse(apiData);

      if (response === 201 || response === 200) {
        successPopup("Warehouse created successfully!");
        navigate('/warehouses');
      } else {
        errorPopup("Failed to create warehouse");
      }
    } catch (error) {
      console.error('Error creating warehouse:', error);
      errorPopup("Failed to create warehouse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Info", "Location", "Manager"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
    <LocationPage
      key="location"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      states={states}
      handleStateChange={handleStateChange}
    />,
    <ManagerPage
      key="manager"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ padding: '0.4rem 1.5rem 0rem 1.5rem' }}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <FiArrowLeft />
        </button>
      </div>
      <AddForm
        title="New Warehouse Setup"
        steps={steps}
        pages={pages}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        onSubmit={submit}
        validatePage={validateCurrentStep}
        isSubmitting={isSubmitting}
        onError={errorPopup}
      />
    </div>
  );
};

export default AddWarehouse;

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiBox className={styles.pageIcon} />
          <h1>Basic Information</h1>
          <p>Set up your warehouse identity</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Warehouse Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Main Warehouse, Mumbai Branch"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.name ? styles.error : ''}`}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Warehouse Code *</label>
            <input
              type="text"
              name="code"
              placeholder="e.g., WH-001, MW-MAIN"
              value={formData.code}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.code ? styles.error : ''}`}
              maxLength="20"
            />
            {errors.code && <span className={styles.errorMsg}>{errors.code}</span>}
            <small className={styles.fieldHint}>Letters, numbers, hyphens, underscores only</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Storage Capacity</label>
            <div className={styles.capacityInput}>
              <input
                type="number"
                name="capacity"
                placeholder="0"
                value={formData.capacity}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.capacity ? styles.error : ''}`}
                min="0"
              />
              <span className={styles.capacityUnit}>units</span>
            </div>
            {errors.capacity && <span className={styles.errorMsg}>{errors.capacity}</span>}
            <small className={styles.fieldHint}>Maximum items this warehouse can store</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const LocationPage = React.memo(({ formData, handleChange, errors, states, handleStateChange }) => {
  const stateList = Array.isArray(states) ? states : [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiMapPin className={styles.pageIcon} />
          <h1>Location Details</h1>
          <p>Enter the warehouse address</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Address Line *</label>
            <input
              type="text"
              name="addressLine"
              placeholder="e.g., 123 Industrial Park, Sector 5"
              value={formData.addressLine}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.addressLine ? styles.error : ''}`}
            />
            {errors.addressLine && <span className={styles.errorMsg}>{errors.addressLine}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>City *</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Mumbai, Bangalore"
              value={formData.city}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.city ? styles.error : ''}`}
            />
            {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.state ? styles.error : ''}`}
            >
              <option value="">Select a state</option>
              {stateList.map((state, idx) => (
                <option key={idx} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className={styles.errorMsg}>{errors.state}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>PIN Code *</label>
            <input
              type="text"
              name="pinCode"
              placeholder="e.g., 400001"
              value={formData.pinCode}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.pinCode ? styles.error : ''}`}
              maxLength="10"
            />
            {errors.pinCode && <span className={styles.errorMsg}>{errors.pinCode}</span>}
            <small className={styles.fieldHint}>4-10 digits</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

LocationPage.displayName = 'LocationPage';

const ManagerPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiUser className={styles.pageIcon} />
          <h1>Manager Information</h1>
          <p>Who manages this warehouse? (Optional)</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Manager Name</label>
            <input
              type="text"
              name="managerName"
              placeholder="e.g., John Doe"
              value={formData.managerName}
              onChange={handleChange}
              className={styles.fieldInput}
            />
            <small className={styles.fieldHint}>Leave blank if not assigned yet</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Manager Phone</label>
            <div className={styles.phoneInput}>
              <span className={styles.phonePrefix}>+91</span>
              <input
                type="text"
                name="managerPhone"
                placeholder="e.g., 9876543210"
                value={formData.managerPhone}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.managerPhone ? styles.error : ''}`}
                maxLength="15"
              />
            </div>
            {errors.managerPhone && <span className={styles.errorMsg}>{errors.managerPhone}</span>}
            <small className={styles.fieldHint}>7-15 digits (optional country code)</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

ManagerPage.displayName = 'ManagerPage';
