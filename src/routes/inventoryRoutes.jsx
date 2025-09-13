import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import EditInventory from '../pages/inventory/EditInventory';

const ViewInventory = lazy(() => import('../pages/inventory/ViewInventory'));
const AddInventory = lazy(() => import('../pages/inventory/AddInventory'));

const InventoryRoutes = () => {
  return [
    <Route
      key="inventory"
      path="/inventory"
      element={
        <ProtectedRoute
          element={ViewInventory}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-add"
      path="/inventory/add"
      element={
        <ProtectedRoute
          element={AddInventory}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-edit"
      path="/inventory/:batchId"
      element={
        <ProtectedRoute
          element={EditInventory}
          roles={['admin', 'operators']}
        />
      }
    />
  ];
};

export default InventoryRoutes;