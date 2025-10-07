import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import EditInventory from '../pages/inventory/EditInventory';

const ViewInventory = lazy(() => import('../pages/inventory/ViewInventory'));
const AddInventory = lazy(() => import('../pages/inventory/AddInventory'));
const ViewWarehouses = lazy(() => import('../pages/inventory/ViewWarehouses'));
const AddWarehouse = lazy(() => import('../pages/inventory/AddWarehouse'));
const InspectWarehouse = lazy(() => import('../pages/inventory/InspectWarehouse'));
const EditWarehouse = lazy(() => import('../pages/inventory/EditWarehouse'));
const ViewInventoryStock = lazy(() => import('../pages/inventory/ViewInventoryStock'));
const AddInventoryStock = lazy(() => import('../pages/inventory/AddInventoryStock'));
const ViewInventoryMovements = lazy(() => import('../pages/inventory/ViewInventoryMovements'));
const AddInventoryMovement = lazy(() => import('../pages/inventory/AddInventoryMovement'));

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
    />,
    <Route
      key="warehouses"
      path="/warehouses"
      element={
        <ProtectedRoute
          element={ViewWarehouses}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="warehouses-add"
      path="/warehouses/add"
      element={
        <ProtectedRoute
          element={AddWarehouse}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="warehouses-inspect"
      path="/warehouses/:id"
      element={
        <ProtectedRoute
          element={InspectWarehouse}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="warehouses-edit"
      path="/warehouses/:id/edit"
      element={
        <ProtectedRoute
          element={EditWarehouse}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-stock"
      path="/inventory-stock"
      element={
        <ProtectedRoute
          element={ViewInventoryStock}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-stock-add"
      path="/inventory-stock/add"
      element={
        <ProtectedRoute
          element={AddInventoryStock}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-movements"
      path="/inventory-movements"
      element={
        <ProtectedRoute
          element={ViewInventoryMovements}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="inventory-movements-add"
      path="/inventory-movements/add"
      element={
        <ProtectedRoute
          element={AddInventoryMovement}
          roles={['admin', 'operators']}
        />
      }
    />
  ];
};

export default InventoryRoutes;