import ReportLayout from './ReportLayout';
import { getSupplierPurchaseCostReport } from '../../network/api';

const SupplierCostReport = () => {
  const columnDefs = [
    { headerName: 'Supplier ID', field: 'supplier_id' },
    { headerName: 'Supplier Name', field: 'supplier_name', filter: true },
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name' },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Avg Unit Cost', field: 'avg_unit_cost' },
    { headerName: 'Total Cost', field: 'total_cost' },
    { headerName: 'Lowest Cost', field: 'lowest_cost' },
    { headerName: 'Highest Cost', field: 'highest_cost' },
    { headerName: 'Purchase Count', field: 'purchase_count' },
    { headerName: 'Last Purchase Date', field: 'last_purchase_date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
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
