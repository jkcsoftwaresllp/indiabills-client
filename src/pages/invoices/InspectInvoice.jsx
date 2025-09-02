// import { TextField, Grid, Button } from '@mui/material';
// import React from "react";
// import ViewData from "../../layouts/form/ViewData";
// import { useNavigate } from "react-router-dom";
// import { useStore } from "../../store/store";
// import { deleteRow } from "../../network/api";
// import { formatDate } from "../../utils/FormHelper";

// const ViewInvoices = () => {
//   const navigate = useNavigate();
//   const { successPopup, errorPopup, refreshTableSetId, Organization } = useStore();

//   const colDefs = [
//     { headerName: 'ID', field: 'invoiceId', width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
//     { headerName: 'Invoice Number', field: 'invoiceNumber', valueFormatter: ({ value }) => `${Organization.initials}-${value}` },
//     { headerName: 'Invoice Date', field: 'invoiceDate', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
//     { headerName: 'Order ID', field: 'orderId' },
//     { headerName: 'Due Date', field: 'dueDate', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Payment ID', field: 'paymentId' },
//     { headerName: 'Payment Date', field: 'paymentDate', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Status', field: 'status' },
//     { headerName: 'Date Added', field: 'dateAdded', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Updated At', field: 'updatedAt', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Payment Mode', field: 'paymentMode' },
//     { headerName: 'Online Method', field: 'onlineMethod' },
//     { headerName: 'UPI', field: 'upi' },
//     { headerName: 'Card Number', field: 'cardNumber' },
//     { headerName: 'Card Holder Name', field: 'cardHolderName' },
//     { headerName: 'Expiry Date', field: 'expiryDate', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'CVV', field: 'cvv' },
//     { headerName: 'Card Type', field: 'cardType' },
//     { headerName: 'Bank Name', field: 'bankName' },
//     { headerName: 'Payment Status', field: 'paymentStatus' },
//     { headerName: 'Customer ID', field: 'customerId' },
//     { headerName: 'Order Date', field: 'orderDate', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Order Status', field: 'orderStatus' },
//     { headerName: 'Shipping Address', field: 'shippingAddress' },
//     { headerName: 'Total Amount', field: 'totalAmount' },
//     { headerName: 'Tax Amount', field: 'taxAmount' },
//     { headerName: 'Discount Applied', field: 'discountApplied' },
//     { headerName: 'Shipping Cost', field: 'shippingCost' },
//     { headerName: 'Shipping Date', field: 'shippingDate', valueFormatter: ({ value }) => formatDate(value) },
//     { headerName: 'Placed By User ID', field: 'placedByUserId' },
//     { headerName: 'Customer Name', field: 'customerName' },
//     { headerName: 'Items', field: 'items', cellRenderer: 'agGroupCellRenderer' },
//   ];

//   const menuOptions = [
//     {
//       label: "Inspect",
//       onClick: (data) => {
//         navigate(`/invoice/${data?.invoiceId}`);
//       },
//     },
//     {
//       label: "Delete",
//       onClick: (data) => {
//         deleteRow(`invoices/delete/${data?.orderId}`).then((response) => {
//           if (response === 200) {
//             successPopup("Deleted successfully");
//             refreshTableSetId(data?.invoiceId);
//             navigate("/invoices");
//           } else {
//             errorPopup("Failed to delete");
//             console.error("Failed to delete");
//           }
//         });
//       }
//     }
//   ];

//   return <ViewData menuOptions={menuOptions} title="Invoice" url="/invoices" disableControls initialColDefs={colDefs} dateRange={true} />;
// };

// export default ViewInvoices;

import { TextField, Grid, Button } from '@mui/material';
import React from "react";
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

  const mockData = [
    // {
    //   invoiceId: 1,
    //   invoiceNumber: 'INV001',
    //   invoiceDate: '2025-07-15',
    //   orderId: 'ORD123',
    //   dueDate: '2025-07-20',
    //   paymentId: 'PAY456',
    //   paymentDate: '2025-07-16',
    //   status: 'Paid',
    //   dateAdded: '2025-07-15',
    //   updatedAt: '2025-07-16',
    //   paymentMode: 'Online',
    //   onlineMethod: 'UPI',
    //   upi: 'customer@upi',
    //   cardNumber: '**** **** **** 1234',
    //   cardHolderName: 'John Doe',
    //   expiryDate: '2025-12-31',
    //   cvv: '***',
    //   cardType: 'Visa',
    //   bankName: 'SBI',
    //   paymentStatus: 'Success',
    //   customerId: 'CUST001',
    //   orderDate: '2025-07-14',
    //   orderStatus: 'Shipped',
    //   shippingAddress: '123 Street, City',
    //   totalAmount: 1200,
    //   taxAmount: 100,
    //   discountApplied: 50,
    //   shippingCost: 30,
    //   shippingDate: '2025-07-17',
    //   placedByUserId: 'USR009',
    //   customerName: 'John Doe',
    //   items: 'Product A, Product B',
    // },
    // {
    //   invoiceId: 2,
    //   invoiceNumber: 'INV002',
    //   invoiceDate: '2025-07-10',
    //   orderId: 'ORD124',
    //   dueDate: '2025-07-15',
    //   paymentId: 'PAY789',
    //   paymentDate: '2025-07-11',
    //   status: 'Pending',
    //   dateAdded: '2025-07-10',
    //   updatedAt: '2025-07-11',
    //   paymentMode: 'Card',
    //   onlineMethod: 'Net Banking',
    //   upi: '',
    //   cardNumber: '**** **** **** 5678',
    //   cardHolderName: 'Alice Smith',
    //   expiryDate: '2026-01-31',
    //   cvv: '***',
    //   cardType: 'MasterCard',
    //   bankName: 'HDFC',
    //   paymentStatus: 'Pending',
    //   customerId: 'CUST002',
    //   orderDate: '2025-07-09',
    //   orderStatus: 'Processing',
    //   shippingAddress: '456 Avenue, City',
    //   totalAmount: 2500,
    //   taxAmount: 200,
    //   discountApplied: 0,
    //   shippingCost: 40,
    //   shippingDate: '',
    //   placedByUserId: 'USR010',
    //   customerName: 'Alice Smith',
    //   items: 'Product C',
    // }
  ];

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

