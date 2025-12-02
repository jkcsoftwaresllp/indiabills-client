import ReportLayout from './ReportLayout';
import { getGSTComplianceReportAPI } from '../../network/api';

const GSTComplianceReport = () => {
  const columnDefs = [
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Date', field: 'date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Customer Name', field: 'customerName', filter: true },
    { headerName: 'GST Number', field: 'gstNumber' },
    { headerName: 'Taxable Amount', field: 'taxableAmount' },
    { headerName: 'GST Rate', field: 'gstRate' },
    { headerName: 'GST Amount', field: 'gstAmount' },
    { headerName: 'Total Amount', field: 'totalAmount' },
  ];

  return (
    <ReportLayout
      title="GST Compliance Report"
      url="/reports/gst-compliance"
      columnDefs={columnDefs}
      fetchFunction={getGSTComplianceReportAPI}
    />
  );
};

export default GSTComplianceReport;
