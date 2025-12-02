import ReportLayout from './ReportLayout';
import { getAllInvoiceFinancialReportAPI } from '../../network/api';

const InvoiceFinancialReport = () => {
  const columnDefs = [
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Date', field: 'date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Customer Name', field: 'customerName', filter: true },
    { headerName: 'Subtotal', field: 'subtotal' },
    { headerName: 'Discount', field: 'discount' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Shipping', field: 'shipping' },
    { headerName: 'Total Amount', field: 'totalAmount' },
    { headerName: 'Payment Status', field: 'paymentStatus' },
  ];

  return (
    <ReportLayout
      title="Invoice Financial Report"
      url="/reports/invoices/financial"
      columnDefs={columnDefs}
      fetchFunction={getAllInvoiceFinancialReportAPI}
    />
  );
};

export default InvoiceFinancialReport;
