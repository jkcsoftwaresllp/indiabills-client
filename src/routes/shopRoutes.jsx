import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const PaymentGateway = lazy(() => import('../pages/shop/PaymentGateway'));
const PlaceOrder = lazy(() => import('../pages/shop/PlaceOrder'));
const Shop = lazy(() => import('../pages/shop/Shop'));

const ShopRoutes = () => {
  return [
    <Route
      key="shop"
      path="/shop"
      element={
        <ProtectedRoute
          element={Shop}
          roles={['admin', 'operators', 'customer']}
        />
      }
    />,
    <Route
      key="cart"
      path="/cart"
      element={
        <ProtectedRoute
          element={PlaceOrder}
          roles={['admin', 'operators', 'customer']}
        />
      }
    />,
    <Route
      key="payment"
      path="/shop/payment/:randomLink"
      element={
        <ProtectedRoute
          element={PaymentGateway}
          roles={['admin', 'operators', 'customer']}
        />
      }
    />
  ];
};

export default ShopRoutes;