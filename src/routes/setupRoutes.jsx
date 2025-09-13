import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import StartSetup from '../pages/setup/Setup';
import SetupPage from '../pages/setup/SetupPage';
import OrganizationSetup from '../pages/organization/OrganizationSetup';

const SetupRoutes = () => {
  return [
    <Route key="setup" path="/setup" element={<StartSetup />} />,
    <Route 
      key="setup-page"
      path="/setup-page" 
      element={
        <ProtectedRoute
          element={SetupPage}
          roles={['admin']}
        />
      } 
    />,
    <Route key="organization-setup" path="/organization/setup" element={<OrganizationSetup />} />
  ];
};

export default SetupRoutes;