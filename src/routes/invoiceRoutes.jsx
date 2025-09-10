import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const Invoices = lazy(() => import('../pages/invoices/InspectInvoice'));
const EditInvoice = lazy(() => import('../pages/invoices/EditInvoice'));
const InvoicePage = lazy(() => import('../pages/invoices/OrderInvoice'));

const InvoiceRoutes = () => {
  return (
    <>
      <Route
        path="/invoices"
        element={
          <ProtectedRoute
            element={Invoices}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="/invoices/edit/:invoiceId"
        element={
          <ProtectedRoute
            element={EditInvoice}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
      <Route
        path="/invoice/:orderId"
        element={
          <ProtectedRoute
            element={InvoicePage}
            roles={['admin', 'operators', 'customer']}
          />
        }
      />
    </>
  );
};

export default InvoiceRoutes;