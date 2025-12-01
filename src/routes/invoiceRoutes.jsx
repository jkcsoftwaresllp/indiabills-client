import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const Invoices = lazy(() => import('../pages/invoices/InspectInvoice'));
const InvoicePage = lazy(() => import('../pages/invoices/OrderInvoice'));
const EditInvoice = lazy(() => import('../pages/invoices/EditInvoice'));

const InvoiceRoutes = () => {
  return [
    <Route
      key="invoices"
      path="/invoices"
      element={
        <ProtectedRoute
          element={Invoices}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />,
    <Route
      key="invoices-edit"
      path="/invoices/edit/:invoiceId"
      element={
        <ProtectedRoute
          element={EditInvoice}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />,
    <Route
      key="invoice"
      path="/invoice/:orderId"
      element={
        <ProtectedRoute
          element={InvoicePage}
          roles={['admin', 'operator', 'customer']}
        />
      }
    />
  ];
};

export default InvoiceRoutes;