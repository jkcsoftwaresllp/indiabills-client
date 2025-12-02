import ReportLayout from './ReportLayout';
import { getSupplierPurchaseCostReport } from '../../network/api';

const SupplierCostReport = () => {
  const columnDefs = [
    { headerName: 'Supplier Name', field: 'supplierName', filter: true },
    { headerName: 'Total Purchase Amount', field: 'totalPurchaseAmount' },
    { headerName: 'Number of Orders', field: 'numberOfOrders' },
    { headerName: 'Average Order Value', field: 'averageOrderValue' },
    { headerName: 'Total Items Purchased', field: 'totalItemsPurchased' },
    { headerName: 'Last Purchase Date', field: 'lastPurchaseDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
  ];

  return (
    <ReportLayout
      title="Supplier Purchase Cost Report"
      url="/reports/supplier-cost"
      columnDefs={columnDefs}
      fetchFunction={getSupplierPurchaseCostReport}
    />
  );
};

export default SupplierCostReport;
