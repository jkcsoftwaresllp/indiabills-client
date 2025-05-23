import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AdminCheck from "./templates/AdminCheckout";
import CustomerCheckout from "./templates/CustomerCheckout"; // Ensure this path is correct
import { getInvoiceCount } from "../../network/api";
import SpinnerFullPage from "../more/spinner";

const PlaceOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getInvoiceCount().then(() => {
      setLoading(false);
    });
  }, []);

  const renderContent = () => {
    switch (user?.role) {
      case "admin":
        return <AdminCheck />;
      case "operator":
        return <AdminCheck />;
      case "customer":
        return <CustomerCheckout />;
      default:
        return <p>Unauthorized</p>;
    }
  };

  if (loading) {return (
    <>
    </>
  )
} 
  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default PlaceOrder;
