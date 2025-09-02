import React, { useState, useEffect } from 'react';
import { getSession } from '../../utils/cacheHelper';
import { useStore } from '../../store/store';
import logo from '../../assets/IndiaBills_logo.png';
import { useNavigate } from 'react-router-dom';
import { fetchLogo } from '../../network/api';
import { getBaseURL } from '../../network/api/api-config';
import { useAuth } from '../../hooks/useAuth';
import styles from '../default/Sidebar.module.css';
import {
  FaHome,
  FaBox,
  FaExchangeAlt,
  FaChartBar,
  FaSearch,
  FaTag,
  FaIndustry,
  FaGift,
  FaUsers,
  FaTruck,
  FaQuestionCircle,
  FaTachometerAlt,
  FaCog,
  FaTools,
} from 'react-icons/fa';

const operatorButtons = [
  {
    group: 'Dashboard',
    icon: <FaTachometerAlt />,
    items: [
      {
        to: '/operator',
        icon: <FaHome />,
        label: 'Dashboard',
      },
    ],
  },
  {
    group: 'Operations',
    icon: <FaCog />,
    items: [
      {
        to: '/operator/inventory',
        icon: <FaBox />,
        label: 'Inventory',
      },
      {
        to: '/operator/inventory/movements',
        icon: <FaExchangeAlt />,
        label: 'Stock Movements',
      },
      {
        to: '/operator/inventory/stock',
        icon: <FaChartBar />,
        label: 'Stock Levels',
      },
      {
        to: '/operator/inventory/reconciliations',
        icon: <FaSearch />,
        label: 'Reconciliations',
      },
      {
        to: '/operator/products',
        icon: <FaTag />,
        label: 'Items',
      },
      {
        to: '/operator/suppliers',
        icon: <FaIndustry />,
        label: 'Suppliers',
      },
      {
        to: '/operator/offers',
        icon: <FaGift />,
        label: 'Offers',
      },
      {
        to: '/operator/customers',
        icon: <FaUsers />,
        label: 'Customers',
      },
      {
        to: '/operator/transport',
        icon: <FaTruck />,
        label: 'Transport',
      },
    ],
  },
  {
    group: 'Support',
    icon: <FaTools />,
    items: [
      {
        to: '/operator/help',
        icon: <FaQuestionCircle />,
        label: 'Help',
      },
    ],
  },
];

const OperatorSidebar = () => {
  const { collapse, setCollapse, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState('Dashboard');

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
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleViewOrganization = () => {
    navigate('/operator');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleGroup = (groupName) => {
    if (expandedGroup === groupName) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupName);
    }
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
        <h1 className={styles.orgName}>Operator Portal</h1>
      </div>

      <nav className={styles.nav}>
        {operatorButtons.map((group) => (
          <div key={group.group} className={styles.group}>
            <button
              className={styles.groupTitle}
              onClick={() => toggleGroup(group.group)}
            >
              <span className={styles.groupIcon}>{group.icon}</span>
              {group.group}
            </button>
            {expandedGroup === group.group && (
              <ul>
                {group.items.map((button) => (
                  <li key={button.label}>
                    <button
                      className={`${styles.navItem} ${
                        selectedPath === button.to ? styles.active : ''
                      }`}
                      onClick={() => handleItemClick(button.to)}
                    >
                      <span className={styles.icon}>{button.icon}</span>
                      {button.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
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
              onClick={() => navigate('/operator/help')}
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

export default OperatorSidebar;
