import { Outlet } from 'react-router-dom';
import OperatorSidebar from './OperatorSidebar';
import Popup from '../../components/core/Popup';
import styles from '../../App.module.css';
import { useStore } from '../../store/store';
import ReportsLayout from '../../components/reports/ReportsLayout';

const OperatorLayout = () => {
  const { collapse } = useStore();

  return (
    <div className={styles.appWrapper}>
      <div className={styles.layoutWrapper}>
        {/* Operator Sidebar */}
        <div
          className={`${styles.sidebarWrapper} ${
            collapse ? styles.collapsed : ''
          }`}
        >
          <OperatorSidebar />
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

export default OperatorLayout;