import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../layouts/customer/CustomerLayout';
import SpinnerFullPage from '../pages/more/spinner';

// Customer Pages
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const CustomerOrders = lazy(() => import('../pages/customer/CustomerOrders'));
const CustomerInvoices = lazy(() => import('../pages/customer/CustomerInvoices'));

// Reused components
const InspectOrder = lazy(() => import('../pages/orders/InspectOrder'));
const OrderInvoice = lazy(() => import('../pages/invoices/OrderInvoice'));
const PlaceOrder = lazy(() => import('../pages/shop/PlaceOrder'));
const PaymentGateway = lazy(() => import('../pages/shop/PaymentGateway'));

const CustomerRoutes = () => {
  return (
    <Suspense fallback={<SpinnerFullPage />}>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="orders/:orderId" element={<InspectOrder />} />
          <Route path="invoices" element={<CustomerInvoices />} />
          <Route path="invoice/:orderId" element={<OrderInvoice />} />
          <Route path="cart" element={<PlaceOrder />} />
          <Route path="payment/:randomLink" element={<PaymentGateway />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default CustomerRoutes;