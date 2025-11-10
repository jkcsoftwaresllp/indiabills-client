import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getReconciliations } from "../../network/api";

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
  { field: "warehouseId", headerName: "Warehouse ID" },
  { field: "reconciliationDate", headerName: "Date", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
  { field: "status", headerName: "Status", cellRenderer: (params) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`py-1 px-3 rounded-full text-xs ${statusColors[params.value] || 'bg-gray-100 text-gray-800'}`}>
        {params.value?.replace('_', ' ').toUpperCase()}
      </span>
    );
  }},
  { field: "totalProductsCounted", headerName: "Products Counted" },
  { field: "totalDiscrepancies", headerName: "Discrepancies", cellRenderer: (params) => (
    <span className={`font-medium ${params.value > 0 ? 'text-red-600' : 'text-green-600'}`}>
      {params.value}
    </span>
  )},
  { field: "notes", headerName: "Notes" },
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => 
    new Date(value).toLocaleDateString() 
  },
  { field: "completedAt", headerName: "Completed At", valueFormatter: ({ value }) => 
    value ? new Date(value).toLocaleDateString() : '-'
  },
  { field: "createdBy", headerName: "Created By" },
  { field: "completedBy", headerName: "Completed By" },
];

const ViewReconciliations = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const menuOptions = [
    {
      label: "View Details",
      onClick: (data) => {
        console.log(`Viewing reconciliation ${data?.id}`);
        navigate(`/inventory/reconciliations/${data?.id}`);
      },
    },
    {
      label: "Add Items",
      onClick: (data) => {
        if (data?.status === 'pending' || data?.status === 'in_progress') {
          navigate(`/inventory/reconciliations/${data?.id}/add`);
        } else {
          errorPopup('Cannot add items to completed reconciliation');
        }
      },
    },
  ];

  return (
    <ViewData 
      menuOptions={menuOptions} 
      title="Inventory Reconciliations" 
      customDataFetcher={getReconciliations}
      initialColDefs={colDefs}
      dateRange={true}
    />
  );
};

export default ViewReconciliations;