import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getWarehouses, deleteWarehouse } from "../../network/api";

const colDefs = [
  { 
    field: "id", 
    headerName: "ID", 
    width: 50,
    checkboxSelection: true,
    headerCheckboxSelection: false,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ) 
  },
  { field: "name", headerName: "Warehouse Name", filter: true, editable: true },
  { field: "code", headerName: "Code", editable: true },
  { field: "capacity", headerName: "Capacity", editable: true },
  { field: "managerName", headerName: "Manager", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "managerPhone", headerName: "Manager Phone", editable: true },
  { field: "addressLine", headerName: "Address", editable: true },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "pinCode", headerName: "Pin Code", editable: true },
  { 
    field: "isActive", 
    headerName: "Status", 
    cellRenderer: (params) => (
      <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {params.value ? 'Active' : 'Inactive'}
      </span>
    )
  },
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewWarehouses = () => {
  return (
    <ViewData 
      title="Warehouses" 
      url="/internal/warehouses"
      initialColDefs={colDefs}
    />
  );
};

export default ViewWarehouses;