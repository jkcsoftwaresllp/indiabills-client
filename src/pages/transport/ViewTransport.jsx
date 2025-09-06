import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getTransportPartners, deleteTransportPartner } from "../../network/api";

const colDefs = [
  { field: "id", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Transport Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "businessName", headerName: "Business Name", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "vehicleDetails", headerName: "Vehicle Details", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "email", headerName: "Email", editable: true },
  { field: "phone", headerName: "Phone", editable: true },
  { field: "alternatePhone", headerName: "Alternate Phone", editable: true },
  { field: "contactPerson", headerName: "Contact Person", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "addressLine", headerName: "Address", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "pinCode", headerName: "Pin Code", editable: true },
  { field: "gstnumber", headerName: "GST Number" },
  { field: "pannumber", headerName: "PAN Number" },
  { field: "baseRate", headerName: "Base Rate", cellClassRules: { money: (p) => p.value } },
  { field: "ratePerKm", headerName: "Rate Per KM", cellClassRules: { money: (p) => p.value } },
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewTransport = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/operator/')) {
          navigate(`/operator/transport/${data?.id}`);
        } else {
          navigate(`/transport/${data?.id}`);
        }
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteTransportPartner(data?.id).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.id);
          } else {
            errorPopup("Failed to delete");
          }
        });
      },
    },
  ];

  return (
    <ViewData 
      menuOptions={menuOptions} 
      title="Transport Partners" 
      url="/transport"
      customDataFetcher={getTransportPartners}
      initialColDefs={colDefs} 
    />
  );
};

export default ViewTransport;