import ReportLayout from './ReportLayout';
import { getCurrentStockValuationReport } from '../../network/api';

const StockValuationReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Current Stock', field: 'currentStock' },
    { headerName: 'Unit Cost', field: 'unitCost' },
    { headerName: 'Total Valuation', field: 'totalValuation' },
    { headerName: 'Warehouse', field: 'warehouse' },
  ];

  return (
    <ReportLayout
      title="Stock Valuation Report"
      url="/reports/stock-valuation"
      columnDefs={columnDefs}
      fetchFunction={getCurrentStockValuationReport}
    />
  );
};

export default StockValuationReport;
