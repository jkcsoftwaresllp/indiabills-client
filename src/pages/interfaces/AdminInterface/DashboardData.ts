// src/types/DashboardData.ts

export interface DashboardData {
  totalSale: number;
  totalProductsShipped: number;
  totalFulfilledShipped: number;
  totalActiveCustomers: number;
  totalInvoiceGenerated: number;

  productsExpiringSoon: Array<{
    batchId: string;
    batchNumber: string;
    itemName: string;
    quantity: number;
    expiryDate: string;
  }>;
  lowInventory: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    reorderLevel: number;
  }>;
  topCustomersByCredit: Array<{
    customerId: string;
    customerName: string;
    totalCredit: number;
  }>;
}

export interface FiscalData {
  totalSaleFiscalYear: number;
  totalPurchaseFiscalYear: number;
  totalExpenseFiscalYear: number;
}

export interface TopProductSale {
  itemId: number;
  itemName: string;
  totalSale: number;
}

export interface TopCustomerSale {
  customerId: number;
  customerName: string;
  totalSale: number;
}

export interface DashboardResponse {
  totalSale: string;
  totalProductsShipped: string;
  totalFulfilledShipped: number;
  totalActiveCustomers: number;
  totalInvoiceGenerated: number;
  totalSaleFiscalYear: string;
  totalPurchaseFiscalYear: string;
  totalExpenseFiscalYear: number;
  productsExpiringSoon: any[];
  lowInventory: any[];
  topCustomersBySale: TopCustomerSale[];
  topCustomersByCredit: any[];
  topProductsBySale: TopProductSale[];
}
