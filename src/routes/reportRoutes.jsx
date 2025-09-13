import { lazy } from 'react';
import { Route } from 'react-router-dom';
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

const ReportRoutes = () => {
  return [
    <Route
      key="reports"
      path="/reports"
      element={
        <ProtectedRoute
          element={ViewReports}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-stocklevel"
      path="/reports/stocklevel"
      element={
        <ProtectedRoute
          element={StockLevelReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-supplierperformance"
      path="/reports/supplierperformance"
      element={
        <ProtectedRoute
          element={SupplierPerformance}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-salessummary"
      path="/reports/salessummary"
      element={
        <ProtectedRoute
          element={SalesSummary}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-invoice"
      path="/reports/invoice"
      element={
        <ProtectedRoute
          element={Invoice}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-customerpurchase"
      path="/reports/customerpurchase"
      element={
        <ProtectedRoute
          element={CustomerPurchaseReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-credits"
      path="/reports/credits"
      element={
        <ProtectedRoute
          element={CreditReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-hsn"
      path="/reports/hsn"
      element={
        <ProtectedRoute
          element={HSNReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-stockissue"
      path="/reports/stockissue"
      element={
        <ProtectedRoute
          element={StockIssuesReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-expenses"
      path="/reports/expenses"
      element={
        <ProtectedRoute
          element={ExpenseReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-revenue"
      path="/reports/revenue"
      element={
        <ProtectedRoute
          element={RevenueReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    <Route
      key="reports-pms"
      path="/reports/pms"
      element={
        <ProtectedRoute
          element={PMSReport}
          roles={['admin', 'reporter']}
        />
      }
    />
  ];
};

export default ReportRoutes;