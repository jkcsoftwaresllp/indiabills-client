import ViewData from "../../layouts/form/ViewData";
import Rating from '@mui/material/Rating';
import { getSuppliers, deleteSupplier, updateSupplier } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const RatingCellRenderer = (params) => {
  return (
    <div className="w-full h-full flex items-center">
      <Rating
        name="rating"
        value={Number(params.value)}
        readOnly
        precision={0.5}
      />
    </div>
  );
};

const colDefs = [
  { field: "id", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "rating", headerName: "Rating", editable: true, cellRenderer: RatingCellRenderer },
  { field: "businessName", headerName: "Business", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "contactPerson", headerName: "Contact Person", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "phone", headerName: "Phone", editable: true },
  { field: "alternatePhone", headerName: "Alternate Phone", editable: true },
  { field: "email", headerName: "Email", editable: true },
  { field: "addressLine", headerName: "Address", editable: true },
  { field: "city", headerName: "City", editable: true },
  { field: "state", headerName: "State", editable: true },
  { field: "pinCode", headerName: "Pin Code", editable: true },
  { field: "gstin", headerName: "GSTIN", editable: true },
  { field: "bankAccountNumber", headerName: "Account Number", editable: true },
  { field: "ifscCode", headerName: "IFSC Code", editable: true },
  { field: "upiId", headerName: "UPI ID", editable: true },
  { field: "creditLimit", headerName: "Credit Limit", editable: true, cellClassRules: { money: (p) => p.value } },
  { field: "paymentTerms", headerName: "Payment Terms", editable: true },
  { field: "remarks", headerName: "Remarks", editable: true },
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewSuppliers = () => {
  // Transform frontend data (camelCase) to backend format (snake_case)
  const transformToBackendFormat = (data) => {
    return {
      name: data.name,
      business_name: data.businessName,
      contact_person: data.contactPerson,
      phone: data.phone,
      alternate_phone: data.alternatePhone,
      email: data.email,
      address_line: data.addressLine,
      city: data.city,
      state: data.state,
      pin_code: data.pinCode,
      gstin: data.gstin,
      bank_account_number: data.bankAccountNumber,
      ifsc_code: data.ifscCode,
      upi_id: data.upiId,
      credit_limit: data.creditLimit ? parseFloat(data.creditLimit) : 0,
      payment_terms: data.paymentTerms,
      remarks: data.remarks,
      rating: data.rating ? parseFloat(data.rating) : 0,
      is_active: Boolean(data.isActive),
    };
  };

  // Update handler for suppliers
  const handleUpdateSupplier = async (id, data) => {
    return await updateSupplier(id, data);
  };

  return (
    <ViewData 
      title="Suppliers" 
      url="/suppliers"
      idField="id"
      customDataFetcher={getSuppliers}
      initialColDefs={colDefs}
      deleteHandler={deleteSupplier}
      updateHandler={handleUpdateSupplier}
      transformPayload={transformToBackendFormat}
    />
  );
};

export default ViewSuppliers;