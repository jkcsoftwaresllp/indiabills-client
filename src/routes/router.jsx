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
import OrganizationSetup from '../pages/organization/OrganizationSetup';

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
            <Route path="/*" element={<><AuthRoutes /></>} />
            
            {/* Setup Routes */}
            <Route path="/setup/*" element={<SetupRoutes />} />
            
            {/* Product Routes */}
            <Route path="/products/*" element={<ProductRoutes />} />
            
            {/* Customer Management Routes */}
            <Route path="/customers/*" element={<CustomerManagementRoutes />} />
            
            {/* Transport Routes */}
            <Route path="/transport/*" element={<TransportRoutes />} />
            
            {/* Offer Routes */}
            <Route path="/offers/*" element={<OfferRoutes />} />
            
            {/* User Routes */}
            <Route path="/users/*" element={<UserRoutes />} />
            
            {/* Organization Routes */}
            <Route path="/organization/*" element={<OrganizationRoutes />} />
            
            {/* Supplier Routes */}
            <Route path="/suppliers/*" element={<SupplierRoutes />} />
            
            {/* Inventory Routes */}
            <Route path="/inventory/*" element={<InventoryRoutes />} />
            
            {/* Invoice Routes */}
            <Route path="/invoices/*" element={<InvoiceRoutes />} />
            
            {/* Order Routes */}
            <Route path="/*" element={<OrderRoutes />} />
            
            {/* Report Routes */}
            <Route path="/reports/*" element={<ReportRoutes />} />

            <Route path="organization/setup" element={<OrganizationSetup />} />

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