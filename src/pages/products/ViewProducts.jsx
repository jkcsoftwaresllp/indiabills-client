import React from "react";
import { useState, useEffect } from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, getData, addRow } from "../../network/api";
import { useStore } from "../../store/store";
import { IconButton, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

// Wishlist button component
const WishlistButton = ({ productId, isInWishlist, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const { successPopup, errorPopup } = useStore();

  const handleToggle = async () => {
    setLoading(true);
    // try {
    //   if (isInWishlist) {
    //     const response = await deleteRow(`/ops/sales/portal/customer/wishlist/${productId}`, {});
    //     if (response === 200) {
    //       successPopup('Removed from wishlist');
    //       onToggle(productId, false);
    //     } else {
    //       errorPopup('Failed to remove from wishlist');
    //     }
    //   } else {
    //     const response = await addRow('/ops/sales/portal/customer/wishlist', { productId });
    //     if (response === 200 || response === 201) {
    //       successPopup('Added to wishlist');
    //       onToggle(productId, true);
    //     } else {
    //       errorPopup('Failed to add to wishlist');
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error toggling wishlist:', error);
    //   errorPopup('Failed to update wishlist');
    // }
    setLoading(false);
  };

  return (
    <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
      <IconButton 
        onClick={handleToggle} 
        disabled={loading}
        color={isInWishlist ? "error" : "default"}
      >
        {isInWishlist ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
    </Tooltip>
  );
};

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
  { field: "isActive", headerName: "Status", cellRenderer: (params) => (
    <span className={`py-1 px-3 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {params.value ? 'Active' : 'Inactive'}
    </span>
  )},
  { field: "createdAt", headerName: "Created At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: "updatedAt", headerName: "Updated At", valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
];

const ViewProducts = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup, refreshTableSetId } = useStore();
  const [wishlistItems, setWishlistItems] = useState(new Set());

  // Fetch wishlist items on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await getData('/ops/sales/portal/customer/wishlist');
      if (response.success && response.data) {
        const wishlistIds = new Set(response.data.map(item => item.id || item.productId));
        setWishlistItems(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleWishlistToggle = (productId, isInWishlist) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (isInWishlist) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  // Custom data fetcher that uses the new backend API
  const customDataFetcher = async () => {
    // Demo data for testing
    const demoData = [
      {
        itemId: 1,
        itemName: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        category: "Electronics",
        currentQuantity: 25,
        dimensions: "20x15x8 cm",
        weight: 250,
        manufacturer: "TechCorp",
        salePrice: 2999,
        purchasePrice: 2000,
        unitMRP: 3499,
        reorderLevel: 10,
        loadingPrice: 50,
        unloadingPrice: 30,
        marketer: "TechCorp India",
        ongoingOffer: "10% Off",
        cgst: 9,
        sgst: 9,
        cess: 0,
        upc: "123456789012",
      }
    ]
  }
  return (
    <ViewData
      menuOptions={menuOptions}
      title="Items"
      customDataFetcher={getProducts}
      initialColDefs={colDefs}
    />
  );
};

export default ViewProducts;
