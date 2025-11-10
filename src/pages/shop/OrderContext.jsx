// OrderContext.jsx
import { createContext, useState } from "react";

export const OrderContext = createContext(undefined);

export const OrderProvider = ({ children }) => {
  // Define your state variables
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    businessName: "",
    email: "",
    gender: "",
    mobile: "",
  });
  // ... Initialize other state variables

  return (
    <OrderContext.Provider
      value={{
        isNewCustomer,
        setIsNewCustomer,
        newCustomer,
        setNewCustomer,
        // ... Include other state variables and setters
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
