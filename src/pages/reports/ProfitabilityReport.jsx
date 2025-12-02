import ReportLayout from './ReportLayout';
import { getProfitabilityReportAPI } from '../../network/api';

const ProfitabilityReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Total Sales', field: 'total_sales' },
    { headerName: 'Total Cost', field: 'total_cost' },
    { headerName: 'Total Profit', field: 'total_profit' },
    { headerName: 'Margin %', field: 'margin_percentage' },
  ];

  return (
    <ReportLayout
      title="Profitability Report"
      url="/reports/profitability"
      columnDefs={columnDefs}
      fetchFunction={getProfitabilityReportAPI}
    />
  );
};

export default ProfitabilityReport;
