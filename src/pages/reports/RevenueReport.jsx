import ReportLayout from './ReportLayout';

const RevenueReport = () => {
    const columnDefs = [
        { headerName: 'Date of Sale', field: 'dateOfSale', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
        { headerName: 'Invoice Number', field: 'invoiceNumber' },
        { headerName: 'Product ID', field: 'productId' },
        { headerName: 'Product Name', field: 'productName', filter: true },
        { headerName: 'Quantity Sold', field: 'quantitySold' },
        { headerName: 'Unit Price', field: 'salePrice' },
        { headerName: 'Total Sale Amount', field: 'totalSaleAmount' },
        { headerName: 'Discounts Applied', field: 'discountsApplied' },
        { headerName: 'Tax Amount', field: 'taxAmount' },
        { headerName: 'Shipping Charges', field: 'shippingCharges' },
        { headerName: 'Net Revenue', field: 'netRevenue' },
      ];

  return (
    <ReportLayout
      title="Revenue Report"
      url={"/reports/revenue"}
      columnDefs={columnDefs}
    />
  );
};

export default RevenueReport;
