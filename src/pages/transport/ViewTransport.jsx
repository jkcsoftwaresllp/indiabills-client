import ViewData from "../../layouts/form/ViewData";
import { getTransportPartners, deleteTransportPartner, updateTransportPartner } from "../../network/api";
import { getOption } from "../../utils/FormHelper";

const stateOptions = getOption("state").map((state) => ({
  label: state,
  value: state,
}));

const colDefs = [
  { field: "id", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Transport Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "businessName", headerName: "Business Name", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "vehicleDetails", headerName: "Vehicle Details", editable: true },
  { field: "email", headerName: "Email", editable: true },
  { field: "phone", headerName: "Phone", editable: true },
  { field: "alternatePhone", headerName: "Alternate Phone", editable: true },
  { field: "contactPerson", headerName: "Contact Person", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "addressLine", headerName: "Address", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "city", headerName: "City", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "state", headerName: "State", editable: true, cellStyle: { textTransform: 'capitalize' }, options: stateOptions },
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
  // Transform frontend data (camelCase) to backend format (snake_case)
  const transformToBackendFormat = (data) => {
    return {
      name: data.name,
      business_name: data.businessName,
      vehicle_details: data.vehicleDetails,
      email: data.email,
      phone: data.phone,
      alternate_phone: data.alternatePhone,
      contact_person: data.contactPerson,
      address_line: data.addressLine,
      city: data.city,
      state: data.state,
      pin_code: data.pinCode,
      gst_number: data.gstNumber,
      pan_number: data.panNumber,
      base_rate: data.baseRate ? parseFloat(data.baseRate) : 0,
      rate_per_km: data.ratePerKm ? parseFloat(data.ratePerKm) : 0,
      is_active: Boolean(data.isActive),
    };
  };

  // Update handler for transport partners
  const handleUpdateTransport = async (id, data) => {
    return await updateTransportPartner(id, data);
  };

  return (
    <ViewData
      title="Transport"
      url="/transport"
      idField="id"
      customDataFetcher={getTransportPartners}
      initialColDefs={colDefs}
      deleteHandler={deleteTransportPartner}
      updateHandler={handleUpdateTransport}
      transformPayload={transformToBackendFormat}
    />
  );
};

export default ViewTransport;