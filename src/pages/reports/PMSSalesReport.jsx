import ReportLayout from './ReportLayout';
import { getPmsSalesReportAPI } from '../../network/api';

const PMSSalesReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Category', field: 'category' },
    { headerName: 'Unit', field: 'unit' },
    { headerName: 'Qty Sold', field: 'qtySold' },
    { headerName: 'Return Qty', field: 'returnQty' },
    { headerName: 'Net Qty', field: 'netQty' },
    { headerName: 'Gross Sales', field: 'grossSales' },
    { headerName: 'Discount', field: 'discount' },
    { headerName: 'Return Value', field: 'returnValue' },
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
