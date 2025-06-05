// Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../../layouts/default/Header";
import Sidebar from "../../layouts/default/Sidebar";
import Popup from "../../components/core/Popup";
import AuditLogTable from "../../pages/audit/ViewAudit";
import styles from './styles/Layout.module.css';

const Layout = () => {

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <Outlet />
      </div>
      <Popup />
      <AuditLogTable />
    </div>
  );
};

export default Layout;