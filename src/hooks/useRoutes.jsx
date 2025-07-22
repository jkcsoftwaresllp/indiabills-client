import { useLocation } from 'react-router-dom';

export const useRoutes = () => {
  const location = useLocation();
  const isCustomerPortal = location.pathname.startsWith('/customer');

  const getRoute = (route) => {
    if (isCustomerPortal) {
      return `/customer${route}`;
    }
    return route;
  };

  return { getRoute, isCustomerPortal };
};