import ReportLayout from './ReportLayout';
import { getProfitabilityReportAPI } from '../../network/api';

const ProfitabilityReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Total Cost', field: 'totalCost' },
    { headerName: 'Total Revenue', field: 'totalRevenue' },
    { headerName: 'Total Profit', field: 'totalProfit' },
    { headerName: 'Profit Margin %', field: 'profitMarginPercentage' },
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
