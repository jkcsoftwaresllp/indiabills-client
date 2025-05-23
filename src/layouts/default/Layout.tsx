// Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../../layouts/default/Header";
import Sidebar from "../../layouts/default/Sidebar";
import Popup from "../../components/core/Popup";
import AuditLogTable from "../../pages/audit/ViewAudit";

const Layout = () => {

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow pt-16">
        <Sidebar />
          <Outlet />
      </div>
      <Popup />
      <AuditLogTable />
    </div>
  );
};

export default Layout;