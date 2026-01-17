import { Route } from 'react-router-dom';
import PublicShop from '../pages/shop/PublicShop';
import PublicRegister from '../pages/user/PublicRegister';

const PublicRoutes = () => {
  console.log('PublicRoutes function called, returning routes');
  const routes = [
    <Route key="public-register" path="/register/:domain" element={<PublicRegister />} />,
    <Route key="public-shop" path="/:domain" element={<PublicShop />} />,
  ];
  console.log('PublicRoutes returning:', routes);
  return routes;
};

export default PublicRoutes;
