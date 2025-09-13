import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import InspectOrder from '../pages/orders/InspectOrder';

const ViewOrders = lazy(() => import('../pages/orders/ViewOrders'));

const OrderRoutes = () => {
  return [
    <Route
      key="orders"
      path="/orders"
      element={
        <ProtectedRoute
          element={ViewOrders}
          roles={['admin', 'operators', 'delivery']}
        />
      }
    />,
    <Route
      key="orders-inspect"
      path="/orders/:orderId"
      element={
        <ProtectedRoute
          element={InspectOrder}
          roles={['admin', 'operators', 'customer']}
        />
      }
    />
  ];
};

export default OrderRoutes;