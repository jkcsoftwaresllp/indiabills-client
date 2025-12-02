import { useState } from 'react';
import ReportLayout from './ReportLayout';
import { getStockAndSalesSummaryReport } from '../../network/api';

const StockSalesSummaryReport = () => {
  const [rate] = useState('all'); // Default rate, can be customized

  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Current Stock', field: 'currentStock' },
    { headerName: 'Total Sales', field: 'totalSales' },
    { headerName: 'Stock Value', field: 'stockValue' },
    { headerName: 'Sales Value', field: 'salesValue' },
    { headerName: 'Rate', field: 'rate' },
  ];

  return (
    <ReportLayout
      title="Stock & Sales Summary Report"
      url={`/reports/stocks/rate/${rate}`}
      columnDefs={columnDefs}
      fetchFunction={(params) => getStockAndSalesSummaryReport(rate, params)}
    />
  );
};

export default StockSalesSummaryReport;
