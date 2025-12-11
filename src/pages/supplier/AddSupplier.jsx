import {
  FiArrowLeft,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createSupplier } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import styles from "./AddSupplier.module.css";
import { getOption } from "../../utils/FormHelper";

const AddSupplier = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    gstin: "",
    bankAccountNumber: "",
    ifscCode: "",
    upiId: "",
    creditLimit: "0",
    paymentTerms: "",
    rating: "5",
    remarks: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = useCallback(
    (pageNum) => {
      const newErrors = {};
      
      if (pageNum === 1) {
        // Step 1: Basic Information
        if (!formData.name?.trim())
          newErrors.name = "Supplier name is required";
        if (!formData.phone?.trim())
          newErrors.phone = "Phone number is required";
        if (
          formData.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          newErrors.email = "Please enter a valid email address";
        }
      } else if (pageNum === 2) {
        // Step 2: Address & Location
        if (!formData.city?.trim()) newErrors.city = "City is required";
        if (!formData.state?.trim()) newErrors.state = "State is required";
        if (!formData.addressLine?.trim())
          newErrors.addressLine = "Address line is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const submit = async () => {
    if (!validateCurrentStep(2)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        name: formData.name.trim(),
        businessName: formData.businessName?.trim() || formData.name.trim(),
        contactPerson: formData.contactPerson?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim(),
        alternatePhone: formData.alternatePhone?.trim() || null,
        addressLine: formData.addressLine?.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim() || null,
        pinCode: formData.pinCode?.trim() || null,
        gstin: formData.gstin?.trim() || null,
        bankAccountNumber: formData.bankAccountNumber?.trim() || null,
        ifscCode: formData.ifscCode?.trim() || null,
        upiId: formData.upiId?.trim() || null,
        creditLimit: parseInt(formData.creditLimit) || 0,
        paymentTerms: formData.paymentTerms?.trim() || null,
        rating: parseInt(formData.rating) || 5,
        remarks: formData.remarks?.trim() || null,
        isActive: true,
      };

      const status = await createSupplier(apiData);

      if (status === 201 || status === 200) {
        successPopup("Supplier registered successfully!");
        navigate("/suppliers");
      } else {
        errorPopup("Failed to register the supplier");
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      const errorMessage = error?.message || "Failed to register the supplier";
      errorPopup(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Info", "Location & Address", "Financial Details"];

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
      setFormData={setFormData}
    />,
    <FinancialPage
      key="financial"
      formData={formData}
      handleChange={handleChange}
    />,
  ];

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ padding: "0.4rem 1.5rem 0rem 1.5rem" }}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <FiArrowLeft />
        </button>
      </div>
      <AddForm
        title="New Supplier Registration"
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

export default AddSupplier;

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiBriefcase className={styles.pageIcon} />
          <h1>Supplier Information</h1>
          <p>Provide basic details about the supplier</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Supplier Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., ABC Textiles Pvt Ltd"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${
                errors.name ? styles.error : ""
              }`}
            />
            {errors.name && (
              <span className={styles.errorMsg}>{errors.name}</span>
            )}
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Business Name</label>
            <input
              type="text"
              name="businessName"
              placeholder="e.g., ABC Textiles (same as supplier name if not applicable)"
              value={formData.businessName}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g., Rajesh Kumar"
              value={formData.contactPerson}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., supplier@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.fieldInput} ${
                errors.email ? styles.error : ""
              }`}
            />
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Primary Phone *</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g., +91-9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.fieldInput} ${
                errors.phone ? styles.error : ""
              }`}
              maxLength="20"
            />
            {errors.phone && (
              <span className={styles.errorMsg}>{errors.phone}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Alternate Phone</label>
            <input
              type="text"
              name="alternatePhone"
              placeholder="e.g., +91-9876543211"
              value={formData.alternatePhone}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="20"
            />
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = "BasicPage";

const LocationPage = React.memo(
  ({ formData, handleChange, errors, setFormData }) => {
    return (
      <MultiPageAnimate>
        <div className={styles.formContent}>
          <div className={styles.pageHeader}>
            <FiMapPin className={styles.pageIcon} />
            <h1>Location & Address</h1>
            <p>Enter supplier's complete address and GSTIN</p>
          </div>

          <div className={styles.fieldGrid}>
            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>Address Line *</label>
              <input
                type="text"
                name="addressLine"
                placeholder="e.g., 123 Industrial Park, Street Name"
                value={formData.addressLine}
                onChange={handleChange}
                className={`${styles.fieldInput} ${
                  errors.addressLine ? styles.error : ""
                }`}
              />
              {errors.addressLine && (
                <span className={styles.errorMsg}>{errors.addressLine}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>City *</label>
              <input
                type="text"
                name="city"
                placeholder="e.g., Mumbai"
                value={formData.city}
                onChange={handleChange}
                className={`${styles.fieldInput} ${
                  errors.city ? styles.error : ""
                }`}
              />
              {errors.city && (
                <span className={styles.errorMsg}>{errors.city}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`${styles.fieldInput} ${styles.selectInput} ${
                  errors.state ? styles.error : ""
                }`}
              >
                <option value="">Select a state</option>
                {getOption("state").map((state, idx) => (
                  <option key={idx} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <span className={styles.errorMsg}>{errors.state}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Pin Code</label>
              <input
                type="text"
                name="pinCode"
                placeholder="e.g., 400001"
                value={formData.pinCode}
                onChange={handleChange}
                className={styles.fieldInput}
                maxLength="6"
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>GSTIN</label>
              <input
                type="text"
                name="gstin"
                placeholder="e.g., 27AAPCU9603R1Z0"
                value={formData.gstin}
                onChange={handleChange}
                className={styles.fieldInput}
                maxLength="15"
              />
              <small className={styles.fieldHint}>
                Goods and Services Tax Identification Number
              </small>
            </div>
          </div>
        </div>
      </MultiPageAnimate>
    );
  }
);

LocationPage.displayName = "LocationPage";

const FinancialPage = React.memo(({ formData, handleChange }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiDollarSign className={styles.pageIcon} />
          <h1>Financial & Payment Details</h1>
          <p>Configure banking and payment information</p>
        </div>

        <div className={styles.fieldGrid}>
          {/* Banking Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiBriefcase size={18} />
              <h3>Banking Information</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Bank Account Number</label>
            <input
              type="text"
              name="bankAccountNumber"
              placeholder="e.g., 12345678901234"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="20"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              placeholder="e.g., HDFC0001234"
              value={formData.ifscCode}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="11"
            />
            <small className={styles.fieldHint}>
              Indian Financial System Code
            </small>
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>UPI ID</label>
            <input
              type="text"
              name="upiId"
              placeholder="e.g., supplier@okhdfcbank"
              value={formData.upiId}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          {/* Payment Terms Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiDollarSign size={18} />
              <h3>Payment Terms</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Credit Limit (₹)</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="creditLimit"
                placeholder="0"
                value={formData.creditLimit}
                onChange={handleChange}
                className={styles.fieldInput}
                min="0"
                step="1"
              />
            </div>
            <small className={styles.fieldHint}>
              Maximum credit allowed for this supplier
            </small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Payment Terms</label>
            <input
              type="text"
              name="paymentTerms"
              placeholder="e.g., Net 30, Net 60, COD"
              value={formData.paymentTerms}
              onChange={handleChange}
              className={styles.fieldInput}
            />
            <small className={styles.fieldHint}>
              e.g., Net 30, Net 60, Cash on Delivery
            </small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Supplier Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput}`}
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Remarks</label>
            <textarea
              name="remarks"
              placeholder="Add any additional notes about this supplier..."
              value={formData.remarks}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.textArea}`}
              rows="3"
            />
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

FinancialPage.displayName = "FinancialPage";
