import { lazy, Suspense } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '../store/context';
import SpinnerFullPage from '../pages/more/spinner';

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
import ShopRoutes from './shopRoutes';
import ReportRoutes from './reportRoutes';
import AuditRoutes from './auditRoutes';
import CustomerRoutes from './customerRoutes';
import OperatorRoutes from './operatorRoutes';

// DASHBOARD
import Home from '../pages/interfaces/Home';

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
            
            {/* AUTH ROUTES */}
            {AuthRoutes()}
            
            {/* SETUP ROUTES */}
            {SetupRoutes()}
            
            {/* PRODUCT ROUTES */}
            {ProductRoutes()}
            
            {/* CUSTOMER MANAGEMENT ROUTES */}
            {CustomerManagementRoutes()}
            
            {/* TRANSPORT ROUTES */}
            {TransportRoutes()}
            
            {/* OFFER ROUTES */}
            {OfferRoutes()}
            
            {/* USER ROUTES */}
            {UserRoutes()}
            
            {/* ORGANIZATION ROUTES */}
            {OrganizationRoutes()}
            
            {/* SUPPLIER ROUTES */}
            {SupplierRoutes()}
            
            {/* INVENTORY ROUTES */}
            {InventoryRoutes()}
            
            {/* INVOICE ROUTES */}
            {InvoiceRoutes()}
            
            {/* ORDER ROUTES */}
            {OrderRoutes()}
            
            {/* SHOP ROUTES */}
            {ShopRoutes()}
            
            {/* REPORT ROUTES */}
            {ReportRoutes()}
            
            {/* AUDIT ROUTES */}
            {AuditRoutes()}

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
