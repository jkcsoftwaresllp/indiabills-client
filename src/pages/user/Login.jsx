import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../network/api";
import { useStore } from "../../store/store";
import { useAuth } from "../../hooks/useAuth";
import { setSession, setTempSession, setOrganizationContext } from "../../utils/authHelper";
import logo from "../../assets/IndiaBills_logo.png";
import styles from "./Login.module.css";
import Popup from "../../components/core/Popup";

const quotes = [
  "The best way to get started is to quit talking and begin doing.",
  "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
  "Don't let yesterday take up too much of today.",
  "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
  "It's not whether you get knocked down, it's whether you get up.",
  "Welcome to your business management platform.",
  "Streamline your operations with IndiaBills.",
  "Your business success starts here.",
  "Efficient management, better results.",
];

const LoginPage = () => {
  const [quote, setQuote] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    const session = localStorage.getItem("session");
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.role === "customer") {
        navigate("/customer");
      } else if (sessionData.role === "operator") {
        navigate("/operator");
      } else {
        navigate("/");
      }
      return;
    }

    // Set random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [navigate]);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      errorPopup("Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response.status !== 200) {
        const errorMessage = response.data?.message || response.data?.error || "Login failed";
        switch (response.status) {
          case 400:
            errorPopup(errorMessage || "Invalid email or password");
            break;
          case 401:
            errorPopup(errorMessage || "Invalid email or password");
            break;
          case 403:
            errorPopup(errorMessage || "Your account has been blocked");
            break;
          case 404:
            errorPopup(errorMessage || "User not found");
            break;
          case 410:
            errorPopup(errorMessage || "User account has been deleted");
            break;
          case 500:
            errorPopup("Server error. Please try again later.");
            break;
          default:
            errorPopup(errorMessage || "Login failed. Please try again.");
            break;
        }
        return;
      }

      const { token, user, caseType, subscription } = response.data;

      // Store token for API requests
      localStorage.setItem('token', token);

      // Handle different organization cases
      switch (caseType) {
        case 'NO_ORG':
          // User has no organizations - redirect to setup
          setTempSession({ token, user, subscription });
          successPopup("Welcome! Let's set up your first organization.");
          navigate("/organization/setup");
          break;

        case 'SINGLE_ORG':
          // User has one organization - direct login
          const singleOrgSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.activeOrg.role.toLowerCase(),
            token: token,
            organizationId: user.activeOrg.orgId,
            orgs: user.orgs,
            subscription: subscription
          };
          
          setSession(singleOrgSession);
          setOrganizationContext({
            id: user.activeOrg?.orgId,
            name: user.orgs?.[0]?.name || 'Organization',
            role: user.activeOrg?.role?.toLowerCase() || 'customer',
            subscription: subscription
          });
          authLogin(singleOrgSession);
          successPopup(`Welcome back, ${user.name}!`);
          
          // Redirect based on role
          if (singleOrgSession.role === "customer") {
            navigate("/customer");
          } else if (singleOrgSession.role === "operator") {
            navigate("/operator");
          } else {
            navigate("/");
          }
          break;

        case 'MULTI_ORG':
          // User has multiple organizations - show selector
          setTempSession({ token, user, subscription });
          successPopup("Please select an organization to continue.");
          navigate("/organization-selector");
          break;

        default:
          errorPopup("Unexpected login response. Please try again.");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      errorPopup("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popup />
      <div className={styles.container}>
        <div className={styles.backgroundGradient}></div>
        
        <div className={styles.contentWrapper}>
          {/* Left Section - Branding */}
          <div className={styles.brandingSection}>
            <div className={styles.brandingContent}>
              <img src={logo} alt="IndiaBills Logo" className={styles.brandingLogo} />
              <h1 className={styles.brandTitle}>IndiaBills</h1>
              <p className={styles.brandSubtitle}>Business Management Platform</p>
              <div className={styles.featuresList}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Easy Invoicing</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Smart Analytics</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Secure & Reliable</span>
                </div>
              </div>
              <p className={styles.quoteText}>{quote}</p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formHeader}>
              <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Sign in to your account to continue</p>
            </div>

            <div className={styles.formFields}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    value={data.email}
                    required
                    disabled={loading}
                  />
                  <span className={styles.inputIcon}>✉</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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
                    {showPassword ? "👁" : "👁‍🗨"}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="remember"
                className={styles.checkbox}
                disabled={loading}
              />
              <label htmlFor="remember" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className={`${styles.loginButton} ${loading ? styles.loading : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className={styles.divider}>
              <span>Don't have an account?</span>
            </div>

            <Link to="/register" className={styles.signupButton}>
              Create New Account
            </Link>

            <p className={styles.footerText}>
              Need help? <Link to="#" className={styles.helpLink}>Contact support</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
