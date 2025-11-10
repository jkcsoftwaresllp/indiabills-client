import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import Popup from '../../components/core/Popup';
import styles from '../../App.module.css';
import { useStore } from '../../store/store';
import ReportsLayout from '../../components/reports/ReportsLayout';

const ManagerLayout = () => {
  const { collapse } = useStore();

  return (
    <div className={styles.appWrapper}>
      <div className={styles.layoutWrapper}>
        {/* Manager Sidebar */}
        <div
          className={`${styles.sidebarWrapper} ${
            collapse ? styles.collapsed : ''
          }`}
        >
          <ManagerSidebar />
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

export default ManagerLayout;
