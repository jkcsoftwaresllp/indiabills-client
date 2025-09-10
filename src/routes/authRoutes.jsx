import LoginPage from '../pages/user/Login';
import Register from '../pages/user/Register';
import OrganizationSelector from '../pages/user/OrganizationSelector';
import CreateOrganization from '../pages/organization/CreateOrganization';
import { Routes, Route } from 'react-router-dom';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<Register />} />
      <Route path="organization-selector" element={<OrganizationSelector />} />
      <Route path="organization/create" element={<CreateOrganization />} />
    </Routes>
  );
};

export default AuthRoutes;
