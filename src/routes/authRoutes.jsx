import { Route } from 'react-router-dom';
import LoginPage from '../pages/user/Login';
import Register from '../pages/user/Register';
import PublicRegister from '../pages/user/PublicRegister';
import OrganizationSelector from '../pages/user/OrganizationSelector';
import CreateOrganization from '../pages/organization/CreateOrganization';

const AuthRoutes = () => {
  return (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:domain" element={<PublicRegister />} />
      <Route path="/organization-selector" element={<OrganizationSelector />} />
      <Route path="/organization/create" element={<CreateOrganization />} />
    </>
  );
};

export default AuthRoutes;