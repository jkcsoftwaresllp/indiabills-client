import React, { useState, useEffect } from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, getData } from "../../network/api";
import { useStore } from "../../store/store";
import { IconButton, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

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
    ),
  },
  {
    field: "name",
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
    field: "categoryID",
    headerName: "Category",
    editable: true,
  },
  {
    field: "barcode",
    headerName: "Barcode",
  },
  {
    field: "brand",
    headerName: "Brand",
    cellStyle: { textTransform: "capitalize" },
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
  { field: "maxStockLevel", headerName: "Max Stock Level", editable: true },
  { field: "unitOfMeasure", headerName: "Unit of Measure" },
  {
    field: "isActive",
    headerName: "Status",
    cellRenderer: (params) => (
      <span
        className={`py-1 px-3 rounded-full text-xs ${
          params.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {params.value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
  },
  {
    field: "wishlist",
    headerName: "Wishlist",
    width: 120,
    cellRenderer: (params) => (
      <Tooltip title={params.value ? "Remove from Wishlist" : "Add to Wishlist"}>
        <IconButton size="small" onClick={() => params.data.onWishlistToggle(params.data)}>
          {params.value ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Tooltip>
    ),
  },
];

const ViewProducts = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const response = await getProducts();
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map((product) => ({
        ...product,
        wishlist: wishlistItems.has(product.id),
        onWishlistToggle: handleWishlistToggle, // pass handler down
      }));
    }
    return [];
  };

  const handleWishlistToggle = (product) => {
    setWishlistItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(product.id)) {
        newSet.delete(product.id);
      } else {
        newSet.add(product.id);
      }
      return newSet;
    });
  };

  return (
    <ViewData
      title="Items"
      customDataFetcher={getProducts}
      initialColDefs={colDefs}
    />
  );
};

export default ViewProducts;
