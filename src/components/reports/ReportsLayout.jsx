import { useLocation } from 'react-router-dom';
import ReportsNavbar from './ReportsNavbar';
import styles from './ReportsLayout.module.css';

const ReportsLayout = ({ children }) => {
  const location = useLocation();
  
  const isReportsPage = location.pathname.startsWith('/reports');
  
  if (!isReportsPage) {
    return children;
  }

  return (
    <div className={styles.reportsLayout}>
      <div className={styles.navbarWrapper}>
        <ReportsNavbar />
      </div>
      
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  );
};

export default ReportsLayout;