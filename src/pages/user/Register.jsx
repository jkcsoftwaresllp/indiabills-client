import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../../store/store";
import { ownerSignup } from "../../network/api";
import logo from "../../assets/IndiaBills_logo.png";
import styles from "./Register.module.css";
import Popup from "../../components/core/Popup";
import { MdOutlineMail, MdOutlinePhone, MdVisibility, MdVisibilityOff, MdCheckCircle, MdLock, MdArrowBack, MdOutlinePerson } from "react-icons/md";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showrepassword, setShowrepassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
  });

  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Handle scroll indicator visibility
  useEffect(() => {
    const handleFormScroll = () => {
      if (formRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = formRef.current;
        // Show indicator if not at bottom (with 50px threshold for bottom detection)
        setShowScrollIndicator(scrollHeight - scrollTop - clientHeight > 50);
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('scroll', handleFormScroll);
      // Check initial state
      handleFormScroll();
      return () => form.removeEventListener('scroll', handleFormScroll);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglerepasswordVisibility = () => {
    setShowrepassword(!showrepassword);
  };

  const validateForm = () => {
    if (!data.firstName.trim()) {
      errorPopup("First name is required");
      return false;
    }
    if (!data.lastName.trim()) {
      errorPopup("Last name is required");
      return false;
    }
    if (!data.email.trim()) {
      errorPopup("Email is required");
      return false;
    }
    if (!data.password) {
      errorPopup("Password is required");
      return false;
    }
    if (data.password !== data.repassword) {
      errorPopup("Passwords do not match");
      return false;
    }
    if (!data.phone.trim()) {
      errorPopup("Phone number is required");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await ownerSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        repassword: data.repassword,
        phone: data.phone,
      });

      if (response.status === 201 || response.status === 200) {
        successPopup(
          response.data?.message || "Registration successful! Please login with your credentials."
        );
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const errorMessage = response.data?.message || response.data?.error || "Registration failed";
        switch (response.status) {
          case 400:
            errorPopup(errorMessage || "Invalid input. Please check your details.");
            break;
          case 409:
            errorPopup(errorMessage || "Email already registered. Please login or use a different email.");
            break;
          case 500:
            errorPopup("Server error. Please try again later.");
            break;
          default:
            errorPopup(errorMessage || "Registration failed. Please try again.");
            break;
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorPopup("Registration failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popup />
      <div className={styles.container}>
        <div className={styles.backgroundGradient}></div>

        <Link to="/login" className={styles.backButton}>
          <MdArrowBack />
          Back to Login
        </Link>

        <div className={styles.contentWrapper}>
          {/* Left Section - Features */}
          <div className={styles.featuresSection}>
            <div className={styles.featuresContent}>
              <img src={logo} alt="IndiaBills Logo" className={styles.featuringLogo} />
              <h1 className={styles.featuresTitle}>Join IndiaBills</h1>
              <p className={styles.featuresSubtitle}>Start managing your business today</p>
              <div className={styles.benefitsList}>
                <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <MdCheckCircle />
                    </div>
                    <div className={styles.benefitText}>
                      <h3>Smart Dashboard</h3>
                      <p>Real-time insights into your business</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <MdCheckCircle />
                    </div>
                    <div className={styles.benefitText}>
                      <h3>Secure & Trusted</h3>
                      <p>Bank-level security for your data</p>
                    </div>
                  </div>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <MdCheckCircle />
                    </div>
                    <div className={styles.benefitText}>
                      <h3>Fast & Easy</h3>
                      <p>Simple setup, powerful features</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Section - Registration Form */}
           <form onSubmit={handleRegister} className={styles.registerForm} ref={formRef}>
            <div className={styles.formHeader}>
              <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>Join thousands of businesses worldwide</p>
            </div>

            <div className={styles.formFields}>
              <div className={styles.nameRow}>
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                      First Name
                    </label>
                    <div className={styles.inputWrapper}>
                      <MdOutlinePerson className={styles.fieldIcon} />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        className={styles.input}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        value={data.firstName}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <MdOutlinePerson className={styles.fieldIcon} />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={styles.input}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      value={data.lastName}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <MdOutlineMail className={styles.fieldIcon} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    value={data.email}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number
                </label>
                <div className={styles.inputWrapper}>
                  <MdOutlinePhone className={styles.fieldIcon} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    value={data.phone}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <MdLock className={styles.fieldIcon} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    value={data.password}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                    disabled={loading}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="repassword" className={styles.label}>
                  Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                  <MdLock className={styles.fieldIcon} />
                  <input
                    id="repassword"
                    name="repassword"
                    type={showrepassword ? "text" : "password"}
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    value={data.repassword}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglerepasswordVisibility}
                    aria-label="Toggle confirm password visibility"
                    disabled={loading}
                  >
                    {showrepassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>
              </div>

            <button
              type="submit"
              className={`${styles.registerButton} ${loading ? styles.loading : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <Link to="/login" className={styles.loginLink}>
                Sign in here
              </Link>
            </p>

            {showScrollIndicator && (
              <div className={styles.scrollIndicator}>
                <span className={styles.scrollArrow}>⌄</span>
              </div>
            )}
            </form>
            </div>
            </div>
            </>
            );
            };

          export default Register;
