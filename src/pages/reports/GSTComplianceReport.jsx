import ReportLayout from './ReportLayout';
import { getGSTComplianceReportAPI } from '../../network/api';

const GSTComplianceReport = () => {
  const columnDefs = [
    { headerName: 'Order Number', field: 'order_number' },
    { headerName: 'Order Date', field: 'order_date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'HSN Code', field: 'hsn_code' },
    { headerName: 'Taxable Value', field: 'taxable_value' },
    { headerName: 'CGST Amount', field: 'cgst_amount' },
    { headerName: 'SGST Amount', field: 'sgst_amount' },
    { headerName: 'CESS Amount', field: 'cess_amount' },
    { headerName: 'Total GST', field: 'total_gst' },
    { headerName: 'Invoice Total', field: 'invoice_total' },
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
