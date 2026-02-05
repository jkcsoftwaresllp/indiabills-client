import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const BulkUpload = lazy(() => import('../pages/admin/BulkUpload'));

const AdminRoutes = () => {
  return [
    <Route
      key="bulk-upload"
      path="/bulk-upload"
      element={
        <ProtectedRoute
          element={BulkUpload}
          roles={['admin']}
        />
      }
    />,
  ];
};

export default AdminRoutes;
