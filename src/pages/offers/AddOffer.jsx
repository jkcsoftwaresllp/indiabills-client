import { FiArrowLeft, FiTag, FiPercent, FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createOffer } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import styles from './AddOffer.module.css';

const AddOffer = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    offerType: 'product_discount',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Step 1: Basic Information
      if (!formData.name?.trim()) newErrors.name = 'Offer name is required';
      if (!formData.offerType) newErrors.offerType = 'Offer type is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';

      // Validate date range
      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (startDate >= endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    } else if (pageNum === 2) {
      // Step 2: Discount Details
      if (formData.discountValue === '' || formData.discountValue === null || formData.discountValue === undefined) {
        newErrors.discountValue = 'Discount value is required';
      } else if (isNaN(parseFloat(formData.discountValue)) || parseFloat(formData.discountValue) <= 0) {
        newErrors.discountValue = 'Discount value must be greater than 0';
      }

      if (!formData.discountType) {
        newErrors.discountType = 'Discount type is required';
      }

      // Validate percentage if applicable
      if (formData.discountType === 'percentage' && formData.discountValue) {
        const value = parseFloat(formData.discountValue);
        if (value > 100) {
          newErrors.discountValue = 'Percentage cannot exceed 100%';
        }
      }

      // Validate optional fields if provided
      if (formData.maxDiscountAmount && isNaN(parseFloat(formData.maxDiscountAmount))) {
        newErrors.maxDiscountAmount = 'Must be a valid number';
      }
      if (formData.minOrderAmount && isNaN(parseFloat(formData.minOrderAmount))) {
        newErrors.minOrderAmount = 'Must be a valid number';
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

  const submit = async () => {
    if (!validateCurrentStep(2)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        offer_type: formData.offerType,
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        max_discount_amount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : 0,
        min_order_amount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        start_date: new Date(formData.startDate).toISOString(),
        end_date: new Date(formData.endDate).toISOString(),
        is_active: formData.isActive,
      };

      const status = await createOffer(payload);

      if (status === 201 || status === 200) {
        successPopup("Offer created successfully!");
        navigate('/offers');
      } else {
        errorPopup("Failed to create the offer");
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to create the offer";
      errorPopup(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Info", "Discount Details"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
    <DiscountPage
      key="discount"
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
        title="Create New Offer"
        steps={steps}
        pages={pages}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        onSubmit={submit}
        validatePage={validateCurrentStep}
        isSubmitting={isSubmitting}
        onError={errorPopup}
        successMessage="Offer created successfully!"
      />
    </div>
  );
};

export default AddOffer;

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiTag className={styles.pageIcon} />
          <h1>Basic Information</h1>
          <p>Let's start with the offer basics</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Offer Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Summer Mega Sale"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.name ? styles.error : ''}`}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your offer..."
              value={formData.description}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.textArea}`}
              rows="3"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Offer Type *</label>
            <select
              name="offerType"
              value={formData.offerType}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.offerType ? styles.error : ''}`}
            >
              <option value="">Select offer type</option>
              <option value="product_discount">Product Discount</option>
              <option value="order_discount">Order Discount</option>
              <option value="shipping_discount">Free Shipping</option>
            </select>
            {errors.offerType && <span className={styles.errorMsg}>{errors.offerType}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Status</label>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => {
                  handleChange({
                    target: { name: 'isActive', value: e.target.checked }
                  });
                }}
                className={styles.toggleCheckbox}
              />
              <span className={styles.toggleLabel}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Date Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiCalendar size={18} />
              <h3>Validity Period</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Start Date *</label>
            <div className={styles.dateInput}>
              <FiCalendar className={styles.dateIcon} />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.startDate ? styles.error : ''}`}
              />
            </div>
            {errors.startDate && <span className={styles.errorMsg}>{errors.startDate}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>End Date *</label>
            <div className={styles.dateInput}>
              <FiCalendar className={styles.dateIcon} />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.endDate ? styles.error : ''}`}
              />
            </div>
            {errors.endDate && <span className={styles.errorMsg}>{errors.endDate}</span>}
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const DiscountPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiPercent className={styles.pageIcon} />
          <h1>Discount Details</h1>
          <p>Configure the discount parameters</p>
        </div>

        <div className={styles.fieldGrid}>
          {/* Discount Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiPercent size={18} />
              <h3>Discount Settings</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Discount Type *</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.discountType ? styles.error : ''}`}
            >
              <option value="">Select type</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
            {errors.discountType && <span className={styles.errorMsg}>{errors.discountType}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Discount Value * {formData.discountType === 'percentage' && '(%)'}
              {formData.discountType === 'fixed' && '(₹)'}
            </label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>
                {formData.discountType === 'percentage' ? '%' : '₹'}
              </span>
              <input
                type="number"
                name="discountValue"
                placeholder="e.g., 20"
                value={formData.discountValue}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.discountValue ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.discountValue && <span className={styles.errorMsg}>{errors.discountValue}</span>}
            <small className={styles.fieldHint}>
              {formData.discountType === 'percentage' 
                ? 'Enter percentage value (0-100)' 
                : 'Enter fixed discount amount'}
            </small>
          </div>

          {/* Limits Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiDollarSign size={18} />
              <h3>Discount Limits (Optional)</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Maximum Discount Amount</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="maxDiscountAmount"
                placeholder="e.g., 500"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.maxDiscountAmount ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.maxDiscountAmount && <span className={styles.errorMsg}>{errors.maxDiscountAmount}</span>}
            <small className={styles.fieldHint}>Cap on the total discount amount per transaction</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Minimum Order Amount</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="minOrderAmount"
                placeholder="e.g., 1000"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.minOrderAmount ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.minOrderAmount && <span className={styles.errorMsg}>{errors.minOrderAmount}</span>}
            <small className={styles.fieldHint}>Minimum order value required to apply this offer</small>
          </div>


        </div>
      </div>
    </MultiPageAnimate>
  );
});

DiscountPage.displayName = 'DiscountPage';
