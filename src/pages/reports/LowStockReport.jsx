import ReportLayout from './ReportLayout';
import { getLowStockReportAPI } from '../../network/api';

const LowStockReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Available Quantity', field: 'available_quantity' },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Reorder Level', field: 'reorder_level' },
    { headerName: 'Warehouse Name', field: 'warehouse_name' },
    { headerName: 'Stock Status', field: 'stock_status' },
    { headerName: 'Updated At', field: 'updated_at', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
  ];

  return (
    <ReportLayout
      title="Low Stock Report"
      url="/reports/low-stock"
      columnDefs={columnDefs}
      fetchFunction={getLowStockReportAPI}
    />
  );
};

export default LowStockReport;
