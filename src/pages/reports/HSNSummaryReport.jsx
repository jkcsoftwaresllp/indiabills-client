import ReportLayout from './ReportLayout';
import { getHSNSummaryReportAPI } from '../../network/api';

const HSNSummaryReport = () => {
  const columnDefs = [
    { headerName: 'HSN Code', field: 'hsn' },
    { headerName: 'Description', field: 'description', filter: true },
    { headerName: 'UPC', field: 'upc' },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Total Value', field: 'total_value' },
    { headerName: 'Total CGST', field: 'total_cgst' },
    { headerName: 'Total SGST', field: 'total_sgst' },
    { headerName: 'Total CESS', field: 'total_cess' },
    { headerName: 'Total Taxable Value', field: 'total_taxable_value' },
    { headerName: 'GST Rate %', field: 'rate' },
  ];

  return (
    <ReportLayout
      title="HSN Summary Report"
      url="/reports/hsn/summary"
      columnDefs={columnDefs}
      fetchFunction={getHSNSummaryReportAPI}
    />
  );
};

export default HSNSummaryReport;
