import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin } from '../../network/api';
import { useStore } from '../../store/store';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/IndiaBills_logo.png';
import bg from '../../assets/bglogo.png';
import styles from './Login.module.css';

const quotes = [
  'The best way to get started is to quit talking and begin doing.',
  'The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.',
  "Don't let yesterday take up too much of today.",
  "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
  "It's not whether you get knocked down, it's whether you get up.",
  'Welcome to your personal shopping experience.',
  'Discover amazing products tailored just for you.',
  'Your satisfaction is our priority.',
  'Shop with confidence and convenience.',
];

const LoginPage = () => {
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
      // Redirect based on existing session role
      if (session.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/');
      }
      return;
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
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

    // Check for hardcoded customer credentials first
    if (data.email === 'customer@example.com' && data.password === 'customer123') {
      const customerPayload = {
        id: 999,
        name: 'John Customer',
        role: 'customer',
        avatar: 'default.webp',
        token: 'hardcoded-customer-token',
      };

      login(customerPayload);
      successPopup('Welcome to your portal!');
      navigate('/customer');
      return;
    }
    try {
      const response = await apiLogin({
        email: data.email,
        password: data.password,
      });

      if (response.status !== 200) {
        switch (response.status) {
          case 404:
            errorPopup('User or password incorrect');
            return;
          case 500:
            errorPopup('Something went wrong');
            return;
          default:
            errorPopup('Login failed');
            return;
        }
      }

      const session = response.data;
      const payload = {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role.toLowerCase(),
        avatar: session.avatar,
        token: session.token,
      };

      login(payload);
      successPopup('Welcome back!');
      
      // Redirect based on user role
      if (payload.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/');
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
          <h2 className="text-white text-xl font-semibold mb-2">Login Portal</h2>
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
              placeholder="admin@example.com or customer@example.com"
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
                placeholder="admin123 or customer123"
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
            Don't have an account?{' '}
            <Link to="/register" className={styles.signupLink}>
              Sign up here
            </Link>
          </p>
          <div className="mt-2 text-xs text-gray-300">
            <p>Demo Credentials:</p>
            <p>Customer: customer@example.com / customer123</p>
            <p>Admin: Use your existing admin credentials</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
