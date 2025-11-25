import { useState, useEffect } from 'react';
import { FiGrid, FiBox, FiRefreshCw, FiBarChart2, FiSearch, FiList, FiTool, FiTag, FiUsers, FiCreditCard, FiTruck, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { getSession } from '../../utils/cacheHelper';
import { useStore } from '../../store/store';
import logo from '../../assets/IndiaBills_logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchLogo } from '../../network/api';
import { getBaseURL } from '../../network/api/api-config';
import { useAuth } from '../../hooks/useAuth';
import styles from '../default/Sidebar.module.css';

const operatorButtons = [
  {
    to: '/operator',
    icon: <FiGrid />,
    label: 'Dashboard',
  },
  {
    group: 'Operations',
    icon: <FiTool />,
    items: [
      {
        to: '/operator/inventory',
        icon: <FiBox />,
        label: 'Inventory',
      },
      {
        to: '/operator/inventory/movements',
        icon: <FiRefreshCw />,
        label: 'Stock Movements',
      },
      {
        to: '/operator/inventory/stock',
        icon: <FiBarChart2 />,
        label: 'Stock Levels',
      },
      {
        to: '/operator/inventory/reconciliations',
        icon: <FiSearch />,
        label: 'Reconciliations',
      },
      
      {
        to: '/operator/products',
        icon: <FiList />,
        label: 'Items',
      },
      {
        to: '/operator/suppliers',
        icon: <FiTool />,
        label: 'Suppliers',
      },
      {
        to: '/operator/offers',
        icon: <FiTag />,
        label: 'Offers',
      },
      {
        to: '/operator/customers',
        icon: <FiUsers />,
        label: 'Customers',
      },
      {
        to: '/operator/payments',
        icon: <FiCreditCard />,
        label: 'Payments',
      },
      {
        to: '/operator/transport',
        icon: <FiTruck />,
        label: 'Transport',
      },
    ],
  },
  {
    to: '/operator/help',
    icon: <FiHelpCircle />,
    label: 'Help',
  },
];

const OperatorSidebar = () => {
  const { collapse, setCollapse, Organization, setOrganization } = useStore();
  const session = getSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [selectedPath, setSelectedPath] = useState(null);
  const [logoFetched, setLogoFetched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

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

  // Keep group expanded if a sub-item within it is selected
  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedPath(currentPath);
    
    // Find which group the current path belongs to and keep it expanded
    operatorButtons.forEach((item) => {
      if (item.items && item.items.some((subItem) => subItem.to === currentPath)) {
        setExpandedGroup(item.group);
      }
    });
  }, [location.pathname]);

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
    window.location.href = '/login';
  };

  const handleViewOrganization = () => {
    navigate('/operator');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (!showUserMenu) {
      setExpandedGroup(null); // Close any open group when opening user menu
    }
  };

  const toggleGroup = (groupName) => {
    if (expandedGroup === groupName) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupName);
    }
    setShowUserMenu(false); // Close user menu when clicking on a group
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
        {operatorButtons.map((item) => {
          // Render independent items (Dashboard, Help)
          if (item.to && !item.group) {
            return (
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
            );
          }
          // Render grouped items (Operations)
          return (
            <div key={item.group} className={styles.group}>
              <button
                className={styles.groupTitle}
                onClick={() => toggleGroup(item.group)}
              >
                <span className={styles.groupIcon}>
                  {item.icon}
                </span>
                {item.group}
              </button>
              {expandedGroup === item.group && (
                <ul>
                  {item.items.map((button) => (
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
          );
        })}
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
              onClick={() => navigate('/operator/help')}
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
  );
};

export default OperatorSidebar;