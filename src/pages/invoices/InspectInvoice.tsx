import { TextField, Grid, Button } from '@mui/material';
import React, { useEffect, useState } from "react";
import ViewData from "../../layouts/form/ViewData";
import { ColDef } from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { deleteRow, getData } from "../../network/api";
import { Invoice } from "../../definitions/Types";
import {formatDate} from "../../utils/FormHelper";

const ViewInvoices: React.FC = () => {

  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId, Organization} = useStore();

const colDefs: ColDef[] = [
  { headerName: 'ID', field: 'invoiceId', width: 50, cellRenderer: (params: any) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { headerName: 'Invoice Number', field: 'invoiceNumber', valueFormatter: ({ value }) => `${Organization.initials}-${value}` },
  { headerName: 'Invoice Date', field: 'invoiceDate', valueFormatter: ({ value }) => new Date(value).toLocaleDateString()},
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
      onClick: (data?: Invoice) => {
        navigate(`/invoice/${data?.invoiceId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data?: Invoice,) => {
        deleteRow(`invoices/delete/${data?.orderId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.invoiceId as number);
            navigate("/invoices");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        }
        );
      }
    }
  ];

  return <ViewData menuOptions={menuOptions} title="Invoice" url="/invoices" disableControls initialColDefs={colDefs} dateRange={true} />;
};

export default ViewInvoices;
