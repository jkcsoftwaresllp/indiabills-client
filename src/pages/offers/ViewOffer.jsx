import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { deleteRow } from "../../network/api";

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
  { field: "offerId", headerName: "ID", width: 50, cellRenderer: (params) => (<p><span className="text-blue-950">#</span><span className="font-medium">{params.value}</span></p>) },
  { field: "offerName", headerName: "Offer Name", filter: true, editable: true, cellStyle: { textTransform: 'capitalize' } },
  { field: "description", headerName: "Description", cellStyle: { textTransform: 'capitalize' } },
  { field: "startDate", headerName: "Start Date", valueFormatter: (p) => formatDate(p.value) },
  { field: "endDate", headerName: "End Date", valueFormatter: (p) => formatDate(p.value) },
  { field: "discount", headerName: "Discount" },
  { field: "maximumDiscount", headerName: "Maximum Discount" },
  { field: "minimumPurchase", headerName: "Minimum Purchase" },
  { field: "offerApplicabilityFrequency", headerName: "Offer Applicability Frequency" },
  { field: "status", headerName: "Status" },
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
        console.log(`Inspecting ${data?.offerId}`);
        navigate(`/offers/${data?.offerId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteRow(`offers/delete/${data?.offerId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.offerId);
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
    <ViewData menuOptions={menuOptions} title="Offers" url="/offers" initialColDefs={colDefs} />
  );
};

export default ViewProducts;
