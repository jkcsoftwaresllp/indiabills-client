import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import StartSetup from '../pages/setup/Setup';
import SetupPage from '../pages/setup/SetupPage';
import OrganizationChannel from '../pages/organization/OrganizationChannel';

const SetupRoutes = () => {
  return (
    <>
      <Route path="/setup" element={<StartSetup />} />
      <Route path="/channel" element={<OrganizationChannel />} />
      <Route
        path="/setup-page"
        element={<ProtectedRoute element={SetupPage} roles={['admin']} />}
      />
    </>
  );
};

export default SetupRoutes;