import { FiColumns, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ViewData from "../../layouts/form/ViewData";
import { Avatar } from "@mui/material";
import { getBaseURL } from "../../network/api/api-config";
import { getCustomers, deleteCustomer } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const colDefs = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
    sortable: false,
    filter: false,
  },
  {
    field: "id",
    headerName: "ID",
    width: 60,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ),
  },
  {
    field: "first_name",
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
          alt={params.data.first_name}
          sx={{ width: 28, height: 28 }}
        />
        <span style={{ marginLeft: 8 }}>{`${params.data.first_name} ${params.data.last_name}`}</span>
      </div>
    ),
  },
  {
    field: "business_name",
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
  { field: "gstin", headerName: "GSTIN", editable: true },
  { field: "fssai_number", headerName: "FSSAI Number", editable: true },
  { field: "pan_number", headerName: "PAN Number", editable: true },
  { field: "aadhar_number", headerName: "Aadhar Number", editable: true },
  { field: "customer_type", headerName: "Customer Type", editable: true },
  { field: "credit_limit", headerName: "Credit Limit", editable: true, cellClassRules: { money: (p) => p.value } },
  { field: "outstanding_balance", headerName: "Outstanding Balance", cellClassRules: { money: (p) => p.value } },
  { field: "loyalty_points", headerName: "Loyalty Points", editable: true },
  { field: "is_blacklisted", headerName: "Blacklisted", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
      {params.value ? 'Yes' : 'No'}
    </span>
  )},
  { field: "blacklist_reason", headerName: "Blacklist Reason" },
  {
    field: "is_active",
    headerName: "Status",
    cellRenderer: (params) => (
      <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {params.value ? 'Active' : 'Inactive'}
      </span>
    )
  },
  { field: "date_of_birth", headerName: "Date of Birth", editable: true, valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A' },
  { field: "created_at", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updated_at", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewCustomers = () => {
  return (
    <ViewData
      title="Customers"
      customDataFetcher={getCustomers}
      initialColDefs={colDefs}
    />
  );
};

export default ViewCustomers;
