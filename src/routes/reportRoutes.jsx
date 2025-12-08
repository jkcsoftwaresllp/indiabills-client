import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

// Lazy load all report components
const ViewReports = lazy(() => import('../pages/reports/ViewReports'));
const SalesSummaryReport = lazy(() => import('../pages/reports/SalesSummaryReport'));
const SalesByProductReport = lazy(() => import('../pages/reports/SalesByProductReport'));
const CustomerPurchaseReport = lazy(() => import('../pages/reports/CustomerPurchaseReport'));
const ProfitabilityReport = lazy(() => import('../pages/reports/ProfitabilityReport'));
const StockValuationReport = lazy(() => import('../pages/reports/StockValuationReport'));
const LowStockReport = lazy(() => import('../pages/reports/LowStockReport'));
const BatchExpiryReport = lazy(() => import('../pages/reports/BatchExpiryReport'));
const StockMovementAuditReport = lazy(() => import('../pages/reports/StockMovementAuditReport'));
const SupplierCostReport = lazy(() => import('../pages/reports/SupplierCostReport'));
// const DeliveryEfficiencyReport = lazy(() => import('../pages/reports/DeliveryEfficiencyReport'));
const PMSSalesReport = lazy(() => import('../pages/reports/PMSSalesReport'));
const RevenueReport = lazy(() => import('../pages/reports/RevenueReport'));
const GSTComplianceReport = lazy(() => import('../pages/reports/GSTComplianceReport'));
const HSNSummaryReport = lazy(() => import('../pages/reports/HSNSummaryReport'));
const StockSalesSummaryReport = lazy(() => import('../pages/reports/StockSalesSummaryReport'));
const InvoiceFinancialReport = lazy(() => import('../pages/reports/InvoiceFinancialReport'));

const ReportRoutes = () => {
  return [
    // Main Reports Page
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
    
    // Sales Summary Report
    <Route
      key="reports-sales-summary"
      path="/reports/sales-summary"
      element={
        <ProtectedRoute
          element={SalesSummaryReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Sales by Product Report
    <Route
      key="reports-sales-by-product"
      path="/reports/sales-by-product"
      element={
        <ProtectedRoute
          element={SalesByProductReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Customer Purchase Report
    <Route
      key="reports-customer-purchase"
      path="/reports/customer-purchase"
      element={
        <ProtectedRoute
          element={CustomerPurchaseReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Profitability Report
    <Route
      key="reports-profitability"
      path="/reports/profitability"
      element={
        <ProtectedRoute
          element={ProfitabilityReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Stock Valuation Report
    <Route
      key="reports-stock-valuation"
      path="/reports/stock-valuation"
      element={
        <ProtectedRoute
          element={StockValuationReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Low Stock Report
    <Route
      key="reports-low-stock"
      path="/reports/low-stock"
      element={
        <ProtectedRoute
          element={LowStockReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Batch Expiry Report
    <Route
      key="reports-batch-expiry"
      path="/reports/batch-expiry"
      element={
        <ProtectedRoute
          element={BatchExpiryReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Stock Movement Audit Report
    <Route
      key="reports-stock-movement-audit"
      path="/reports/stock-movement-audit"
      element={
        <ProtectedRoute
          element={StockMovementAuditReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Supplier Cost Report
    <Route
      key="reports-supplier-cost"
      path="/reports/supplier-cost"
      element={
        <ProtectedRoute
          element={SupplierCostReport}
          roles={['admin', 'reporter']}
        />
      }
    />,

    // Delivery Efficiency Report
    // <Route
    //   key="reports-delivery-efficiency"
    //   path="/reports/delivery-efficiency"
    //   element={
    //     <ProtectedRoute
    //       element={DeliveryEfficiencyReport}
    //       roles={['admin', 'reporter']}
    //     />
    //   }
    // />,
    
    // PMS Sales Report
    <Route
      key="reports-pms-sales"
      path="/reports/pms-sales"
      element={
        <ProtectedRoute
          element={PMSSalesReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Revenue Report
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
    
    // GST Compliance Report
    <Route
      key="reports-gst-compliance"
      path="/reports/gst-compliance"
      element={
        <ProtectedRoute
          element={GSTComplianceReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // HSN Summary Report
    <Route
      key="reports-hsn-summary"
      path="/reports/hsn-summary"
      element={
        <ProtectedRoute
          element={HSNSummaryReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Stock & Sales Summary Report
    <Route
      key="reports-stock-sales-summary"
      path="/reports/stock-sales-summary"
      element={
        <ProtectedRoute
          element={StockSalesSummaryReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
    
    // Invoice Financial Report
    <Route
      key="reports-invoice-financial"
      path="/reports/invoice-financial"
      element={
        <ProtectedRoute
          element={InvoiceFinancialReport}
          roles={['admin', 'reporter']}
        />
      }
    />,
  ];
};

export default ReportRoutes;
