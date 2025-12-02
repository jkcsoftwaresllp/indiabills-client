import ReportLayout from './ReportLayout';
import { getBatchExpiryReportAPI } from '../../network/api';

const BatchExpiryReport = () => {
  const columnDefs = [
    { headerName: 'Batch ID', field: 'batchId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Batch Number', field: 'batchNumber' },
    { headerName: 'Expiry Date', field: 'expiryDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Days Until Expiry', field: 'daysUntilExpiry' },
    { headerName: 'Status', field: 'status' },
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
