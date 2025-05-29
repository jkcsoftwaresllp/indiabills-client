import { useState } from 'react';
import { getData } from '../../network/api';
import { AgGridReact } from 'ag-grid-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Invoice Report</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Enter Invoice Number"
                    className="border p-2 rounded mr-2"
                />
                <button
                    onClick={handleFetchData}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Fetch Data
                </button>
            </div>
            {invoiceData && (
                <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
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