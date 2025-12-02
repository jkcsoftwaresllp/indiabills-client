import ReportLayout from './ReportLayout';
import { getSalesByProductReport } from '../../network/api';

const SalesByProductReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'Category Name', field: 'category_name' },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Total Sales', field: 'total_sales' },
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
