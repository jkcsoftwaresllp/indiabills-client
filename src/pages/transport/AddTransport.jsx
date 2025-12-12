import React, { useState, useCallback, useEffect } from "react";
import { FiArrowLeft, FiTruck, FiMapPin, FiFileText, FiAlertCircle } from 'react-icons/fi';
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createTransportPartner } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { getOption } from "../../utils/FormHelper";
import styles from './AddTransport.module.css';

const AddTransport = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    alternatePhone: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    gstNumber: '',
    panNumber: '',
    vehicleDetails: '',
    baseRate: '',
    ratePerKm: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Step 1: Basic Information
      if (!formData.name?.trim()) newErrors.name = 'Transport name is required';
      if (!formData.businessName?.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
      if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Valid 10-digit phone is required';
    } else if (pageNum === 2) {
      // Step 2: Address Details
      if (!formData.addressLine?.trim()) newErrors.addressLine = 'Address is required';
      if (!formData.city?.trim()) newErrors.city = 'City is required';
      if (!formData.state?.trim()) newErrors.state = 'State is required';
      if (!formData.pinCode?.trim()) newErrors.pinCode = 'Pin code is required';
      else if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'Valid 6-digit pin code is required';
      
      const baseRate = parseFloat(formData.baseRate);
      const ratePerKm = parseFloat(formData.ratePerKm);
      
      if (!formData.baseRate || isNaN(baseRate) || baseRate < 0) {
        newErrors.baseRate = 'Valid base rate is required';
      }
      if (!formData.ratePerKm || isNaN(ratePerKm) || ratePerKm < 0) {
        newErrors.ratePerKm = 'Valid rate per KM is required';
      }
    } else if (pageNum === 3) {
      // Step 3: Legal Details & Vehicles
      if (!formData.vehicleDetails?.trim()) newErrors.vehicleDetails = 'At least one vehicle is required';
      if (!formData.gstNumber?.trim()) newErrors.gstNumber = 'GST number is required';
      else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
        newErrors.gstNumber = 'Valid GST number format required (e.g., 29ABCDE1234F1Z5)';
      }
      if (!formData.panNumber?.trim()) newErrors.panNumber = 'PAN number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
        newErrors.panNumber = 'Valid PAN format required (e.g., ABCDE1234F)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

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

  const buildPayload = () => {
    const vehiclesArray = formData.vehicleDetails
      ?.split(/[,\n]/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0) || [];

    return {
      name: formData.name.trim(),
      business_name: formData.businessName.trim(),
      contact_person: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      alternate_phone: formData.alternatePhone?.trim() || null,
      address_line: formData.addressLine.trim(),
      city: formData.city.trim(),
      state: formData.state,
      pin_code: formData.pinCode.trim(),
      gst_number: formData.gstNumber.toUpperCase(),
      pan_number: formData.panNumber.toUpperCase(),
      vehicle_details: { vehicles: vehiclesArray },
      base_rate: Number(formData.baseRate) || 0,
      rate_per_km: Number(formData.ratePerKm) || 0
    };
  };

  const submit = async () => {
    if (!validateCurrentStep(3)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload();
      const status = await createTransportPartner(payload);
      
      if (status === 200 || status === 201) {
        successPopup("Transport partner registered successfully!");
        navigate("/transport");
      } else {
        errorPopup("Failed to register transport partner");
      }
    } catch (err) {
      console.error('Error:', err);
      errorPopup("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Information", "Address & Pricing", "Legal Details"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
    <AddressPage
      key="address"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
    <LegalPage
      key="legal"
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
        title="Register Transport Partner"
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

export default AddTransport;

/* ==================== Page Components ==================== */

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiTruck className={styles.pageIcon} />
          <h1>Basic Information</h1>
          <p>Tell us about your transport business</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Transport Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Fast Logistics Pvt Ltd"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.name ? styles.error : ''}`}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              placeholder="e.g., FL Logistics"
              value={formData.businessName}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.businessName ? styles.error : ''}`}
            />
            {errors.businessName && <span className={styles.errorMsg}>{errors.businessName}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Contact Person *</label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g., Raj Kumar"
              value={formData.contactPerson}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.contactPerson ? styles.error : ''}`}
            />
            {errors.contactPerson && <span className={styles.errorMsg}>{errors.contactPerson}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., contact@fastlogistics.com"
              value={formData.email}
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
              placeholder="10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.phone ? styles.error : ''}`}
              maxLength="15"
            />
            {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Alternate Phone</label>
            <input
              type="tel"
              name="alternatePhone"
              placeholder="Optional alternate number"
              value={formData.alternatePhone}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="15"
            />
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const AddressPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiMapPin className={styles.pageIcon} />
          <h1>Address & Pricing</h1>
          <p>Location and pricing details</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Address Line *</label>
            <textarea
              name="addressLine"
              placeholder="Full address including street, building, etc."
              value={formData.addressLine}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.textArea} ${errors.addressLine ? styles.error : ''}`}
              rows="2"
            />
            {errors.addressLine && <span className={styles.errorMsg}>{errors.addressLine}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>City *</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Bangalore"
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
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.state ? styles.error : ''}`}
            >
              <option value="">Select a state</option>
              {getOption("state").map((state, idx) => (
                <option key={idx} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className={styles.errorMsg}>{errors.state}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Pin Code *</label>
            <input
              type="text"
              name="pinCode"
              placeholder="6-digit pin code"
              value={formData.pinCode}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.pinCode ? styles.error : ''}`}
              maxLength="6"
            />
            {errors.pinCode && <span className={styles.errorMsg}>{errors.pinCode}</span>}
          </div>

          {/* Pricing Section Header */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiAlertCircle size={18} />
              <h3>Pricing</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Base Rate (₹) *</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="baseRate"
                placeholder="0.00"
                value={formData.baseRate}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.baseRate ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.baseRate && <span className={styles.errorMsg}>{errors.baseRate}</span>}
            <small className={styles.fieldHint}>Base rate per trip</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Rate Per KM (₹) *</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="ratePerKm"
                placeholder="0.00"
                value={formData.ratePerKm}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.ratePerKm ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.ratePerKm && <span className={styles.errorMsg}>{errors.ratePerKm}</span>}
            <small className={styles.fieldHint}>Per kilometer charge</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

AddressPage.displayName = 'AddressPage';

const LegalPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiFileText className={styles.pageIcon} />
          <h1>Legal Details</h1>
          <p>Complete your legal information</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Vehicle Numbers (comma or line separated) *</label>
            <textarea
              name="vehicleDetails"
              placeholder="e.g., KA01AB1234&#10;KA02CD5678&#10;TN03EF9012"
              value={formData.vehicleDetails}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.textArea} ${errors.vehicleDetails ? styles.error : ''}`}
              rows="3"
            />
            {errors.vehicleDetails && <span className={styles.errorMsg}>{errors.vehicleDetails}</span>}
            <small className={styles.fieldHint}>Add one vehicle number per line or separated by commas</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>GST Number *</label>
            <input
              type="text"
              name="gstNumber"
              placeholder="e.g., 29ABCDE1234F1Z5"
              value={formData.gstNumber}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.gstNumber ? styles.error : ''}`}
              maxLength="15"
            />
            {errors.gstNumber && <span className={styles.errorMsg}>{errors.gstNumber}</span>}
            <small className={styles.fieldHint}>15-character GST registration number</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>PAN Number *</label>
            <input
              type="text"
              name="panNumber"
              placeholder="e.g., ABCDE1234F"
              value={formData.panNumber}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.panNumber ? styles.error : ''}`}
              maxLength="10"
            />
            {errors.panNumber && <span className={styles.errorMsg}>{errors.panNumber}</span>}
            <small className={styles.fieldHint}>10-character PAN number</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

LegalPage.displayName = 'LegalPage';
