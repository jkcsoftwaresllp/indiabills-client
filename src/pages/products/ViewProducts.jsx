import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  toggleWishlist,
  getWishlist,
} from "../../network/api";
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
    field: "category_id",
    headerName: "Category",
    editable: true,
  },
  {
    field: "barcode",
    headerName: "Barcode",
    editable: true,
  },
  {
    field: "brand",
    headerName: "Brand",
    editable: true,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "dimensions",
    headerName: "Dimensions",
    editable: true,
  },
  {
    field: "weight",
    headerName: "Weight (g)",
    editable: true,
  },
  {
    field: "manufacturer",
    headerName: "Manufacturer",
    editable: true,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "purchase_price",
    headerName: "Purchase Price",
    editable: true,
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "sale_price",
    headerName: "sale Price",
    editable: true,
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "unit_mrp",
    headerName: "Unit MRP",
    editable: true,
    cellClassRules: { money: (p) => p.value },
  },
  {
    field: "reorder_level",
    headerName: "Reorder Level",
    editable: true,
  },
  {
    field: "max_stock_level",
    headerName: "Max Stock Level",
    editable: true,
  },
  {
    field: "unit_of_measure",
    headerName: "Unit of Measure",
    editable: true,
  },
  {
    field: "hsn",
    headerName: "HSN",
    editable: true,
  },
  {
    field: "upc",
    headerName: "UPC",
    editable: true,
  },
  {
    field: "cgst",
    headerName: "CGST %",
    editable: true,
  },
  {
    field: "sgst",
    headerName: "SGST %",
    editable: true,
  },
  {
    field: "cess",
    headerName: "Cess %",
    editable: true,
  },
  {
    field: "is_active",
    headerName: "Status",
    cellRenderer: (params) => (
      <span
        className={`py-1 px-3 rounded-full text-xs ${
          params.value
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
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
      <Tooltip
        title={params.value ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <IconButton
          size="small"
          onClick={() => params.data.onWishlistToggle(params.data)}
        >
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

  // Transform frontend data (snake_case) to backend format (camelCase)
  const transformToBackendFormat = (data) => {
    return {
      name: data.name,
      description: data.description,
      categoryId: data.category_id,
      manufacturer: data.manufacturer,
      brand: data.brand,
      barcode: data.barcode,
      dimensions: data.dimensions,
      weight: data.weight ? parseFloat(data.weight) : 0,
      unitMrp: data.unit_mrp ? parseFloat(data.unit_mrp) : 0,
      purchasePrice: data.purchase_price ? parseFloat(data.purchase_price) : 0,
      salePrice: data.sale_price ? parseFloat(data.sale_price) : 0,
      reorderLevel: data.reorder_level ? parseInt(data.reorder_level, 10) : 0,
      unitOfMeasure: data.unit_of_measure,
      maxStockLevel: data.max_stock_level
        ? parseInt(data.max_stock_level, 10)
        : 0,
      isActive: Boolean(data.is_active),
      hsn: data.hsn,
      upc: data.upc,
      taxes: {
        cgst: data.cgst ? parseFloat(data.cgst) : null,
        sgst: data.sgst ? parseFloat(data.sgst) : null,
        cess: data.cess ? parseFloat(data.cess) : null,
      },
    };
  };

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    const response = await getWishlist();
    if (response.status === 200 && Array.isArray(response.data)) {
      const wishlistIds = new Set(response.data.map((item) => item.id));
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
      successPopup(result.data?.message || "Wishlist updated");
    } else {
      errorPopup("Failed to update wishlist");
    }
  };

  // Update handler for products
  const handleUpdateProduct = async (id, data) => {
    return await updateProduct(id, data);
  };

  return (
    <ViewData
      title="Items"
      idField="id"
      customDataFetcher={getProducts}
      initialColDefs={colDefs}
      deleteHandler={deleteProduct}
      updateHandler={handleUpdateProduct}
      transformPayload={transformToBackendFormat}
    />
  );
};

export default ViewProducts;
