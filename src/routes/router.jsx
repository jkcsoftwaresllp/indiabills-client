import { lazy, Suspense } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../store/context';
import SpinnerFullPage from '../pages/more/spinner';

// Main Dashboard
import Home from '../pages/interfaces/Home';

// Route Components
import AuthRoutes from './authRoutes';
import SetupRoutes from './setupRoutes';
import ProductRoutes from './productRoutes';
import CustomerManagementRoutes from './customerManagementRoutes';
import TransportRoutes from './transportRoutes';
import OfferRoutes from './offerRoutes';
import UserRoutes from './userRoutes';
import OrganizationRoutes from './organizationRoutes';
import SupplierRoutes from './supplierRoutes';
import InventoryRoutes from './inventoryRoutes';
import InvoiceRoutes from './invoiceRoutes';
import OrderRoutes from './orderRoutes';
import ReportRoutes from './reportRoutes';
import CustomerRoutes from './customerRoutes';
import OperatorRoutes from './operatorRoutes';

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
            
            {/* Authentication Routes */}
            <AuthRoutes />
            
            {/* Setup Routes */}
            <SetupRoutes />
            
            {/* Product Routes */}
            <ProductRoutes />
            
            {/* Customer Management Routes */}
            <CustomerManagementRoutes />
            
            {/* Transport Routes */}
            <TransportRoutes />
            
            {/* Offer Routes */}
            <OfferRoutes />
            
            {/* User Routes */}
            <UserRoutes />
            
            {/* Organization Routes */}
            <OrganizationRoutes />
            
            {/* Supplier Routes */}
            <SupplierRoutes />
            
            {/* Inventory Routes */}
            <InventoryRoutes />
            
            {/* Invoice Routes */}
            <InvoiceRoutes />
            
            {/* Order Routes */}
            <OrderRoutes />
            
            {/* Report Routes */}
            <ReportRoutes />

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
