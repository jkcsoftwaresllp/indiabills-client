import React from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { deleteRow } from "../../network/api";
import { useStore } from "../../store/store";

const colDefs = [
  {
    field: "itemId",
    headerName: "ID",
    width: 50,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ),
  },
  {
    field: "itemName",
    headerName: "Item",
    width: 270,
    filter: true,
    editable: true,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "description",
    headerName: "Description",
    editable: true,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "category",
    headerName: "Category",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [
        "Electronics",
        "Gadgets",
        "Sports",
        "Home Decorations",
        "Toys",
        "Clothing",
        "Accessories",
        "Gaming",
        "Food",
      ],
    },
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "currentQuantity",
    headerName: "Current Quantity",
    cellRenderer: (params) => <p>{params.value ? params.value : "0"}</p>,
  },
  { field: "dimensions", headerName: "Dimensions" },
  { field: "weight", headerName: "Weight (g)" },
  {
    field: "manufacturer",
    headerName: "Manufacturer",
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "salePrice",
    headerName: "Sale Price",
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "purchasePrice",
    headerName: "Purchase Price",
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "unitMRP",
    headerName: "Unit MRP",
    cellClassRules: { money: (p) => p.value },
  },
  { field: "reorderLevel", headerName: "Reorder Level", editable: true },
  { field: "loadingPrice", headerName: "Loading Price", editable: true },
  { field: "unloadingPrice", headerName: "Unloading Price" },
  { field: "marketer", headerName: "Marketer" },
  { field: "ongoingOffer", headerName: "Ongoing Offer" },
  { field: "cgst", headerName: "CGST", editable: true },
  { field: "sgst", headerName: "SGST", editable: true },
  { field: "cess", headerName: "CESS", editable: true },
  { field: "upc", headerName: "UPC" },
  { field: "hsn", headerName: "HSN" },
  { field: "packSize", headerName: "Pack Size", editable: true },
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
        console.log(`Inspecting ${data?.itemId}`);
        navigate(`/products/${data?.itemId}`);
      },
    },
    {
      label: "Delete",
      onClick: (data) => {
        deleteRow(`products/soft/${data?.itemId}`).then((response) => {
          if (response === 200) {
            successPopup("Deleted successfully");
            refreshTableSetId(data?.itemId);
            navigate("/products");
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
      title="Items"
      url="/products"
      initialColDefs={colDefs}
    />
  );
};

export default ViewProducts;
