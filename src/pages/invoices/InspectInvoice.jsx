import { TextField, Grid, Button } from '@mui/material';
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { deleteRow } from "../../network/api";
import { formatDate } from "../../utils/FormHelper";

const ViewInvoices = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId, Organization } = useStore();

  const colDefs = [
    { headerName: 'ID', field: 'invoiceId', width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
    { headerName: 'Invoice Number', field: 'invoiceNumber', valueFormatter: ({ value }) => `${Organization.initials}-${value}` },
    { headerName: 'Invoice Date', field: 'invoiceDate', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { headerName: 'Order ID', field: 'orderId' },
    { headerName: 'Due Date', field: 'dueDate', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Payment ID', field: 'paymentId' },
    { headerName: 'Payment Date', field: 'paymentDate', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Date Added', field: 'dateAdded', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Updated At', field: 'updatedAt', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Payment Mode', field: 'paymentMode' },
    { headerName: 'Online Method', field: 'onlineMethod' },
    { headerName: 'UPI', field: 'upi' },
    { headerName: 'Card Number', field: 'cardNumber' },
    { headerName: 'Card Holder Name', field: 'cardHolderName' },
    { headerName: 'Expiry Date', field: 'expiryDate', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'CVV', field: 'cvv' },
    { headerName: 'Card Type', field: 'cardType' },
    { headerName: 'Bank Name', field: 'bankName' },
    { headerName: 'Payment Status', field: 'paymentStatus' },
    { headerName: 'Customer ID', field: 'customerId' },
    { headerName: 'Order Date', field: 'orderDate', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Order Status', field: 'orderStatus' },
    { headerName: 'Shipping Address', field: 'shippingAddress' },
    { headerName: 'Total Amount', field: 'totalAmount' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Discount Applied', field: 'discountApplied' },
    { headerName: 'Shipping Cost', field: 'shippingCost' },
    { headerName: 'Shipping Date', field: 'shippingDate', valueFormatter: ({ value }) => formatDate(value) },
    { headerName: 'Placed By User ID', field: 'placedByUserId' },
    { headerName: 'Customer Name', field: 'customerName' },
    { headerName: 'Items', field: 'items', cellRenderer: 'agGroupCellRenderer' },
  ];

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        navigate(`/invoice/${data?.invoiceId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteRow(`invoices/delete/${data?.orderId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.invoiceId);
            navigate("/invoices");
          } else {
            errorPopup("Failed to delete");
          }
        });
      }
    }
  ];

  // Get invoices from localStorage
  const getInvoicesData = () => {
    const storedOrders = localStorage.getItem('customerOrders');
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      return orders.map((order, index) => ({
        invoiceId: order.orderId,
        invoiceNumber: order.invoiceNumber,
        invoiceDate: order.orderDate,
        orderId: order.orderId,
        dueDate: order.orderDate,
        paymentId: `PAY${order.orderId}`,
        paymentDate: order.orderDate,
        status: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
        dateAdded: order.orderDate,
        updatedAt: order.orderDate,
        paymentMode: 'Online',
        onlineMethod: 'UPI',
        paymentStatus: order.paymentStatus === 'paid' ? 'Success' : 'Pending',
        customerId: `CUST${order.orderId}`,
        orderDate: order.orderDate,
        orderStatus: order.orderStatus,
        shippingAddress: '123 Street, City',
        totalAmount: parseFloat(order.totalAmount),
        taxAmount: parseFloat(order.totalAmount) * 0.18,
        discountApplied: 0,
        shippingCost: 30,
        customerName: order.customerName,
        items: order.items.map(item => item.itemName).join(', '),
      }));
    }
    return [];
  };

  const mockData = getInvoicesData();

  return (
    <ViewData
      menuOptions={menuOptions}
      title="Invoice"
      url="/invoices"
      disableControls
      initialColDefs={colDefs}
      dateRange={true}
      mockData={mockData} // Pass mock data here
    />
  );
};

export default ViewInvoices;

