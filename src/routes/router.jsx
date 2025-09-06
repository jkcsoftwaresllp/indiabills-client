import { lazy, Suspense } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../store/context';
import ProtectedRoute from './protectedRoutes';
import SpinnerFullPage from '../pages/more/spinner';

// HOME
import LoginPage from '../pages/user/Login';
import Register from '../pages/user/Register';

// DASHBOARD
import Home from '../pages/interfaces/Home';

// SETUP
import StartSetup from '../pages/setup/Setup';
import SetupPage from '../pages/setup/SetupPage';
import SubscriptionPage from '../pages/subscription/SubscriptionPage';
import EditCustomer from '../pages/customers/EditCustomer';
import AddCustomerAddress from '../pages/customers/AddCustomerAddress';
import EditCustomerAddress from '../pages/customers/EditCustomerAddress';
import InspectOrder from '../pages/orders/InspectOrder';
import StockIssuesReport from '../pages/reports/StockIssueReport';
import EditInventory from '../pages/inventory/EditInventory';
import RevenueReport from '../pages/reports/RevenueReport';
import PMSReport from '../pages/reports/PMSReport';
import CustomerRoutes from './customerRoutes'
import OperatorRoutes from './operatorRoutes'

// SUPPORT
const Help = lazy(() => import('../pages/support/Help'));
const Settings = lazy(() => import('../pages/support/Settings/Settings'));
const OptionsEditor = lazy(() =>
  import('../pages/support/Settings/OptionsEditor')
);
const ContactUs = lazy(() => import('../pages/support/ContactUs'));

// PRODUCTS
const ProductList = lazy(() => import('../pages/products/ViewProducts'));
const AddProducts = lazy(() => import('../pages/products/AddProducts'));
const InspectProduct = lazy(() => import('../pages/products/InspectProduct'));

// TRANSPORT
const TransportList = lazy(() => import('../pages/transport/ViewTransport'));
const AddTransport = lazy(() => import('../pages/transport/AddTransport'));
const InspectTransport = lazy(() =>
  import('../pages/transport/InspectTransport')
);

// Customer
const CustomerList = lazy(() => import('../pages/customers/ViewCustomers'));
const AddCustomers = lazy(() => import('../pages/customers/AddCustomers'));
const InspectCustomer = lazy(() =>
  import('../pages/customers/InspectCustomer')
);

// SCHEMES
const OfferList = lazy(() => import('../pages/offers/ViewOffer'));
const AddOffer = lazy(() => import('../pages/offers/AddOffer'));
const InspectOffer = lazy(() => import('../pages/offers/InspectOffer'));

// USER
const ViewUsers = lazy(() => import('../pages/user/ViewUser'));
const AddUser = lazy(() => import('../pages/user/AddUser'));
const InspectUser = lazy(() => import('../pages/user/InspectUser'));

//SUPPLIERS
const ViewSuppliers = lazy(() => import('../pages/supplier/ViewSupplier'));
const AddSuppliers = lazy(() => import('../pages/supplier/AddSupplier'));
const InspectSupplier = lazy(() => import('../pages/supplier/InspectSupplier'));

//INVENTORY
const ViewInventory = lazy(() => import('../pages/inventory/ViewInventory'));
const AddInventory = lazy(() => import('../pages/inventory/AddInventory'));

// SHOP
const PaymentGateway = lazy(() => import('../pages/shop/PaymentGateway'));
const PlaceOrder = lazy(() => import('../pages/shop/PlaceOrder'));
const Shop = lazy(() => import('../pages/shop/Shop'));
const Invoices = lazy(() => import('../pages/invoices/InspectInvoice'));

