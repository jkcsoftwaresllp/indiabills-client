import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getWarehouses, deleteWarehouse, updateWarehouse } from "../../network/api";

const colDefs = [
  { 
    field: "id", 
    headerName: "ID", 
    width: 50,
    // checkboxSelection: true,
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
  { field: "manager_name", headerName: "Manager", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "manager_phone", headerName: "Manager Phone", editable: true },
  { field: "address_line", headerName: "Address", editable: true },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "pin_code", headerName: "Pin Code", editable: true },
  { 
    field: "is_active", 
    headerName: "Status", 
    // editable: true,
    cellRenderer: (params) => (
      <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {params.value ? 'Active' : 'Inactive'}
      </span>
    )
  },
  { field: "created_at", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updated_at", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewWarehouses = () => {
  // Transform frontend data (snake_case) to backend format (camelCase)
  const transformToBackendFormat = (data) => {
    return {
      name: data.name,
      code: data.code,
      capacity: data.capacity ? parseInt(data.capacity, 10) : 0,
      managerName: data.manager_name,
      managerPhone: data.manager_phone,
      addressLine: data.address_line,
      city: data.city,
      state: data.state,
      pinCode: data.pin_code,
      isActive: Boolean(data.is_active),
    };
  };

  // Update handler for warehouses
  const handleUpdateWarehouse = async (id, data) => {
    return await updateWarehouse(id, data);
  };

  return (
    <ViewData 
      title="Warehouses" 
      url="/internal/warehouses"
      idField="id"
      initialColDefs={colDefs}
      customDataFetcher={getWarehouses}
      deleteHandler={deleteWarehouse}
      updateHandler={handleUpdateWarehouse}
      transformPayload={transformToBackendFormat}
    />
  );
};

export default ViewWarehouses;