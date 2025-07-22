import React from "react";
import { useState, useEffect } from "react";
import ViewData from "../../layouts/form/ViewData";
import { useNavigate } from "react-router-dom";
import { deleteRow, getData, addRow } from "../../network/api";
import { useStore } from "../../store/store";
import serverInstance from "../../network/api/api-config";
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
    field: "wishlist",
    headerName: "Wishlist",
    width: 100,
    cellRenderer: (params) => (
      <WishlistButton
        productId={params.data.itemId}
        isInWishlist={params.data.isInWishlist || false}
        onToggle={params.context.onWishlistToggle}
      />
    ),
    sortable: false,
    filter: false,
  },
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
        hsn: "85183000",
        packSize: 1,
        dateAdded: "2024-01-15",
        addedBy: "Admin",
        lastEditedDate: "2024-01-20",
        lastEditedBy: "Admin",
        isInWishlist: false
      },
      {
        itemId: 2,
        itemName: "Gaming Mouse",
        description: "Ergonomic gaming mouse with RGB lighting",
        category: "Electronics",
        currentQuantity: 50,
        dimensions: "12x7x4 cm",
        weight: 120,
        manufacturer: "GameTech",
        salePrice: 1499,
        purchasePrice: 1000,
        unitMRP: 1799,
        reorderLevel: 15,
        loadingPrice: 25,
        unloadingPrice: 15,
        marketer: "GameTech Solutions",
        ongoingOffer: null,
        cgst: 9,
        sgst: 9,
        cess: 0,
        upc: "123456789013",
        hsn: "84716070",
        packSize: 1,
        dateAdded: "2024-01-10",
        addedBy: "Admin",
        lastEditedDate: "2024-01-18",
        lastEditedBy: "Operator",
        isInWishlist: true
      },
      {
        itemId: 3,
        itemName: "Organic Green Tea",
        description: "Premium organic green tea leaves",
        category: "Food",
        currentQuantity: 100,
        dimensions: "15x10x5 cm",
        weight: 200,
        manufacturer: "TeaGarden Co.",
        salePrice: 299,
        purchasePrice: 200,
        unitMRP: 349,
        reorderLevel: 20,
        loadingPrice: 10,
        unloadingPrice: 5,
        marketer: "TeaGarden India",
        ongoingOffer: "Buy 2 Get 1 Free",
        cgst: 2.5,
        sgst: 2.5,
        cess: 0,
        upc: "123456789014",
        hsn: "09021000",
        packSize: 1,
        dateAdded: "2024-01-05",
        addedBy: "Admin",
        lastEditedDate: "2024-01-12",
        lastEditedBy: "Admin",
        isInWishlist: false
      },
      {
        itemId: 4,
        itemName: "Cotton T-Shirt",
        description: "100% cotton comfortable t-shirt",
        category: "Clothing",
        currentQuantity: 75,
        dimensions: "30x25x2 cm",
        weight: 180,
        manufacturer: "FashionHub",
        salePrice: 599,
        purchasePrice: 400,
        unitMRP: 799,
        reorderLevel: 25,
        loadingPrice: 20,
        unloadingPrice: 10,
        marketer: "FashionHub Retail",
        ongoingOffer: null,
        cgst: 6,
        sgst: 6,
        cess: 0,
        upc: "123456789015",
        hsn: "61091000",
        packSize: 1,
        dateAdded: "2024-01-08",
        addedBy: "Operator",
        lastEditedDate: "2024-01-16",
        lastEditedBy: "Operator",
        isInWishlist: true
      },
      {
        itemId: 5,
        itemName: "Smartphone Case",
        description: "Protective case for smartphones",
        category: "Accessories",
        currentQuantity: 200,
        dimensions: "16x8x1 cm",
        weight: 50,
        manufacturer: "ProtectTech",
        salePrice: 199,
        purchasePrice: 120,
        unitMRP: 249,
        reorderLevel: 30,
        loadingPrice: 5,
        unloadingPrice: 3,
        marketer: "ProtectTech India",
        ongoingOffer: "20% Off",
        cgst: 9,
        sgst: 9,
        cess: 0,
        upc: "123456789016",
        hsn: "39269099",
        packSize: 1,
        dateAdded: "2024-01-12",
        addedBy: "Admin",
        lastEditedDate: "2024-01-19",
        lastEditedBy: "Admin",
        isInWishlist: false
      }
    ];

    return demoData;
  //   try {
  //     const response = await getData('/ops/sales/portal/customer/products');
  //     if (response.success) {
  //       // Add wishlist status to each product
  //       const productsWithWishlist = response.data.map(product => ({
  //         ...product,
  //         isInWishlist: wishlistItems.has(product.itemId)
  //       }));
  //       return productsWithWishlist;
  //     } else {
  //       throw new Error('API failed');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     try {
  //     } catch (fallbackError) {
  //       console.error('APIs failed, using demo data:', fallbackError);
  //       return demoData.map(product => ({
  //         ...product,
  //         isInWishlist: wishlistItems.has(product.itemId)
  //       }));
  //     }
  //   }
  };

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
      customDataFetcher={customDataFetcher}
      initialColDefs={colDefs}
      context={{
        onWishlistToggle: handleWishlistToggle
      }}
    />
  );
};

export default ViewProducts;
