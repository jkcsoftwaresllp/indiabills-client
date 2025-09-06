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
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting warehouse ${data?.id}`);
        navigate(`/operator/warehouses/${data?.id}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteWarehouse(data?.id).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.id);
            navigate("/operator/warehouses");
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
      title="Warehouses" 
      customDataFetcher={getWarehouses}
      initialColDefs={colDefs}
    />
  );
};

export default ViewWarehouses;