import ReportLayout from './ReportLayout';
import { getSupplierPurchaseCostReport } from '../../network/api';

const SupplierCostReport = () => {
  const columnDefs = [
    { headerName: 'Supplier ID', field: 'supplier_id' },
    { headerName: 'Supplier Name', field: 'supplier_name', filter: true },
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name' },
    { headerName: 'UPC', field: 'upc' },
    { headerName: 'HSN', field: 'hsn' },
    { headerName: 'Total Purchased Qty', field: 'total_purchased_qty' },
    { headerName: 'Current Remaining Qty', field: 'current_remaining_qty' },
    { headerName: 'Avg Purchase Cost', field: 'avg_purchase_cost' },
    { headerName: 'Lowest Purchase Cost', field: 'lowest_purchase_cost' },
    { headerName: 'Highest Purchase Cost', field: 'highest_purchase_cost' },
    { headerName: 'Total Purchase Cost', field: 'total_purchase_cost' },
    { headerName: 'Batch Count', field: 'batch_count' },
    { headerName: 'Warehouse Name', field: 'warehouse_name' },
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
