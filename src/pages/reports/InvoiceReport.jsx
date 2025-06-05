import { useState } from 'react';
import { getData } from '../../network/api';
import { AgGridReact } from 'ag-grid-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import styles from './styles/InvoiceReport.module.css';

const InvoiceReport = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);

    const fetchInvoiceData = async (invoiceNumber) => {
        try {
            const response = await getData(`/reports/invoice/${invoiceNumber}`);
            const formattedData = response.map((data) => ({
                ...data,
                invoiceDate: new Date(data.invoiceDate).toLocaleDateString(),
                dueDate: new Date(data.dueDate).toLocaleDateString(),
                orderDate: new Date(data.orderDate).toLocaleDateString(),
                shippingDate: new Date(data.shippingDate).toLocaleDateString(),
                dateAdded: new Date(data.dateAdded).toLocaleDateString(),
                updatedAt: new Date(data.updatedAt).toLocaleDateString(),
            }));
            setInvoiceData(formattedData);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }
    };

    const handleFetchData = () => {
        if (invoiceNumber) {
            fetchInvoiceData(invoiceNumber);
        }
    };

    const columnDefs = [
        { headerName: 'Invoice ID', field: 'invoiceId' },
        { headerName: 'Order ID', field: 'orderId' },
        { headerName: 'Invoice Number', field: 'invoiceNumber' },
        { headerName: 'Invoice Date', field: 'invoiceDate' },
        { headerName: 'Due Date', field: 'dueDate' },
        { headerName: 'Total Amount', field: 'totalAmount' },
        { headerName: 'Tax Amount', field: 'taxAmount' },
        { headerName: 'Discount Applied', field: 'discountApplied' },
        { headerName: 'Shipping Cost', field: 'shippingCost' },
        { headerName: 'Payment Status', field: 'paymentStatus' },
        { headerName: 'Payment Method', field: 'paymentMethod' },
        { headerName: 'Status', field: 'status' },
        { headerName: 'Customer Name', field: 'customerName' },
        { headerName: 'Order Status', field: 'orderStatus' },
        { headerName: 'Shipping Address', field: 'shippingAddress' },
    ];

   return (
  <div className={styles.container}>
    <h1 className={styles.heading}>Invoice Report</h1>
    <div className={styles.inputGroup}>
      <input
        type="text"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
        placeholder="Enter Invoice Number"
        className={styles.input}
      />
      <button onClick={handleFetchData} className={styles.button}>
        Fetch Data
      </button>
    </div>
    {invoiceData && (
      <div className={`ag-theme-quartz ${styles.gridWrapper}`}>
        <AgGridReact
          rowData={invoiceData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    )}
  </div>
);
};

export default InvoiceReport;