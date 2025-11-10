import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../../store/store";
import { ownerSignup } from "../../network/api";
import logo from "../../assets/IndiaBills_logo.png";
import bg from "../../assets/bglogo.png";
import styles from "./Register.module.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showrepassword, setShowrepassword] = useState(false);
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

    try {
      const response = await ownerSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        repassword: data.repassword,
        phone: data.phone,
      });

      if (response.status === 200 || response.status === 201) {
        successPopup(
          "Registration successful! Please login with your credentials."
        );
        navigate("/login");
      } else {
        errorPopup("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorPopup(response.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <div className={styles.header}>
          <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
          <h2 className={styles.title}>Create Your Account</h2>
          <p className={styles.subtitle}>
            Join IndiaBills to manage your business efficiently
          </p>
        </div>

        <div className={styles.formFields}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={styles.input}
              onChange={handleInputChange}
              placeholder="John"
              value={data.firstName}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={styles.input}
              onChange={handleInputChange}
              placeholder="Doe"
              value={data.lastName}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              value={data.email}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              onChange={handleInputChange}
              placeholder="9129201920"
              value={data.phone}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                value={data.password}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="repassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                id="repassword"
                name="repassword"
                type={showrepassword ? "text" : "password"}
                className={styles.input}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                value={data.repassword}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglerepasswordVisibility}
                aria-label="Toggle confirm password visibility"
              >
                {showrepassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.registerButton}>
          Create Account
        </button>

        <div className={styles.loginPrompt}>
          <p className={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
