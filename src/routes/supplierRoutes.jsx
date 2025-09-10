import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewSuppliers = lazy(() => import('../pages/supplier/ViewSupplier'));
const AddSuppliers = lazy(() => import('../pages/supplier/AddSupplier'));
const InspectSupplier = lazy(() => import('../pages/supplier/InspectSupplier'));

const SupplierRoutes = () => {
  return (
    <>
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute
            element={ViewSuppliers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/suppliers/add"
        element={
          <ProtectedRoute
            element={AddSuppliers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/suppliers/:supplierId"
        element={
          <ProtectedRoute
            element={InspectSupplier}
            roles={['admin', 'operators']}
          />
        }
      />
    </>
  );
};

export default SupplierRoutes;