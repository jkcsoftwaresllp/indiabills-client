import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getInventoryStock } from "../../network/api";

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
  { field: "productID", headerName: "Product ID" },
  { field: "batchID", headerName: "Batch ID" },
  { field: "warehouseID", headerName: "Warehouse ID" },
  { field: "totalQuantity", headerName: "Total Qty", cellRenderer: (params) => (
    <span className="font-medium">{params.value}</span>
  )},
  { field: "availableQuantity", headerName: "Available Qty", cellRenderer: (params) => (
    <span className={`font-medium ${params.value <= 10 ? 'text-red-600' : 'text-green-600'}`}>
      {params.value}
    </span>
  )},
  { field: "reservedQuantity", headerName: "Reserved Qty", cellRenderer: (params) => (
    <span className="text-orange-600 font-medium">{params.value}</span>
  )},
  { field: "lastMovementID", headerName: "Last Movement ID" },
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
];

const ViewInventoryStock = () => {
  return (
    <ViewData 
      title="Inventory Stock" 
      customDataFetcher={getInventoryStock}
      initialColDefs={colDefs}
    />
  );
};

export default ViewInventoryStock;