import ReportLayout from './ReportLayout';
import { getAllInvoiceFinancialReportAPI } from '../../network/api';

const InvoiceFinancialReport = () => {
  const columnDefs = [
    { headerName: 'Invoice ID', field: 'invoiceId' },
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Invoice Date', field: 'invoiceDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Customer Name', field: 'customerName', filter: true },
    { headerName: 'Phone', field: 'phone' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Total MRP', field: 'totalMRP' },
    { headerName: 'Total Sale Amount', field: 'totalSaleAmount' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Discount', field: 'discount' },
    { headerName: 'Shipping Cost', field: 'shippingCost' },
    { headerName: 'Total Paid', field: 'totalPaid' },
    { headerName: 'Total Returned', field: 'totalReturned' },
    { headerName: 'Total Due', field: 'dueAmount' },
    { headerName: 'Status', field: 'status' },
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