// USER
const ViewOrganization = lazy(() =>
  import('../pages/organization/ViewOrganization')
);
const EditOrganization = lazy(() =>
  import('../pages/organization/EditOrganization')
);
const InvoicePage = lazy(() => import('../pages/invoices/OrderInvoice'));
const ViewOrders = lazy(() => import('../pages/orders/ViewOrders'));
const ViewReports = lazy(() => import('../pages/reports/ViewReports'));
const StockLevelReport = lazy(() =>
  import('../pages/reports/StockLevelReport')
);
const SupplierPerformance = lazy(() =>
  import('../pages/reports/SupplierPerformance')
);
const SalesSummary = lazy(() => import('../pages/reports/SalesSummary'));
const Invoice = lazy(() => import('../pages/reports/InvoiceReport'));
const CustomerPurchaseReport = lazy(() =>
  import('../pages/reports/CustomerPurchaseReport')
);
const CreditReport = lazy(() => import('../pages/reports/CreditReport'));
const HSNReport = lazy(() => import('../pages/reports/hsn'));
const ExpenseReport = lazy(() => import('../pages/reports/ExpenseReport'));
const AuditLogTable = lazy(() => import('../pages/audit/ViewAudit'));
const OrganizationChannel = lazy(() =>
  import('../pages/organization/OrganizationChannel')
);
const EditInvoice = lazy(() => import('../pages/invoices/EditInvoice'));

