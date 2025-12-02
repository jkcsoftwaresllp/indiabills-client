import ReportLayout from './ReportLayout';
import { getStockMovementAuditReport } from '../../network/api';

const StockMovementAuditReport = () => {
  const columnDefs = [
    { headerName: 'Date', field: 'date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Movement Type', field: 'movementType' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'From Warehouse', field: 'fromWarehouse' },
    { headerName: 'To Warehouse', field: 'toWarehouse' },
    { headerName: 'Reference', field: 'reference' },
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
