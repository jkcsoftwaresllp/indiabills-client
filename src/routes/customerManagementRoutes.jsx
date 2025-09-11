import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import EditCustomer from '../pages/customers/EditCustomer';
import AddCustomerAddress from '../pages/customers/AddCustomerAddress';
import EditCustomerAddress from '../pages/customers/EditCustomerAddress';

const CustomerList = lazy(() => import('../pages/customers/ViewCustomers'));
const AddCustomers = lazy(() => import('../pages/customers/AddCustomers'));
const InspectCustomer = lazy(() => import('../pages/customers/InspectCustomer'));

const CustomerManagementRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute
            element={CustomerList}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="add"
        element={
          <ProtectedRoute
            element={AddCustomers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="address/add/:customerId"
        element={
          <ProtectedRoute
            element={AddCustomerAddress}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path=":customerId"
        element={
          <ProtectedRoute
            element={InspectCustomer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="edit/:customerId"
        element={
          <ProtectedRoute
            element={EditCustomer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="address/:addressId"
        element={
          <ProtectedRoute
            element={EditCustomerAddress}
            roles={['admin', 'operators']}
          />
        }
      />
    </Routes>
  );
};

export default CustomerManagementRoutes;