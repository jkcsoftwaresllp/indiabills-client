import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import StockIssuesReport from '../pages/reports/StockIssueReport';
import RevenueReport from '../pages/reports/RevenueReport';
import PMSReport from '../pages/reports/PMSReport';

const ViewReports = lazy(() => import('../pages/reports/ViewReports'));
const StockLevelReport = lazy(() => import('../pages/reports/StockLevelReport'));
const SupplierPerformance = lazy(() => import('../pages/reports/SupplierPerformance'));
const SalesSummary = lazy(() => import('../pages/reports/SalesSummary'));
const Invoice = lazy(() => import('../pages/reports/InvoiceReport'));
const CustomerPurchaseReport = lazy(() => import('../pages/reports/CustomerPurchaseReport'));
const CreditReport = lazy(() => import('../pages/reports/CreditReport'));
const HSNReport = lazy(() => import('../pages/reports/hsn'));
const ExpenseReport = lazy(() => import('../pages/reports/ExpenseReport'));
const AuditLogTable = lazy(() => import('../pages/audit/ViewAudit'));

const ReportRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute
            element={ViewReports}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="stocklevel"
        element={
          <ProtectedRoute
            element={StockLevelReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="supplierperformance"
        element={
          <ProtectedRoute
            element={SupplierPerformance}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="salessummary"
        element={
          <ProtectedRoute
            element={SalesSummary}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="invoice"
        element={
          <ProtectedRoute
            element={Invoice}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="customerpurchase"
        element={
          <ProtectedRoute
            element={CustomerPurchaseReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="credits"
        element={
          <ProtectedRoute
            element={CreditReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="hsn"
        element={
          <ProtectedRoute
            element={HSNReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="stockissue"
        element={
          <ProtectedRoute
            element={StockIssuesReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="expenses"
        element={
          <ProtectedRoute
            element={ExpenseReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="revenue"
        element={
          <ProtectedRoute
            element={RevenueReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="pms"
        element={
          <ProtectedRoute
            element={PMSReport}
            roles={['admin', 'reporter']}
          />
        }
      />
      <Route
        path="audit/log"
        element={
          <ProtectedRoute
            element={AuditLogTable}
            roles={['admin', 'reporter']}
          />
        }
      />
    </Routes>
  );
};

export default ReportRoutes;