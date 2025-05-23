// InterfaceRouting.tsx
import Sidebar from "../layouts/default/Sidebar";
import Popup from "../components/core/Popup";
import AuditLogTable from "../pages/more/audit";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";

const InterfaceRouting = () => {
  // const { user } = useAuth();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!user) {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 5000);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user]);

  // if (loading) {
  //   return (
  //     <div className="w-full grid place-items-center">
  //       <CircularProgress />
  //     </div>
  //   );
  // }

  return ;
};

export default InterfaceRouting;