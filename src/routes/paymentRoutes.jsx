import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewPayments = lazy(() => import('../pages/payments/ViewPayments'));
const PaymentDetails = lazy(() => import('../pages/payments/PaymentDetails'));

const PaymentRoutes = () => {
  return [
    <Route
      key="payments"
      path="/payments"
      element={
        <ProtectedRoute
          element={ViewPayments}
          roles={['admin', 'manager', 'operator']}
        />
      }
    />,
    <Route
      key="payment-details"
      path="/payments/:paymentId"
      element={
        <ProtectedRoute
          element={PaymentDetails}
          roles={['admin', 'manager', 'operator']}
        />
      }
    />
  ];
};

export default PaymentRoutes;
