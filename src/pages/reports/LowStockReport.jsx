import ReportLayout from './ReportLayout';
import { getLowStockReportAPI } from '../../network/api';

const LowStockReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Current Stock', field: 'currentStock' },
    { headerName: 'Minimum Level', field: 'minimumLevel' },
    { headerName: 'Reorder Quantity', field: 'reorderQuantity' },
    { headerName: 'Warehouse', field: 'warehouse' },
    { headerName: 'Status', field: 'status' },
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
