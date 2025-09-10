import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import EditInventory from '../pages/inventory/EditInventory';

const ViewInventory = lazy(() => import('../pages/inventory/ViewInventory'));
const AddInventory = lazy(() => import('../pages/inventory/AddInventory'));

const InventoryRoutes = () => {
  return (
    <Routes>
      <Route
        path="inventory"
        element={
          <ProtectedRoute
            element={ViewInventory}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="inventory/add"
        element={
          <ProtectedRoute
            element={AddInventory}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="inventory/:batchId"
        element={
          <ProtectedRoute
            element={EditInventory}
            roles={['admin', 'operators']}
          />
        }
      />
    </Routes>
  );
};

export default InventoryRoutes;