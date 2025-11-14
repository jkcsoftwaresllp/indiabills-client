// import { useEffect, useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import AdminCheck from "./templates/AdminCheckout";
// import CustomerCheckout from "./templates/CustomerCheckout"; // Ensure this path is correct
// import { getInvoiceCount } from "../../network/api";
// import SpinnerFullPage from "../more/spinner";

// const PlaceOrder = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   getInvoiceCount().then(() => {
//   //     setLoading(false);
//   //   });
//   // }, []);

//   const renderContent = () => {
//     console.log("AAAAAAAAAAAAAA User role:", user?.role);
//     switch (user?.role) {
//       case "admin":
//         return <AdminCheck />;
//       case "operator":
//         return <AdminCheck />;
//       case "customer":
//         return <CustomerCheckout />;
//       default:
//         return <p>Unauthorized</p>;
//     }
//   };

//   if (loading) {return (
//     <>
//     </>
//   )
// } 
//   return (
//     <div>
//       {renderContent()}
//     </div>
//   );
// };

// export default PlaceOrder;





import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfessionalCheckout from "./templates/ProfessionalCheckout";
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

  if (user.role !== "customer") {
    return (
      <div className="p-4 text-center text-red-600 text-lg font-semibold">
        Access Denied: This page is only accessible to customers.
      </div>
    );
  }

  return (
    <div>
      <ProfessionalCheckout />
    </div>
  );
};

export default PlaceOrder;

