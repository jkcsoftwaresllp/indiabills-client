import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { ColDef } from "ag-grid-community";
import { Avatar } from "@mui/material";
import { getBaseURL } from "../../network/api/api-config";
import { deleteRow } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { Customer } from "../../definitions/Types";

const colDefs: ColDef[] = [
  { field: "customerId", headerName: "ID", width: 50, cellRenderer: (params: any) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  {
  "field": "customerName",
  "headerName": "Customer",
  "filter": true,
  "editable": true,
      "cellRenderer": (params: any) => (
          <div className="flex items-center">
              <Avatar src={params.data.avatar ? `${getBaseURL()}/${params.data.avatar}` : `${process.env.REACT_APP_SERVER_URL}/default.webp`} alt={params.data.addedBy}  sx={{ width: 28, height: 28 }}  />
              <span style={{ marginLeft: 8 }}>{params.data.customerName}</span>
          </div>
      ),
},
  { field: "businessName", headerName: "Business Name", editable: true, valueFormatter: (params) => (params.value ? params.value : "N/A"), cellStyle: {textTransform: 'capitalize',} },
  { field: "email", headerName: "Email", editable: true },
  { field: "gender", headerName: "Gender", editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Male', 'Female', 'Other'] } },
  { field: "mobile", headerName: "Mobile", editable: true },
  { field: "alternateMobileNumber", headerName: "Alternate Mobile Number", editable: true, valueFormatter: (params) => (params.value ? params.value : "N/A"), },
  { field: "gstin", headerName: "GSTIN", editable: true },
  { field: "fssai", headerName: "FSSAI", editable: true },
  { field: "registrationNumber", headerName: "Registration Number", editable: true },
  { field: "aadharNumber", headerName: "Aadhar Number", editable: true },
  { field: "panNumber", headerName: "PAN Number", editable: true },
  { field: "otherDocuments", headerName: "Other Documents", editable: true },
  { field: "status", headerName: "Status", editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Active', 'Inactive'] } },
  { field: "dateAdded", headerName: "Date Added" },
  { field: "addedBy", headerName: "Added By" },
  { field: "lastEditedDate", headerName: "Last Edited Date" },
  { field: "lastEditedBy", headerName: "Last Edited By" },
];

const ViewCustomers: React.FC = () => {
  
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data?: Customer) => {
        console.log(`Inspecting ${data?.customerId}`);
        navigate(`/customers/${data?.customerId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data?: Customer,) => {
        deleteRow(`customers/soft/${data?.customerId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.customerId as unknown as number);
            navigate("/customers");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        }
        );
      }
    }
  ];

  return (
    <ViewData menuOptions={menuOptions} title="Customers" url="/customers" initialColDefs={colDefs} />
  );
};

export default ViewCustomers;
