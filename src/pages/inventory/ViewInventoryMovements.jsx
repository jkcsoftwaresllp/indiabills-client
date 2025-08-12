import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getInventoryMovements } from "../../network/api";

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
  { field: "transactionID", headerName: "Transaction ID", filter: true },
  { field: "movementType", headerName: "Type", width: 100, cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${
      params.value === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {params.value === 'in' ? 'Stock In' : 'Stock Out'}
    </span>
  )},
  { field: "productID", headerName: "Product ID" },
  { field: "batchID", headerName: "Batch ID" },
  { field: "warehouseID", headerName: "Warehouse ID" },
  { field: "quantity", headerName: "Quantity" },
  { field: "unitCost", headerName: "Unit Cost", cellClassRules: { money: (p) => p.value } },
  { field: "reference", headerName: "Reference" },
  { field: "remarks", headerName: "Remarks" },
  { field: "movementDate", headerName: "Movement Date", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
  { field: "createdBy", headerName: "Created By" },
];

const ViewInventoryMovements = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting movement ${data?.id}`);
        navigate(`/inventory/movements/${data?.id}`);
      },
    },
  ];

  return (
    <ViewData 
      menuOptions={menuOptions} 
      title="Inventory Movements" 
      customDataFetcher={getInventoryMovements}
      initialColDefs={colDefs}
      disableControls={true}
      dateRange={true}
    />
  );
};

export default ViewInventoryMovements;