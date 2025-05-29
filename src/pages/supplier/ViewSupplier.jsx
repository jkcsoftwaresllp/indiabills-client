import React from "react";
import ViewData from "../../layouts/form/ViewData";
import Rating from '@mui/material/Rating';
import { deleteRow } from "../../network/api";
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
  { field: "supplierId", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "supplierName", headerName: "Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "ratings", headerName: "Ratings", editable: true, cellRenderer: RatingCellRenderer },
  { field: "businessName", headerName: "Business", editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "mobileNumber", headerName: "Mobile", editable: true },
  { field: "alternateMobileNumber", headerName: "Alternate Mobile", editable: true },
  { field: "email", headerName: "Email" },
  { field: "addressLine1", headerName: "Address Line 1" },
  { field: "addressLine2", headerName: "Address Line 2" },
  { field: "city", headerName: "City" },
  { field: "state", headerName: "State" },
  { field: "pinCode", headerName: "Pin Code" },
  { field: "beneficiaryName", headerName: "Beneficiary Name", cellStyle: { textTransform: 'capitalize' } },
  { field: "accountNumber", headerName: "Account Number" },
  { field: "ifscCode", headerName: "IFSC Code" },
  { field: "virtualPaymentAddress", headerName: "Virtual Payment Address" },
  { field: "remarks", headerName: "Remarks", editable: true },
  { field: "dateAdded", headerName: "Date Added" },
  { field: "addedBy", headerName: "Added By" },
  { field: "lastEditedDate", headerName: "Last Edited Date" },
  { field: "lastEditedBy", headerName: "Last Edited By" },
];

const ViewProducts = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting ${data?.supplierId}`);
        navigate(`/suppliers/${data?.supplierId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteRow(`suppliers/soft/${data?.supplierId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.supplierId);
            navigate("/suppliers");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        });
      },
    },
  ];

  return (
    <ViewData menuOptions={menuOptions} title="Suppliers" url="/suppliers" initialColDefs={colDefs} />
  );
};

export default ViewProducts;
