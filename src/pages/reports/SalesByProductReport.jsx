import ReportLayout from './ReportLayout';
import { getSalesByProductReport } from '../../network/api';

const SalesByProductReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Total Quantity Sold', field: 'totalQuantitySold' },
    { headerName: 'Total Sales Amount', field: 'totalSalesAmount' },
    { headerName: 'Average Price', field: 'averagePrice' },
    { headerName: 'Number of Orders', field: 'numberOfOrders' },
  ];

  return (
    <ReportLayout
      title="Sales by Product Report"
      url="/reports/sales-by-product"
      columnDefs={columnDefs}
      fetchFunction={getSalesByProductReport}
    />
  );
};

export default SalesByProductReport;
