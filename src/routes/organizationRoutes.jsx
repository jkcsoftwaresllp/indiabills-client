import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewOrganization = lazy(() => import('../pages/organization/ViewOrganization'));
const EditOrganization = lazy(() => import('../pages/organization/EditOrganization'));

const OrganizationRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute element={ViewOrganization} roles={['admin']} />
        }
      />
      <Route
        path="edit"
        element={
          <ProtectedRoute element={EditOrganization} roles={['admin']} />
        }
      />
    </Routes>
  );
};

export default OrganizationRoutes;