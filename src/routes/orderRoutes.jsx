import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import InspectOrder from '../pages/orders/InspectOrder';

const Shop = lazy(() => import('../pages/shop/Shop'));
const ViewOrders = lazy(() => import('../pages/orders/ViewOrders'));
const PlaceOrder = lazy(() => import('../pages/shop/PlaceOrder'));
const PaymentGateway = lazy(() => import('../pages/shop/PaymentGateway'));

const OrderRoutes = () => {
  return (
    <Routes>
      <Route
        path="shop"
        element={
          <ProtectedRoute
            element={Shop}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="orders"
        element={
          <ProtectedRoute
            element={ViewOrders}
            roles={['admin', 'operators', 'delivery']}
          />
        }
      />
      <Route
        path="orders/:orderId"
        element={
          <ProtectedRoute
            element={InspectOrder}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="cart"
        element={
          <ProtectedRoute
            element={PlaceOrder}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="shop/payment/:randomLink"
        element={
          <ProtectedRoute
            element={PaymentGateway}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
    </Routes>
  );
};

export default OrderRoutes;