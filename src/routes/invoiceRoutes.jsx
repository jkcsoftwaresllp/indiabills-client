import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const Invoices = lazy(() => import('../pages/invoices/InspectInvoice'));
const EditInvoice = lazy(() => import('../pages/invoices/EditInvoice'));
const InvoicePage = lazy(() => import('../pages/invoices/OrderInvoice'));

const InvoiceRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute
            element={Invoices}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="edit/:invoiceId"
        element={
          <ProtectedRoute
            element={EditInvoice}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path=":orderId"
        element={
          <ProtectedRoute
            element={InvoicePage}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
    </Routes>
  );
};

export default InvoiceRoutes;