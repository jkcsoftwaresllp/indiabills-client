import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createFirstTimeOrganization } from "../../network/api/organizationApi";
import { useStore } from "../../store/store";
import {
  getTempSession,
  clearTempSession,
  validateOrganizationData,
} from "../../utils/authHelper";
import PageAnimate from "../../components/Animate/PageAnimate";
import logo from "../../assets/IndiaBills_logo.png";
import styles from "./OrganizationSetup.module.css";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiHome,
  FiMail,
  FiMap,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { getOption } from "../../utils/FormHelper";

const OrganizationSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [dropdownUp, setDropdownUp] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    about: "",
    tagline: "",
    domain: "",
    subdomain: "",
    logoUrl: "",
    phone: "",
    email: "",
    website: "",
    addressLine: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    brandPrimaryColor: "#1e2938",
    brandAccentColor: "#c42032",
  });

  const steps = [
    {
      label: "Basic Info",
      description: "Organization details",
      icon: FiHome,
    },
    {
      label: "Contact & Address",
      description: "Location details",
      icon: FiMail,
    },
    {
      label: "Branding & Domain",
      description: "Brand & identity",
      icon: FiSettings,
    },
  ];

  useEffect(() => {
    const tempSession = getTempSession();
    if (!tempSession) {
      errorPopup("Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate, errorPopup]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stateDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setStateDropdownOpen(false);
      }
    };

    if (stateDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [stateDropdownOpen]);

  useEffect(() => {
    if (stateDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 300;

      if (spaceBelow < menuHeight && rect.top > menuHeight) {
        setDropdownUp(true);
      } else {
        setDropdownUp(false);
      }
    }
  }, [stateDropdownOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleStateSelect = (state) => {
    setFormData((prev) => ({
      ...prev,
      state: state,
    }));
    setStateDropdownOpen(false);
    if (errors.state) {
      setErrors((prev) => ({
        ...prev,
        state: "",
      }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.name.trim()) {
        newErrors.name = "Organization name is required";
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
    }

    if (activeStep === 1) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }

    if (activeStep === 2) {
      if (!formData.domain.trim() && !formData.subdomain.trim()) {
        newErrors.domain = "Either domain or subdomain is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBackToLogin = () => {
    clearTempSession();
    navigate("/login");
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      errorPopup("Please fix the validation errors");
      return;
    }

    const validation = validateOrganizationData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      errorPopup("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      const tempSession = getTempSession();
      if (!tempSession?.token) {
        errorPopup("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await createFirstTimeOrganization(
        formData,
        tempSession.token
      );

      if (response.status === 200 || response.status === 201) {
        successPopup("Organization created successfully! Please login again.");
        clearTempSession();
        navigate("/login");
      } else {
        // Handle validation errors from backend
        if (response.data?.errors && Array.isArray(response.data.errors)) {
          const errorMessages = response.data.errors.join(" | ");
          errorPopup(errorMessages);
          // Also set field-level errors if applicable
          const fieldErrors = {};
          response.data.errors.forEach((error) => {
            if (error.includes("name")) fieldErrors.name = error;
            if (error.includes("domain")) fieldErrors.domain = error;
            if (error.includes("subdomain")) fieldErrors.domain = error;
            if (error.includes("email")) fieldErrors.email = error;
            if (error.includes("phone")) fieldErrors.phone = error;
            if (error.includes("website")) fieldErrors.website = error;
            if (error.includes("logoUrl")) fieldErrors.logoUrl = error;
            if (error.includes("pinCode")) fieldErrors.pinCode = error;
            if (error.includes("brandPrimaryColor"))
              fieldErrors.brandPrimaryColor = error;
            if (error.includes("brandAccentColor"))
              fieldErrors.brandAccentColor = error;
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        } else if (response.data?.message) {
          errorPopup(response.data.message);
        } else {
          errorPopup("Failed to create organization");
        }
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      errorPopup("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>
              <FiHome /> Basic Information
            </div>
            <p className={styles.stepDescription}>
              Tell us about your organization. This information helps us
              personalize your experience.
            </p>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Organization Name *</label>
                <div className={styles.inputWrapper}>
                  <FiHome className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Organization Name"
                    className={styles.input}
                  />
                </div>
                {errors.name && (
                  <span className={styles.helperText}>{errors.name}</span>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Business Name *</label>
                <div className={styles.inputWrapper}>
                  <FiHome className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Legal business name"
                    className={styles.input}
                  />
                </div>
                {errors.businessName && (
                  <span className={styles.helperText}>
                    {errors.businessName}
                  </span>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>About Your Business</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Briefly describe your organization..."
                  className={styles.textarea}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Your organization's motto"
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>
              <FiMail /> Contact & Address
            </div>
            <p className={styles.stepDescription}>
              Provide your contact information and business address so customers
              can reach you easily.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.fieldIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    className={styles.input}
                  />
                </div>
                {errors.email && (
                  <span className={styles.helperText}>{errors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number *</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.fieldIcon} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91-9876543210"
                    className={styles.input}
                  />
                </div>
                {errors.phone && (
                  <span className={styles.helperText}>{errors.phone}</span>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Website</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.fieldIcon} />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address Line</label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Street address, building, etc."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>City</label>
                <div className={styles.inputWrapper}>
                  <FiMap className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>State</label>
                <div className={styles.customDropdown} ref={dropdownRef}>
                  <FiMap className={styles.fieldIcon} />
                  <button
                    type="button"
                    className={`${styles.dropdownButton} ${
                      stateDropdownOpen ? styles.open : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStateDropdownOpen(!stateDropdownOpen);
                    }}
                  >
                    <span className={styles.dropdownText}>
                      {formData.state || "Select State"}
                    </span>
                    <FiChevronDown className={styles.dropdownIcon} />
                  </button>
                  {stateDropdownOpen && (
                    <div className={`${styles.dropdownMenu} ${dropdownUp ? styles.up : ''}`}>
                      <div
                        className={styles.dropdownOption}
                        onClick={() => handleStateSelect("")}
                      >
                        Select State
                      </div>
                      {getOption("state").map((state) => (
                        <div
                          key={state}
                          className={`${styles.dropdownOption} ${
                            formData.state === state ? styles.selected : ""
                          }`}
                          onClick={() => handleStateSelect(state)}
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>PIN Code</label>
                <div className={styles.inputWrapper}>
                  <FiMap className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                    className={styles.input}
                  />
                </div>
                {errors.pinCode && (
                  <span className={styles.helperText}>{errors.pinCode}</span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>
              <FiSettings /> Branding & Domain
            </div>
            <p className={styles.stepDescription}>
              Set up your brand identity and domain to represent your business
              uniquely.
            </p>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Logo URL</label>
                <div className={styles.inputWrapper}>
                  <FiSettings className={styles.fieldIcon} />
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className={styles.input}
                  />
                </div>
                {errors.logoUrl && (
                  <span className={styles.helperText}>{errors.logoUrl}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Domain</label>
                <div className={styles.inputWrapper}>
                  <FiSettings className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    placeholder="yourcompany.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subdomain</label>
                <div className={styles.inputWrapper}>
                  <FiSettings className={styles.fieldIcon} />
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="yourcompany"
                    className={styles.input}
                  />
                </div>
              </div>

              {errors.domain && (
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <span className={styles.helperText}>{errors.domain}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageAnimate>
      <div className={styles.container}>
        <div className={styles.backgroundGradient}></div>

        <div className={styles.contentWrapper}>
          {/* Header */}
          <div className={styles.header}>
            <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
            <h1 className={styles.title}>Set Up Your Organization</h1>
            <p className={styles.subtitle}>
              Complete setup to get started with IndiaBills
            </p>
          </div>

          {/* Main Card */}
          <div className={styles.mainCard}>
            {/* Stepper */}
            <div className={styles.stepperSection}>
              <div className={styles.stepperContainer}>
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;

                  return (
                    <div
                      key={index}
                      className={`${styles.step} ${
                        isActive ? styles.active : ""
                      } ${isCompleted ? styles.completed : ""}`}
                    >
                      <div className={styles.stepNumber}>
                        {isCompleted ? <FiCheckCircle size={20} /> : index + 1}
                      </div>
                      <div className={styles.stepLabel}>{step.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Action Buttons */}
            <div className={styles.buttonsContainer}>
              <div className={styles.primaryButtonRow}>
                {activeStep > 0 && (
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className={`${styles.button} ${styles.secondaryButton}`}
                  >
                    <FiArrowLeft size={18} />
                    Back
                  </button>
                )}

                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    Next
                    <FiArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    {loading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={18} />
                        Create Organization
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className={styles.secondaryButtonRow}>
                <button
                  onClick={handleBackToLogin}
                  disabled={loading}
                  className={`${styles.button} ${styles.backButton}`}
                >
                  <FiArrowLeft size={18} />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default OrganizationSetup;
