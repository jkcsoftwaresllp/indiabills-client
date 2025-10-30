import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getTransportPartners, deleteTransportPartner } from "../../network/api";

const colDefs = [
  { field: "id", headerName: "ID", width: 50, checkboxSelection: true, headerCheckboxSelection: false, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Transport Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "businessName", headerName: "Business Name", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "vehicleDetails", headerName: "Vehicle Details", editable: true },
  { field: "email", headerName: "Email", editable: true },
  { field: "phone", headerName: "Phone", editable: true },
  { field: "alternatePhone", headerName: "Alternate Phone", editable: true },
  { field: "contactPerson", headerName: "Contact Person", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "addressLine", headerName: "Address", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "pinCode", headerName: "Pin Code", editable: true },
  { field: "gstNumber", headerName: "GST Number", editable: true },
  { field: "panNumber", headerName: "PAN Number", editable: true },
  { field: "baseRate", headerName: "Base Rate", editable: true, cellClassRules: { money: (p) => p.value } },
  { field: "ratePerKm", headerName: "Rate Per KM", editable: true, cellClassRules: { money: (p) => p.value } },
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewTransport = () => {
  return (
    <ViewData
      title="Transport"
      url="/transport"
      customDataFetcher={getTransportPartners}
      initialColDefs={colDefs}
    />
  );
};

export default ViewTransport;