const Routing = () => {
  const location = useLocation();

  // @formatter:off
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes location={location} key={location.pathname}>
            {/* HOME */}
            <Route path="/" element={<Home />} />
            <Route path="/channel" element={<OrganizationChannel />} />

            {/* SETUP */}
            <Route path="/setup" element={<StartSetup />} />
            <Route
              path="/setup-page"
              element={
                <ProtectedRoute
                  element={SetupPage}
                  roles={['admin']}
                />
              }
            />
            {/* <Route
              path="/subscription"
              element={
                <ProtectedRoute
                  element={SubscriptionPage}
                  roles={['admin']}
                />
              }
            /> */}

            {/* SUPPORT */}
            {/* <Route
              path="/help"
              element={
                <ProtectedRoute element={Help} roles={['admin', 'support']} />
              }
            /> */}
            {/* <Route
              path="/settings"
              element={
                <ProtectedRoute
                  element={Settings}
                  roles={['admin', 'support']}
                />
              }
            /> */}
            {/* <Route
              path="/options"
              element={
                <ProtectedRoute
                  element={OptionsEditor}
                  roles={['admin', 'support']}
                />
              }
            /> */}
            {/* <Route
              path="/contact"
              element={
                <ProtectedRoute
                  element={ContactUs}
                  roles={['admin', 'support']}
                />
              }
            /> */}

            {/* PRODUCTS */}
            <Route
              path="/products"
              element={
                <ProtectedRoute
                  element={ProductList}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute
                  element={AddProducts}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/products/:itemId"
              element={
                <ProtectedRoute
                  element={InspectProduct}
                  roles={['admin', 'operators']}
                />
              }
            />

            {/* CUSTOMER */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute
                  element={CustomerList}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/customers/add"
              element={
                <ProtectedRoute
                  element={AddCustomers}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/customers/address/add/:customerId"
              element={
                <ProtectedRoute
                  element={AddCustomerAddress}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/customers/:customerId"
              element={
                <ProtectedRoute
                  element={InspectCustomer}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/customers/edit/:customerId"
              element={
                <ProtectedRoute
                  element={EditCustomer}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/customers/address/:addressId"
              element={
                <ProtectedRoute
                  element={EditCustomerAddress}
                  roles={['admin', 'operators']}
                />
              }
            />

            {/* TRANSPORT */}
            <Route
              path="/transport"
              element={
                <ProtectedRoute
                  element={TransportList}
                  roles={['admin', 'operators', 'delivery']}
                />
              }
            />
            <Route
              path="/transport/add"
              element={
                <ProtectedRoute
                  element={AddTransport}
                  roles={['admin', 'operators', 'delivery']}
                />
              }
            />
            <Route
              path="/transport/:transportId"
              element={
                <ProtectedRoute
                  element={InspectTransport}
                  roles={['admin', 'operators', 'Delivery']}
                />
              }
            />

            {/* OFFERS */}
            <Route
              path="/offers"
              element={
                <ProtectedRoute
                  element={OfferList}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/offers/add"
              element={
                <ProtectedRoute
                  element={AddOffer}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/offers/:offerId"
              element={
                <ProtectedRoute
                  element={InspectOffer}
                  roles={['admin', 'operators']}
                />
              }
            />

            {/* USER */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute element={ViewUsers} roles={['admin']} />
              }
            />
            <Route
              path="/users/add"
              element={<ProtectedRoute element={AddUser} roles={['admin']} />}
            />
            <Route
              path="/users/:userID"
              element={
                <ProtectedRoute element={InspectUser} roles={['admin']} />
              }
            />

            {/* Organization */}
            <Route
              path="/organization"
              element={
                <ProtectedRoute element={ViewOrganization} roles={['admin']} />
              }
            />
            <Route
              path="/organization/edit"
              element={
                <ProtectedRoute element={EditOrganization} roles={['admin']} />
              }
            />

            {/* SUPPLIERS */}
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute
                  element={ViewSuppliers}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/suppliers/add"
              element={
                <ProtectedRoute
                  element={AddSuppliers}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/suppliers/:supplierId"
              element={
                <ProtectedRoute
                  element={InspectSupplier}
                  roles={['admin', 'operators']}
                />
              }
            />

            {/* INVENTORY */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute
                  element={ViewInventory}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/inventory/add"
              element={
                <ProtectedRoute
                  element={AddInventory}
                  roles={['admin', 'operators']}
                />
              }
            />
            <Route
              path="/inventory/:batchId"
              element={
                <ProtectedRoute
                  element={EditInventory}
                  roles={['admin', 'operators']}
                />
              }
            />

            {/* INVOICES */}
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

            {/* ORDER */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute
                  element={Shop}
                  roles={['admin', 'operators', 'customer']}
                />
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute
                  element={ViewOrders}
                  roles={['admin', 'operators', 'delivery']}
                />
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute
                  element={InspectOrder}
                  roles={['admin', 'operators', 'customer']}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute
                  element={PlaceOrder}
                  roles={['admin', 'operators', 'customer']}
                />
              }
            />
            <Route
              path="/shop/payment/:randomLink"
              element={
                <ProtectedRoute
                  element={PaymentGateway}
                  roles={['admin', 'operators', 'customer']}
                />
              }
            />

            {/* Reports */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  element={ViewReports}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/stocklevel"
              element={
                <ProtectedRoute
                  element={StockLevelReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/supplierperformance"
              element={
                <ProtectedRoute
                  element={SupplierPerformance}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/salessummary"
              element={
                <ProtectedRoute
                  element={SalesSummary}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/invoice"
              element={
                <ProtectedRoute
                  element={Invoice}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/customerpurchase"
              element={
                <ProtectedRoute
                  element={CustomerPurchaseReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/credits"
              element={
                <ProtectedRoute
                  element={CreditReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/hsn"
              element={
                <ProtectedRoute
                  element={HSNReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/stockissue"
              element={
                <ProtectedRoute
                  element={StockIssuesReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/expenses"
              element={
                <ProtectedRoute
                  element={ExpenseReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/revenue"
              element={
                <ProtectedRoute
                  element={RevenueReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/reports/pms"
              element={
                <ProtectedRoute
                  element={PMSReport}
                  roles={['admin', 'reporter']}
                />
              }
            />
            <Route
              path="/audit/log"
              element={
                <ProtectedRoute
                  element={AuditLogTable}
                  roles={['admin', 'reporter']}
                />
              }
            />

            {/* CUSTOMER PORTAL */}
            <Route path="/customer/*" element={<CustomerRoutes />} />
            
            {/* OPERATOR PORTAL */}
            <Route path="/operator/*" element={<OperatorRoutes />} />
            
          </Routes>
        </Suspense>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default Routing;
