import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/IndiaBills_logo.png';
import bg from '../../assets/bglogo.png';
import styles from '../user/Login.module.css';

const quotes = [
  'Welcome to your personal shopping experience.',
  'Discover amazing products tailored just for you.',
  'Your satisfaction is our priority.',
  'Shop with confidence and convenience.',
];

const CustomerLogin = () => {
  const [quote, setQuote] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('session')) {
      const session = JSON.parse(localStorage.getItem('session'));
      if (session.role === 'customer') {
        navigate('/customer');
        return;
      }
    }
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
      errorPopup("Don't leave the credentials empty!");
      return;
    }

    try {
      // Hardcoded customer for now - will be replaced with API call later
      if (data.email === 'customer@example.com' && data.password === 'customer123') {
        const payload = {
          id: 999,
          name: 'John Customer',
          role: 'customer',
          avatar: 'default.webp',
          token: 'hardcoded-customer-token',
        };

        login(payload);
        successPopup('Welcome to your portal!');
        navigate('/customer');
      } else {
        errorPopup('Invalid customer credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      errorPopup('Login failed. Please try again.');
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.header}>
          <img src={logo} alt="IndiaBills Logo" className={styles.logo} />
          <h2 className="text-white text-xl font-semibold mb-2">Customer Portal</h2>
          <p className={styles.quote}>{quote}</p>
        </div>

        <div className={styles.formFields}>
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
              placeholder="customer@example.com"
              value={data.email}
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
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                onChange={handleInputChange}
                placeholder="customer123"
                value={data.password}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.loginButton}>
          Login to Portal
        </button>

        <div className={styles.signupPrompt}>
          <p className={styles.signupText}>
            Need admin access?{' '}
            <Link to="/login" className={styles.signupLink}>
              Admin Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CustomerLogin;