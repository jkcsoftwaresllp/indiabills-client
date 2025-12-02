import { useState } from 'react';
import ReportLayout from './ReportLayout';
import { getStockAndSalesSummaryReport } from '../../network/api';

const StockSalesSummaryReport = () => {
  const [rate] = useState('all'); // Default rate, can be customized

  const columnDefs = [
    { headerName: 'Item ID', field: 'itemId' },
    { headerName: 'Item Name', field: 'itemName', filter: true },
    { headerName: 'Opening Quantity', field: 'openingQuantity' },
    { headerName: 'Opening Amount', field: 'openingAmount' },
    { headerName: 'In Quantity', field: 'inQuantity' },
    { headerName: 'In Amount', field: 'inAmount' },
    { headerName: 'Out Quantity', field: 'outQuantity' },
    { headerName: 'Out Amount', field: 'outAmount' },
    { headerName: 'Closing Quantity', field: 'closingQuantity' },
    { headerName: 'Closing Amount', field: 'closingAmount' },
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
