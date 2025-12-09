import ReportLayout from './ReportLayout';
import { getCurrentStockValuationReport } from '../../network/api';

const StockValuationReport = () => {
  const columnDefs = [
    { headerName: 'Product ID', field: 'product_id' },
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Warehouse ID', field: 'warehouse_id' },
    { headerName: 'Warehouse Name', field: 'warehouse_name' },
    { headerName: 'Current Stock', field: 'current_stock' },
    { headerName: 'Stock Value', field: 'stock_value' },
    { headerName: 'Updated At', field: 'updated_at', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
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
