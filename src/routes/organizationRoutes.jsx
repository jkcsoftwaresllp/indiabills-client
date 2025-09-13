import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewOrganization = lazy(() => import('../pages/organization/ViewOrganization'));
const EditOrganization = lazy(() => import('../pages/organization/EditOrganization'));
const OrganizationChannel = lazy(() => import('../pages/organization/OrganizationChannel'));

const OrganizationRoutes = () => {
  return [
    <Route key="channel" path="/channel" element={<OrganizationChannel />} />,
    <Route
      key="organization"
      path="/organization"
      element={
        <ProtectedRoute element={ViewOrganization} roles={['admin']} />
      }
    />,
    <Route
      key="organization-edit"
      path="/organization/edit"
      element={
        <ProtectedRoute element={EditOrganization} roles={['admin']} />
      }
    />
  ];
};

export default OrganizationRoutes;