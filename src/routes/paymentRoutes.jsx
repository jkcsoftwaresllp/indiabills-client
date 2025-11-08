import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewPayments = lazy(() => import('../pages/payments/ViewPayments'));

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
    />
  ];
};

export default PaymentRoutes;
