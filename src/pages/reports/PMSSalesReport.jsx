import ReportLayout from './ReportLayout';
import { getPmsSalesReportAPI } from '../../network/api';

const PMSSalesReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Qty Sold', field: 'qtySold' },
    { headerName: 'Gross Sales', field: 'grossSales' },
    { headerName: 'Discount', field: 'discount' },
    { headerName: 'Net Sales', field: 'netSales' },
    { headerName: 'Cost Value', field: 'costValue' },
    { headerName: 'Tax Value', field: 'taxValue' },
    { headerName: 'Gross Profit', field: 'grossProfit' },
    { headerName: 'Profit %', field: 'profitPercentage' },
  ];

  return (
    <ReportLayout
      title="PMS Sales Report"
      url="/reports/sales/pms"
      columnDefs={columnDefs}
      fetchFunction={getPmsSalesReportAPI}
    />
  );
};

export default PMSSalesReport;
