import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewSuppliers = lazy(() => import('../pages/supplier/ViewSupplier'));
const AddSuppliers = lazy(() => import('../pages/supplier/AddSupplier'));
const InspectSupplier = lazy(() => import('../pages/supplier/InspectSupplier'));
const EditSupplier = lazy(() => import('../pages/supplier/EditSupplier'));

const SupplierRoutes = () => {
  return [
    <Route
      key="suppliers"
      path="/suppliers"
      element={
        <ProtectedRoute
          element={ViewSuppliers}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="suppliers-add"
      path="/suppliers/add"
      element={
        <ProtectedRoute
          element={AddSuppliers}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="suppliers-inspect"
      path="/suppliers/:supplierId"
      element={
        <ProtectedRoute
          element={InspectSupplier}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="suppliers-edit"
      path="/suppliers/:supplierId/edit"
      element={
        <ProtectedRoute
          element={EditSupplier}
          roles={['admin', 'operator']}
        />
      }
    />
  ];
};

export default SupplierRoutes;