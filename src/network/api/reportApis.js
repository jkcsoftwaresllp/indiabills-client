import serverInstance from "./api-config";

// Sales Summary Report
export async function getSalesSummaryReport(params = {}) {
  try {
    const response = await serverInstance.get("/reports/sales-summary", { params });
    // Backend returns a single object in response.data.data, wrap in array for ReportLayout compatibility
    const data = response.data.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Failed to fetch sales summary report:", error.response);
    return [];
  }
}

// Sales by Product Report
export async function getSalesByProductReport(params = {}) {
  try {
    const response = await serverInstance.get("/reports/sales-by-product", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch sales by product report:", error.response);
    return [];
  }
}

// Customer Purchase Report
export async function getCustomerPurchaseReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/customer-purchase", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch customer purchase report:", error.response);
    return [];
  }
}

// Profitability Report
export async function getProfitabilityReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/profitability", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch profitability report:", error.response);
    return [];
  }
}

// Stock Valuation Report
export async function getCurrentStockValuationReport(params = {}) {
  try {
    const response = await serverInstance.get("/reports/stock-valuation", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch stock valuation report:", error.response);
    return [];
  }
}

// Low Stock Report
export async function getLowStockReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/low-stock", { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch low stock report:", error.message);
    return [];
  }
}

// Batch Expiry Report
export async function getBatchExpiryReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/batch-expiry", { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch batch expiry report:", error.message);
    return [];
  }
}

// Stock Movement Audit Report
export async function getStockMovementAuditReport(params = {}) {
  try {
    const response = await serverInstance.get("/reports/stock-movement-audit", { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch stock movement audit report:", error.message);
    return [];
  }
}

// Supplier Purchase Cost Report
export async function getSupplierPurchaseCostReport(params = {}) {
  try {
    const response = await serverInstance.get("/reports/supplier-cost", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch supplier purchase cost report:", error.response);
    return [];
  }
}

// Delivery Efficiency Report
// export async function getDeliveryEfficiencyReportAPI(params = {}) {
//   try {
//     const response = await serverInstance.get("/reports/delivery-efficiency", { params });
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch delivery efficiency report:", error.response);
//     return [];
//   }
// }

// PMS Sales Report
export async function getPmsSalesReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/sales/pms", { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch PMS sales report:", error.message);
    return [];
  }
}

// Revenue Report
export async function getRevenueReportAPI(params = {}) {
  try {
    const response = await serverInstance.get("/reports/revenue", { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch revenue report:", error.message);
    return [];
  }
}

// GST Compliance Report (POST)
export async function getGSTComplianceReportAPI(data = {}) {
  try {
    const response = await serverInstance.post("/reports/gst-compliance", data);
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch GST compliance report:", error.response);
    return [];
  }
}

// HSN Summary Report (POST)
export async function getHSNSummaryReportAPI(data = {}) {
  try {
    const response = await serverInstance.post("/reports/hsn/summary", data);
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch HSN summary report:", error.response);
    return [];
  }
}

// Stock and Sales Summary Report (POST with rate parameter)
export async function getStockAndSalesSummaryReport(rate, data = {}) {
  try {
    const response = await serverInstance.post(`/reports/stocks/rate/${rate}`, data);
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch stock and sales summary report:", error.message);
    return [];
  }
}

// Invoice Financial Report (POST)
export async function getAllInvoiceFinancialReportAPI(data = {}) {
  try {
    const response = await serverInstance.post("/reports/invoices/financial", data);
    return response.data.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to fetch invoice financial report:", error.message);
    return [];
  }
}
