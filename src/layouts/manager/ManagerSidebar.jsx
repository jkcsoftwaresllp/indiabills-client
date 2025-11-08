import React, { useState, useEffect } from 'react';
import { getSession } from '../../utils/cacheHelper';
import { useStore } from '../../store/store';
import logo from '../../assets/IndiaBills_logo.png';
import { useNavigate } from 'react-router-dom';
import { fetchLogo } from '../../network/api';
import { getBaseURL } from '../../network/api/api-config';
import { useAuth } from '../../hooks/useAuth';
import styles from '../default/Sidebar.module.css';

const managerMenuItems = [
  {
    to: '/manager',
    icon: '🏠',
    label: 'Dashboard',
  },
  {
    to: '/manager/customers',
    icon: '👥',
    label: 'Customers',
  },
  {
    to: '/manager/payments',
    icon: '💳',
    label: 'Payments',
  },
  {
    to: '/manager/inventory',
    icon: '📦',
    label: 'Inventory',
  },
  {
    to: '/manager/products',
    icon: '🏷️',
    label: 'Products',
  },
  {
    to: '/manager/suppliers',
    icon: '🏭',
    label: 'Suppliers',
  },
  {
    to: '/manager/offers',
    icon: '🎁',
    label: 'Offers',
  },
  {
    to: '/manager/inventory/movements',
    icon: '🔄',
    label: 'Stock Movements',
  },
  {
    to: '/manager/inventory/stock',
    icon: '📊',
    label: 'Stock Levels',
  },
  {
    to: '/manager/inventory/reconciliations',
    icon: '🔍',
    label: 'Reconciliations',
  },
  {
    to: '/manager/warehouses',
    icon: '🏢',
    label: 'Warehouses',
  },
  {
    to: '/manager/transport',
    icon: '🚛',
    label: 'Transport',
  },
  {
    to: '/manager/help',
    icon: '❓',
    label: 'Help',
  },
];

const ManagerSidebar = () => {
  const { collapse, setCollapse, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    return <div>No session</div>;
  }

  const handleItemClick = (path) => {
    navigate(path);
    setSelectedPath(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleViewOrganization = () => {
    navigate('/manager');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className={`${styles.sidebar} ${collapse ? styles.collapsed : ''}`}>
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
        <h1 className={styles.orgName}>Manager Portal</h1>
      </div>

      <nav className={styles.nav}>
        <ul>
          {managerMenuItems.map((item) => (
            <li key={item.label}>
              <button
                className={`${styles.navItem} ${
                  selectedPath === item.to ? styles.active : ''
                }`}
                onClick={() => handleItemClick(item.to)}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo} onClick={toggleUserMenu}>
          <img
            src={`${getBaseURL()}/${session.avatar}`}
            alt="User Avatar"
            className={styles.avatar}
          />
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
              Refresh
            </button>
            <button
              className={styles.menuItem}
              onClick={() => navigate('/manager/help')}
            >
              Get Help
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerSidebar;
