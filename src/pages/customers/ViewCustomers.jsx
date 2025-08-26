import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { Avatar } from "@mui/material";
import { getBaseURL } from "../../network/api/api-config";
import { getCustomers, deleteCustomer } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const colDefs = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ),
  },
  {
    field: "name",
    headerName: "Customer",
    filter: true,
    editable: true,
    cellRenderer: (params) => (
      <div className="flex items-center">
        <Avatar
          src={
            params.data.avatar
              ? `${getBaseURL()}/${params.data.avatar}`
              : `${process.env.REACT_APP_SERVER_URL}/default.webp`
          }
          alt={params.data.addedBy}
          sx={{ width: 28, height: 28 }}
        />
        <span style={{ marginLeft: 8 }}>{params.data.name}</span>
      </div>
    ),
  },
  {
    field: "businessName",
    headerName: "Business Name",
    editable: true,
    valueFormatter: (params) => (params.value ? params.value : "N/A"),
    cellStyle: { textTransform: "capitalize" },
  },
  { field: "email", headerName: "Email", editable: true },
  {
    field: "gender",
    headerName: "Gender",
    editable: true,
    cellStyle: { textTransform: 'capitalize' },
  },
  { field: "phone", headerName: "Phone", editable: true },
  {
    field: "alternatePhone",
    headerName: "Alternate Phone",
    editable: true,
    valueFormatter: (params) => (params.value ? params.value : "N/A"),
  },
  { field: "gstin", headerName: "GSTIN" },
  { field: "fssaiNumber", headerName: "FSSAI Number" },
  { field: "panNumber", headerName: "PAN Number" },
  { field: "aadharNumber", headerName: "Aadhar Number", editable: true },
  { field: "customerType", headerName: "Customer Type", cellStyle: { textTransform: 'capitalize' } },
  { field: "creditLimit", headerName: "Credit Limit", cellClassRules: { money: (p) => p.value } },
  { field: "outstandingBalance", headerName: "Outstanding Balance", cellClassRules: { money: (p) => p.value } },
  { field: "loyaltyPoints", headerName: "Loyalty Points" },
  { field: "isBlacklisted", headerName: "Blacklisted", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
      {params.value ? 'Yes' : 'No'}
    </span>
  )},
  { field: "blacklistReason", headerName: "Blacklist Reason" },
  {
    field: "isActive",
    headerName: "Status",
    cellRenderer: (params) => (
      <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {params.value ? 'Active' : 'Inactive'}
      </span>
    )
  },
  { field: "dateOfBirth", headerName: "Date of Birth", valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A' },
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewCustomers = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting ${data?.id}`);
        navigate(`/customers/${data?.id}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteCustomer(data?.id).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.id);
            navigate("/customers");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        });
      },
    },
  ];

  return (
    <ViewData
      menuOptions={menuOptions}
      title="Customers"
      customDataFetcher={getCustomers}
      initialColDefs={colDefs}
    />
  );
};

export default ViewCustomers;
