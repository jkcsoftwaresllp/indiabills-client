import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import { FiMenu } from 'react-icons/fi';
import CustomerSidebar from './CustomerSidebar';
import Popup from '../../components/core/Popup';
import styles from '../../App.module.css';
import { useStore } from '../../store/store';
import ReportsLayout from '../../components/reports/ReportsLayout';
import logo from '../../assets/IndiaBills_logo.png';
import { getBaseURL } from '../../network/api/api-config';

const CustomerLayout = () => {
  const { collapse, Organization } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={styles.appWrapper}>
      {/* Mobile Header with Menu Button */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0.75rem 1rem', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
        <IconButton 
          onClick={handleMobileMenuToggle}
          sx={{ color: '#ffffff', position: 'absolute', left: '1rem' }}
        >
          <FiMenu size={24} />
        </IconButton>
        <img 
          src={Organization.logo ? `${getBaseURL()}/${Organization.logo}` : logo}
          alt="Logo"
          style={{ height: '45px', objectFit: 'contain' }}
        />
      </Box>

      <div className={styles.layoutWrapper}>
        {/* Customer Sidebar */}
        <div
          className={`${styles.sidebarWrapper} ${
            collapse ? styles.collapsed : ''
          }`}
        >
          <CustomerSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        </div>

        {/* Scrollable Main Content */}
        <div className={styles.contentWrapper}>
          <main className={styles.mainContent}>
            <ReportsLayout>
              <Outlet />
            </ReportsLayout>
          </main>
          <Popup />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;