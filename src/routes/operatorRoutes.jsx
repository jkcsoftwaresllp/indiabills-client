import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import OperatorLayout from '../layouts/operator/OperatorLayout';
import SpinnerFullPage from '../pages/more/spinner';

// Operator Dashboard
const OperatorDashboard = lazy(() => import('../pages/operator/OperatorDashboard'));

// Reused components from existing pages
const ViewInventory = lazy(() => import('../pages/inventory/ViewInventory'));
const AddInventory = lazy(() => import('../pages/inventory/AddInventory'));
const EditInventory = lazy(() => import('../pages/inventory/EditInventory'));
const ViewInventoryMovements = lazy(() => import('../pages/inventory/ViewInventoryMovements'));
const ViewInventoryStock = lazy(() => import('../pages/inventory/ViewInventoryStock'));
const ViewReconciliations = lazy(() => import('../pages/inventory/ViewReconciliations'));
const AddReconciliation = lazy(() => import('../pages/inventory/AddReconciliation'));
const InspectReconciliation = lazy(() => import('../pages/inventory/InspectReconciliation'));

const ViewProducts = lazy(() => import('../pages/products/ViewProducts'));
const AddProducts = lazy(() => import('../pages/products/AddProducts'));
const InspectProduct = lazy(() => import('../pages/products/InspectProduct'));

const ViewSuppliers = lazy(() => import('../pages/supplier/ViewSupplier'));
const AddSuppliers = lazy(() => import('../pages/supplier/AddSupplier'));
const InspectSupplier = lazy(() => import('../pages/supplier/InspectSupplier'));

const ViewOffer = lazy(() => import('../pages/offers/ViewOffer'));
const AddOffer = lazy(() => import('../pages/offers/AddOffer'));
const InspectOffer = lazy(() => import('../pages/offers/InspectOffer'));

const ViewCustomers = lazy(() => import('../pages/customers/ViewCustomers'));
const AddCustomers = lazy(() => import('../pages/customers/AddCustomers'));
const InspectCustomer = lazy(() => import('../pages/customers/InspectCustomer'));
const EditCustomer = lazy(() => import('../pages/customers/EditCustomer'));
const AddCustomerAddress = lazy(() => import('../pages/customers/AddCustomerAddress'));
const EditCustomerAddress = lazy(() => import('../pages/customers/EditCustomerAddress'));

const ViewTransport = lazy(() => import('../pages/transport/ViewTransport'));
const AddTransport = lazy(() => import('../pages/transport/AddTransport'));
const InspectTransport = lazy(() => import('../pages/transport/InspectTransport'));

const OperatorRoutes = () => {
  return (
    <Suspense fallback={<SpinnerFullPage />}>
      <Routes>
        <Route path="/" element={<OperatorLayout />}>
          <Route index element={<OperatorDashboard />} />
          
          {/* Inventory Routes */}
          <Route path="inventory" element={<ViewInventory />} />
          <Route path="inventory/add" element={<AddInventory />} />
          <Route path="inventory/:batchId" element={<EditInventory />} />
          <Route path="inventory/movements" element={<ViewInventoryMovements />} />
          <Route path="inventory/stock" element={<ViewInventoryStock />} />
          <Route path="inventory/reconciliations" element={<ViewReconciliations />} />
          <Route path="inventory/reconciliations/add" element={<AddReconciliation />} />
          <Route path="inventory/reconciliations/:id" element={<InspectReconciliation />} />
          
          {/* Products Routes */}
          <Route path="products" element={<ViewProducts />} />
          <Route path="products/add" element={<AddProducts />} />
          <Route path="products/:itemId" element={<InspectProduct />} />
          
          {/* Suppliers Routes */}
          <Route path="suppliers" element={<ViewSuppliers />} />
          <Route path="suppliers/add" element={<AddSuppliers />} />
          <Route path="suppliers/:supplierId" element={<InspectSupplier />} />
          
          {/* Offers Routes */}
          <Route path="offers" element={<ViewOffer />} />
          <Route path="offers/add" element={<AddOffer />} />
          <Route path="offers/:offerId" element={<InspectOffer />} />
          
          {/* Customers Routes */}
          <Route path="customers" element={<ViewCustomers />} />
          <Route path="customers/add" element={<AddCustomers />} />
          <Route path="customers/:customerId" element={<InspectCustomer />} />
          <Route path="customers/edit/:customerId" element={<EditCustomer />} />
          <Route path="customers/address/add/:customerId" element={<AddCustomerAddress />} />
          <Route path="customers/address/:addressId" element={<EditCustomerAddress />} />
          
          {/* Transport Routes */}
          <Route path="transport" element={<ViewTransport />} />
          <Route path="transport/add" element={<AddTransport />} />
          <Route path="transport/:transportId" element={<InspectTransport />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default OperatorRoutes;