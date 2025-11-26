import { useState, useEffect } from 'react';
import { FiGrid, FiBox, FiFileText, FiShoppingCart, FiHeart, FiUser, FiHelpCircle, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import { getSession } from '../../utils/cacheHelper';
import { useStore } from '../../store/store';
import logo from '../../assets/IndiaBills_logo.png';
import { useNavigate } from 'react-router-dom';
import { fetchLogo } from '../../network/api';
import { getBaseURL } from '../../network/api/api-config';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery, useTheme } from "@mui/material";
import styles from '../default/Sidebar.module.css';

const customerButtons = [
  {
    to: '/customer',
    icon: <FiGrid />,
    label: 'Dashboard',
  },
  {
    to: '/customer/orders',
    icon: <FiBox />,
    label: 'My Orders',
  },
  {
    to: '/customer/invoices',
    icon: <FiFileText />,
    label: 'My Invoices',
  },
  {
    to: '/customer/cart',
    icon: <FiShoppingCart />,
    label: 'Shopping Cart',
  },
  {
    to: '/customer/wishlist',
    icon: <FiHeart />,
    label: 'Wishlist',
  },
  {
    to: '/customer/profile',
    icon: <FiUser />,
    label: 'Profile',
  },
  // {
  //   to: '/customer/support',
  //   icon: <FiHelpCircle />,
  //   label: 'Support',
  // },
];

const CustomerSidebar = ({ mobileOpen = false, setMobileOpen = () => {} }) => {
  const { collapse, setCollapse, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Mobile responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // sm is 600px
  
  // Close mobile menu when navigation happens
  useEffect(() => {
    if (mobileOpen && isMobile) {
      setMobileOpen(false);
    }
  }, [selectedPath, isMobile]);

  useEffect(() => {
    if (
      session !== null &&
      !logoFetched &&
      (!Organization.logo || Organization.logo === '')
    ) {
      // fetchLogo().then((res) => {
      //   setOrganization({ ...res, fiscalStart: res.fiscalStart?.split('T')[0] });
      //   setLogoFetched(true);
      // });
    }
  }, [session, Organization, setOrganization, logoFetched]);

  if (session === null) {
    return null;
  }

  const handleItemClick = (path) => {
    navigate(path);
    setSelectedPath(path);
    setShowUserMenu(false); // Close user menu when clicking on any item
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/customer/login';
  };

  const handleViewOrganization = () => {
    navigate('/customer');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.active : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      
      <div className={`${styles.sidebar} ${collapse ? styles.collapsed : ''} ${isMobile && mobileOpen ? styles.mobileOpen : ""}`}>
      <div className={styles.logoContainer}>
        {Organization.logo ? (
          <img
            src={`${getBaseURL()}/${Organization.logo}`}
            onClick={handleViewOrganization}
            alt="Logo"
            className={styles.logo}
          />
        ) : (
          <img
            src={logo}
            onClick={handleViewOrganization}
            alt="Logo"
            className={styles.logo}
          />
        )}
        <h1 className={styles.orgName}>Customer Portal</h1>
      </div>

      <nav className={styles.nav}>
        {customerButtons.map((item) => (
          <div key={item.label} className={styles.group}>
            <button
              className={`${styles.groupTitle} ${
                selectedPath === item.to ? styles.active : ''
              }`}
              onClick={() => handleItemClick(item.to)}
            >
              <span className={styles.groupIcon}>
                {item.icon}
              </span>
              {item.label}
            </button>
          </div>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo} onClick={toggleUserMenu}>
          {session.avatar ? (
            <img
              src={`${getBaseURL()}/${session.avatar}`}
              alt="User Avatar"
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={styles.avatarFallback}
            style={session.avatar ? { display: 'none' } : {}}
          >
            {session.name
              .split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{session.name}</p>
            <p className={styles.userRole}>{session.role}</p>
          </div>
        </div>

        {showUserMenu && (
          <div className={styles.userMenu}>
            <button
              className={styles.menuItem}
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw className={styles.menuIcon} />
              Refresh
            </button>
            <button
              className={styles.menuItem}
              onClick={() => navigate('/customer/support')}
            >
              <FiHelpCircle className={styles.menuIcon} />
              Get Help
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              <FiLogOut className={styles.menuIcon} />
              Logout
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default CustomerSidebar;