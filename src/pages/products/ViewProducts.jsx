import { FiPlus } from 'react-icons/fi';
import React, { useState, useEffect } from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, toggleWishlist, getWishlist } from "../../network/api";
import { useStore } from "../../store/store";
import { IconButton, Tooltip } from "@mui/material";

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
    field: "category_id",
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
    field: "sale_price",
    headerName: "Sale Price",
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "purchase_price",
    headerName: "Purchase Price",
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "unit_mrp",
    headerName: "Unit MRP",
    cellClassRules: { money: (p) => p.value },
  },
  { field: "reorder_level", headerName: "Reorder Level", editable: true },
  { field: "max_stock_level", headerName: "Max Stock Level", editable: true },
  { field: "unit_of_measure", headerName: "Unit of Measure" },
  {
    field: "is_active",
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
    field: "created_at",
    headerName: "Created At",
    valueFormatter: ({ value }) =>
      value ? new Date(value).toLocaleDateString() : "—",
  },
  {
    field: "wishlist",
    headerName: "Wishlist",
    width: 120,
    cellRenderer: (params) => (
      <Tooltip title={params.value ? "Remove from Wishlist" : "FiPlus to Wishlist"}>
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
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    const response = await getWishlist();
    if (response.status === 200 && Array.isArray(response.data)) {
      const wishlistIds = new Set(response.data.map(item => item.id));
      setWishlistItems(wishlistIds);
    }
  };

  const fetchWishlist = async () => {
    const response = await getProducts();
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.map((product) => ({
        ...product,
        wishlist: wishlistItems.has(product.id),
        onWishlistToggle: handleWishlistToggle,
      }));
    }
    return [];
  };

  const handleWishlistToggle = async (product) => {
    const result = await toggleWishlist(product.id);
    if (result.status === 200) {
      setWishlistItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(product.id)) {
          newSet.delete(product.id);
        } else {
          newSet.add(product.id);
        }
        return newSet;
      });
      successPopup(result.data?.message || 'Wishlist updated');
    } else {
      errorPopup('Failed to update wishlist');
    }
  };

  return (
    <ViewData
      title="Items"
      customDataFetcher={getProducts}
      initialColDefs={colDefs}
      deleteHandler={deleteProduct}
      transformPayload={(data) => ({
        // ensure outgoing payload matches backend format
        id: data.id || 0,
        organization_id: data.organization_id || 0,
        name: data.name || "",
        description: data.description || "",
        category_id: data.category_id || 0,
        manufacturer: data.manufacturer || "",
        brand: data.brand || "",
        barcode: data.barcode || "",
        dimensions: data.dimensions || "",
        weight: Number(data.weight) || 0,
        unit_mrp: Number(data.unit_mrp) || 0,
        purchase_price: Number(data.purchase_price) || 0,
        sale_price: Number(data.sale_price) || 0,
        reorder_level: Number(data.reorder_level) || 0,
        unit_of_measure: data.unit_of_measure || "",
        max_stock_level: Number(data.max_stock_level) || 0,
        is_active: Boolean(data.is_active),
        version: data.version || 0,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: data.created_by || 0,
        updated_by: data.updated_by || 0,
      })}
    />
  );
};

export default ViewProducts;
