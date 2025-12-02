import ReportLayout from './ReportLayout';
import { getBatchExpiryReportAPI } from '../../network/api';

const BatchExpiryReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Batch Number', field: 'batch_number' },
    { headerName: 'Expiry Date', field: 'expiry_date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Warehouse Name', field: 'warehouse_name' },
    { headerName: 'Available Quantity', field: 'available_quantity' },
    { headerName: 'Days to Expiry', field: 'days_to_expiry' },
    { headerName: 'Expiry Status', field: 'expiry_status' },
    { headerName: 'Updated Date', field: 'updated_at', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
  ];

  return (
    <ReportLayout
      title="Batch Expiry Report"
      url="/reports/batch-expiry"
      columnDefs={columnDefs}
      fetchFunction={getBatchExpiryReportAPI}
    />
  );
};

export default BatchExpiryReport;
