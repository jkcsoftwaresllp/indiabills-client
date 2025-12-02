import ReportLayout from './ReportLayout';
import { getHSNSummaryReportAPI } from '../../network/api';

const HSNSummaryReport = () => {
  const columnDefs = [
    { headerName: 'HSN Code', field: 'hsnCode' },
    { headerName: 'Description', field: 'description', filter: true },
    { headerName: 'Total Quantity', field: 'totalQuantity' },
    { headerName: 'Total Value', field: 'totalValue' },
    { headerName: 'Tax Rate', field: 'taxRate' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Number of Items', field: 'numberOfItems' },
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
