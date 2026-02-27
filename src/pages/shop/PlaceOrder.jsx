
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import EcommerceCustomerCart from "../customer/EcommerceCustomerCart";
import SpinnerFullPage from "../more/spinner";

const PlaceOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

    if (loading || !user) return <SpinnerFullPage />;

  // if (user.role !== "customer") {
  //   return (
  //     <div className="p-4 text-center text-red-600 text-lg font-semibold">
  //       Access Denied: This page is only accessible to customers.
  //     </div>
  //   );
  // }

  return (
    <div>
      <EcommerceCustomerCart />
    </div>
  );
};

export default PlaceOrder;

