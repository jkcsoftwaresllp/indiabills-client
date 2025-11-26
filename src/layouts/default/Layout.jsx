// Layout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../../layouts/default/Header";
import Sidebar from "../../layouts/default/Sidebar";
import Popup from "../../components/core/Popup";
// import AuditLogTable from "../../pages/audit/ViewAudit";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onMobileMenuToggle={handleMobileMenuToggle} />
      <div className="flex flex-grow pt-16">
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        <Outlet />
      </div>
      <Popup />
      {/* <AuditLogTable /> */}
      {/* TODO : Ask backend to implement the pending API */}
    </div>
  );
};

export default Layout;
