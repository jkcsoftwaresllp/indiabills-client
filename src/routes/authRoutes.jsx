import { Route } from 'react-router-dom';
import LoginPage from '../pages/user/Login';
import Register from '../pages/user/Register';
import PublicRegister from '../pages/user/PublicRegister';
import OrganizationSelector from '../pages/user/OrganizationSelector';
import CreateOrganization from '../pages/organization/CreateOrganization';

const AuthRoutes = () => {
  return [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="register-domain" path="/register/:domain" element={<PublicRegister />} />,
  <Route key="organization-selector" path="/organization-selector" element={<OrganizationSelector />} />,
  <Route key="organization-create" path="/organization/create" element={<CreateOrganization />} />
];
};

export default AuthRoutes;