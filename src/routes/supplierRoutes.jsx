import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewSuppliers = lazy(() => import('../pages/supplier/ViewSupplier'));
const AddSuppliers = lazy(() => import('../pages/supplier/AddSupplier'));
const InspectSupplier = lazy(() => import('../pages/supplier/InspectSupplier'));

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute
            element={ViewSuppliers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="add"
        element={
          <ProtectedRoute
            element={AddSuppliers}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path=":supplierId"
        element={
          <ProtectedRoute
            element={InspectSupplier}
            roles={['admin', 'operators']}
          />
        }
      />
    </Routes>
  );
};

export default SupplierRoutes;