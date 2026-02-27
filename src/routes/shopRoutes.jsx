import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const PaymentGateway = lazy(() => import('../pages/shop/PaymentGateway'));
const PlaceOrder = lazy(() => import('../pages/shop/PlaceOrder'));
const Shop = lazy(() => import('../pages/shop/Shop'));
const Checkout = lazy(() => import('../pages/shop/Checkout'));

const ShopRoutes = () => {
  return [
    <Route
      key="shop"
      path="/shop"
      element={
        <ProtectedRoute
          element={Shop}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />,
    <Route
      key="cart"
      path="/cart"
      element={
        <ProtectedRoute
          element={PlaceOrder}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />,
    <Route
      key="checkout"
      path="/checkout"
      element={
        <ProtectedRoute
          element={Checkout}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />,
    <Route
      key="payment"
      path="/shop/payment/:randomLink"
      element={
        <ProtectedRoute
          element={PaymentGateway}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />
  ];
};

export default ShopRoutes;