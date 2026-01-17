import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { registerCustomerByDomain, loginPublic } from "../../network/api/publicApi";
import { useStore } from "../../store/store";
import { setSession, setOrganizationContext } from "../../utils/authHelper";
import { useAuth } from "../../hooks/useAuth";
import { validatePassword } from "../../utils/authHelper";
import logo from "../../assets/IndiaBills_logo.png";
import styles from "./Register.module.css";
import {
  MdOutlineMail,
  MdOutlineLock,
  MdVisibility,
  MdVisibilityOff,
  MdOutlinePerson,
  MdOutlinePhone,
} from "react-icons/md";

const PublicRegister = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  const { login: authLogin } = useAuth();

  // Remove trailing slash if present (from splat route)
  const cleanDomain = domain?.replace(/\/$/, '') || '';

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const formRef = useRef(null);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
  });

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.role === "customer") {
        navigate("/customer");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(' ');
      }
    }

    if (data.password && data.password !== data.repassword) {
      newErrors.repassword = "Passwords do not match";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRepasswordVisibility = () => {
    setShowRepassword(!showRepassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      errorPopup("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      };

      const response = await registerCustomerByDomain(cleanDomain, registerData);

      if (response.status !== 201) {
        if (response.data?.data) {
          const fieldErrors = response.data.data;
          setErrors(fieldErrors);
          errorPopup(response.data?.message || "Registration failed");
        } else {
          errorPopup(response.data?.message || "Registration failed");
        }
        return;
      }

      successPopup("Account created successfully! Signing you in...");

      // Auto-login after registration
      const loginResponse = await loginPublic({
        email: data.email,
        password: data.password,
      });

      if (loginResponse.status === 200) {
        const { token, user, subscription, caseType } = loginResponse.data;
        localStorage.setItem("token", token);

        // Determine role from activeOrg if available, otherwise use 'customer'
        const userRole = user.activeOrg?.role?.toLowerCase() || "customer";

        const sessionData = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: userRole,
          token: token,
          organizationId: user.activeOrg?.orgId || response.data.data?.organization_id,
          orgs: user.orgs || [],
          subscription: subscription,
        };

        setSession(sessionData);
        setOrganizationContext({
          id: user.activeOrg?.orgId || response.data.data?.organization_id,
          name: cleanDomain,
          role: userRole,
          subscription: subscription,
        });

        authLogin(sessionData);
        navigate("/customer");
      } else {
        successPopup("Account created! Please login manually.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorPopup("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backgroundGradient}></div>

        <div className={styles.contentWrapper}>
          {/* Left Section - Features */}
          <div className={styles.featuresSection}>
            <div className={styles.featuresContent}>
              <img src={logo} alt="IndiaBills Logo" className={styles.featuringLogo} />
              <h1 className={styles.featuresTitle}>IndiaBills</h1>
              <p className={styles.featuresSubtitle}>Business Made Easy</p>

              <div className={styles.featuresList}>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>📦</div>
                  <div className={styles.benefitText}>
                    <h3>Complete Solutions</h3>
                    <p>All-in-one platform for your business needs</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>⚡</div>
                  <div className={styles.benefitText}>
                    <h3>Fast & Reliable</h3>
                    <p>Lightning-quick performance, always available</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>🔒</div>
                  <div className={styles.benefitText}>
                    <h3>Secure & Safe</h3>
                    <p>Enterprise-grade security for your data</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <div className={styles.benefitIcon}>📊</div>
                  <div className={styles.benefitText}>
                    <h3>Smart Analytics</h3>
                    <p>Real-time insights into your business</p>
                  </div>
                </div>
              </div>

              <p className={styles.quoteText}>
                "Transform the way you manage your business with IndiaBills - the ultimate solution for modern enterprises."
              </p>
            </div>
          </div>

          {/* Right Section - Registration Form */}
          <form onSubmit={handleRegister} className={styles.registerForm} ref={formRef}>
            <div className={styles.formHeader}>
              <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>Join {cleanDomain} and start shopping</p>
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
                      className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      value={data.firstName}
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
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
                      className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      value={data.lastName}
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
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
                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    value={data.email}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
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
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    value={data.phone}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <MdOutlineLock className={styles.fieldIcon} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`${styles.input} ${errors.password ? styles.error : ''}`}
                    onChange={handleInputChange}
                    placeholder="Enter your password (min 7 characters)"
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
                {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="repassword" className={styles.label}>
                  Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                  <MdOutlineLock className={styles.fieldIcon} />
                  <input
                    id="repassword"
                    name="repassword"
                    type={showRepassword ? "text" : "password"}
                    className={`${styles.input} ${errors.repassword ? styles.error : ''}`}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    value={data.repassword}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={toggleRepasswordVisibility}
                    aria-label="Toggle confirm password visibility"
                    disabled={loading}
                  >
                    {showRepassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {errors.repassword && <span className={styles.errorMessage}>{errors.repassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.registerButton} ${loading ? styles.loading : ""}`}
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

export default PublicRegister;
