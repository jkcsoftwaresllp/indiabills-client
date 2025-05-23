// OrderContext.tsx
import React, { createContext, useState } from 'react';
import {
  Customer,
  CustomerAddress,
  Discount,
  Invoice,
  Item,
  Order,
  Payment,
} from '../../definitions/Types';

interface OrderContextType {
  // Define all state variables and setter functions here
  isNewCustomer: boolean;
  setIsNewCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  newCustomer: Partial<Customer>;
  setNewCustomer: React.Dispatch<React.SetStateAction<Partial<Customer>>>;
  // ... Add other state variables and setters
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Define your state variables
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    customerName: '',
    businessName: '',
    email: '',
    gender: '',
    mobile: '',
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