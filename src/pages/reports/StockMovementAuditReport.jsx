import ReportLayout from './ReportLayout';
import { getStockMovementAuditReport } from '../../network/api';

const StockMovementAuditReport = () => {
  const columnDefs = [
    { headerName: 'Movement ID', field: 'movement_id' },
    { headerName: 'Movement Date', field: 'movement_date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Movement Type', field: 'movement_type' },
    { headerName: 'Quantity Change', field: 'quantity_change' },
    { headerName: 'Reason', field: 'reason' },
    { headerName: 'Reference Doc', field: 'reference_doc' },
    { headerName: 'Created At', field: 'created_at', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Warehouse ID', field: 'warehouse_id' },
    { headerName: 'Warehouse Name', field: 'warehouse_name' },
    { headerName: 'Updated By', field: 'user_name' },
  ];

  return (
    <ReportLayout
      title="Stock Movement Audit Report"
      url="/reports/stock-movement-audit"
      columnDefs={columnDefs}
      fetchFunction={getStockMovementAuditReport}
    />
  );
};

export default StockMovementAuditReport;
