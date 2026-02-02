import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../layouts/customer/CustomerLayout';
import SpinnerFullPage from '../pages/more/spinner';
import EcommerceCustomerDashboard from '../pages/customer/EcommerceCustomerDashboard';
import EcommerceCustomerWishlist from '../pages/customer/EcommerceCustomerWishlist';
import EcommerceCustomerMyOrder from '../pages/customer/EcommerceCustomerMyOrder';
import EcommerceCustomerCart from '../pages/customer/EcommerceCustomerCart';
import EcommerceCustomerCheckout from '../pages/customer/EcommerceCustomerCheckout';
import EcommerceCustomerInvoice from '../pages/customer/EcommerceCustomerInvoice';
import InvoiceListPage from '../components/EcommerceInvoice/InvoiceListPage';

// Customer Pages
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const CustomerOrders = lazy(() => import('../pages/customer/CustomerOrders'));
const CustomerInvoices = lazy(() => import('../pages/customer/CustomerInvoices'));
const CustomerProfile = lazy(() => import('../pages/customer/CustomerProfile'));                              
const CustomerSupport = lazy(() => import('../pages/customer/CustomerSupport'));
const CustomerWishlist = lazy(() => import('../pages/customer/CustomerWishlist'));

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
          <Route index element={<EcommerceCustomerDashboard />} />
          <Route path="orders" element={<EcommerceCustomerMyOrder />} />
          <Route path="orders/:orderId" element={<InspectOrder />} />
          <Route path="invoices" element={<InvoiceListPage />} />
          <Route path="invoices/:id" element={<EcommerceCustomerInvoice />} />
          <Route path="wishlist" element={<EcommerceCustomerWishlist />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="cart" element={<EcommerceCustomerCart />} />
          <Route path="checkout" element={<EcommerceCustomerCheckout />} />
          <Route path="order-confirmation" element={<EcommerceCustomerMyOrder />} />
          <Route path="payment/:randomLink" element={<PaymentGateway />} />

          {/* ================= E-commerce Dashboard (Legacy Routes) ================ */}
          <Route path="ecommerce-dashboard/" element={<EcommerceCustomerDashboard />} />
          <Route path="ecommerce-dashboard/wishlist" element={<EcommerceCustomerWishlist />} />
          <Route path="ecommerce-dashboard/my-orders" element={<EcommerceCustomerMyOrder />} />
          <Route path="ecommerce-dashboard/cart" element={<EcommerceCustomerCart />} />
          <Route path="ecommerce-dashboard/orders-invoices" element={<InvoiceListPage />} />
          <Route path="ecommerce-dashboard/orders-invoices/:id" element={<EcommerceCustomerInvoice />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default CustomerRoutes;