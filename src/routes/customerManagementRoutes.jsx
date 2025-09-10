import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import EditCustomer from '../pages/customers/EditCustomer';
import AddCustomerAddress from '../pages/customers/AddCustomerAddress';
import EditCustomerAddress from '../pages/customers/EditCustomerAddress';

const CustomerList = lazy(() => import('../pages/customers/ViewCustomers'));
const AddCustomers = lazy(() => import('../pages/customers/AddCustomers'));
const InspectCustomer = lazy(() => import('../pages/customers/InspectCustomer'));

const CustomerManagementRoutes = () => {
  return (
    <>
      <Route
        path="/customers"
        element={
          <ProtectedRoute
            element={CustomerList}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/customers/add"
        element={
          <ProtectedRoute
            element={AddCustomers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/customers/address/add/:customerId"
        element={
          <ProtectedRoute
            element={AddCustomerAddress}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/customers/:customerId"
        element={
          <ProtectedRoute
            element={InspectCustomer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/customers/edit/:customerId"
        element={
          <ProtectedRoute
            element={EditCustomer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/customers/address/:addressId"
        element={
          <ProtectedRoute
            element={EditCustomerAddress}
            roles={['admin', 'operators']}
          />
        }
      />
    </>
  );
};

export default CustomerManagementRoutes;