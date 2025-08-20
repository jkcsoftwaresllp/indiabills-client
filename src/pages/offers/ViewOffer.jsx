import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { getOffers, deleteOffer } from "../../network/api";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const colDefs = [
  { field: "id", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "name", headerName: "Offer Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "description", headerName: "Description", cellStyle: { textTransform: 'capitalize' } },
  { field: "offerType", headerName: "Offer Type", cellStyle: { textTransform: 'capitalize' } },
  { field: "discountType", headerName: "Discount Type", cellStyle: { textTransform: 'capitalize' } },
  { field: "discountValue", headerName: "Discount Value" },
  { field: "maxDiscountAmount", headerName: "Max Discount Amount", cellClassRules: { money: (p) => p.value } },
  { field: "minOrderAmount", headerName: "Min Order Amount", cellClassRules: { money: (p) => p.value } },
  { field: "startDate", headerName: "Start Date", valueFormatter: (p) => formatDate(p.value) },
  { field: "endDate", headerName: "End Date", valueFormatter: (p) => formatDate(p.value) },
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewOffers = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();

  const menuOptions = [
    {
      label: "Inspect",
      onClick: (data) => {
        console.log(`Inspecting ${data?.id}`);
        navigate(`/offers/${data?.id}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteOffer(data?.id).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.id);
            navigate("/offers");
          } else {
            errorPopup("Failed to delete");
            console.error("Failed to delete");
          }
        });
      }
    }
  ];

  return (
    <ViewData 
      menuOptions={menuOptions} 
      title="Offers" 
      customDataFetcher={getOffers}
      initialColDefs={colDefs} 
    />
  );
};

