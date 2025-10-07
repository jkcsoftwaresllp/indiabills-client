import React from "react";
import ViewData from "../../layouts/form/ViewData";
import Rating from '@mui/material/Rating';
import { getSuppliers, deleteSupplier } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const RatingCellRenderer = (params) => {
  return (
    <div className="w-full h-full flex items-center">
      <Rating
        name="rating"
        value={Number(params.value)}
        readOnly
        precision={0.5}
      />
    </div>
  );
};

const colDefs = [
  { field: "id", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "rating", headerName: "Rating", editable: true, cellRenderer: RatingCellRenderer },
  { field: "businessName", headerName: "Business", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "contactPerson", headerName: "Contact Person", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "phone", headerName: "Phone", editable: true },
  { field: "alternatePhone", headerName: "Alternate Phone", editable: true },
  { field: "email", headerName: "Email" },
  { field: "addressLine", headerName: "Address" },
  { field: "city", headerName: "City" },
  { field: "state", headerName: "State" },
  { field: "pinCode", headerName: "Pin Code" },
  { field: "gstin", headerName: "GSTIN" },
  { field: "bankAccountNumber", headerName: "Account Number" },
  { field: "ifsccode", headerName: "IFSC Code" },
  { field: "upiid", headerName: "UPI ID" },
  { field: "creditLimit", headerName: "Credit Limit", cellClassRules: { money: (p) => p.value } },
  { field: "paymentTerms", headerName: "Payment Terms" },
  { field: "remarks", headerName: "Remarks", editable: true },
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewSuppliers = () => {
  return (
    <ViewData 
      title="Suppliers" 
      url="/suppliers"
      customDataFetcher={getSuppliers}
      initialColDefs={colDefs} 
    />
  );
};

export default ViewSuppliers;