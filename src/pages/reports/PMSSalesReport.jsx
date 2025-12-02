import ReportLayout from './ReportLayout';
import { getPmsSalesReportAPI } from '../../network/api';

const PMSSalesReport = () => {
  const columnDefs = [
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Date of Sale', field: 'dateOfSale', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Tax Slab', field: 'taxSlab' },
    { headerName: 'Total Amount', field: 'totalAmount' },
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
