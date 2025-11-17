import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const SubscriptionsPage = lazy(() => import('../pages/interfaces/AdminInterface/Subscriptions/SubscriptionsPage'));

const SubscriptionRoutes = () => {
  return [
    <Route
      key="subscriptions"
      path="/subscriptions"
      element={
        <ProtectedRoute element={SubscriptionsPage} roles={['admin']} />
      }
    />
  ];
};

export default SubscriptionRoutes;
