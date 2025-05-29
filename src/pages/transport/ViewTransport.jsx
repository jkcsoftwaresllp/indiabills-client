import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { deleteRow } from "../../network/api";

const colDefs = [
  { field: "transportId", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "transportName", headerName: "Transport Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "businessName", headerName: "Business Name", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "vehicleName", headerName: "Vehicle Name", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "email", headerName: "Email", editable: true },
  { field: "mobileNumber", headerName: "Mobile Number", editable: true },
  { field: "alternateMobileNumber", headerName: "Alternate Mobile Number", editable: true },
  { field: "addressLine1", headerName: "Address Line 1", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "addressLine2", headerName: "Address Line 2", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "landmark", headerName: "Landmark", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "district", headerName: "District", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "pinCode", headerName: "Pin Code", editable: true },
  { field: "branchOffice", headerName: "Branch Office", editable: true },
  { field: "aadharNumber", headerName: "Aadhar Number" },
  { field: "panNumber", headerName: "PAN Number" },
  { field: "driverName", headerName: "Driver Name", editable: true },
  { field: "driverMobileNumber", headerName: "Driver Mobile Number", editable: true },
  { field: "driverAlternateNumber", headerName: "Driver Alternate Number", editable: true },
  { field: "status", headerName: "Status", cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ["active", "inactive"] } },
  { field: "dateAdded", headerName: "Date Added" },
  { field: "addedBy", headerName: "Added By" },
  { field: "lastEditedDate", headerName: "Last Edited Date" },
  { field: "lastEditedBy", headerName: "Last Edited By" },
];

const ViewTransport = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting ${data?.transportId}`);
        navigate(`/transport/${data?.transportId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteRow(`transport/delete/${data?.transportId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.transportId);
            navigate("/transport");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        });
      },
    },
  ];

  return (
    <ViewData menuOptions={menuOptions} title="Transport" url="/transport" initialColDefs={colDefs} />
  );
};

export default ViewTransport;
