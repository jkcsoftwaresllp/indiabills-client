import React, { useState, useEffect } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useStore } from "../../store/store";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Tooltip from "@mui/material/Tooltip";
import { Chip, Divider, Typography, Card, CardContent } from "@mui/material";

const ProductCard = ({ product }) => {
  const {
    selectedProducts,
    selectProduct,
    removeSelectedProduct,
  } = useStore();

  const formatNumber = (num) => {
    return num % 1 === 0 ? num.toString() : (Number(num) || 0).toFixed(2);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsInCart(!!selectedProducts[product.itemId]);
    if (selectedProducts[product.itemId]) {
      setQuantity(selectedProducts[product.itemId].quantity || 1);
      setSelectedVariants(selectedProducts[product.itemId]);
    } else {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [selectedProducts, product.itemId]);

  const handleAddToCartClick = () => {
    setIsModalOpen(true);
  };

  const handleVariantClick = (key, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const handleConfirm = () => {
    if (quantity === 0) {
      setError(
        "Quantity cannot be zero. To remove the product, use the Remove button."
      );
      return;
    }
    setError("");
    selectProduct(product, { ...selectedVariants, quantity });
    setIsModalOpen(false);
    setIsInCart(true);
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setError("Quantity cannot be negative.");
      return;
    } else if (value === 0) {
      setQuantity(0);
      setError(
        "Cannot proceed with 0 as quantity. To remove the product, use the Remove button."
      );
    } else if (value > product.currentQuantity) {
      setError("Quantity exceeds available stock!");
      setQuantity(selectedProducts[product.itemId]?.quantity || 1);
    } else {
      setError("");
      setQuantity(value);
    }
  };

  const handleRemove = () => {
    removeSelectedProduct(product.itemId);
    setIsInCart(false);
    setIsModalOpen(false);
    setQuantity(1);
    setSelectedVariants({});
    setError("");
  };

  const getTax = () => {
    const cgst = Number(product.cgst) || 0;
    const sgst = Number(product.sgst) || 0;
    const gst = cgst + sgst;
    const salePrice = Number(product.salePrice) || 0;
    const taxAmount = (gst * salePrice) / 100;
    return salePrice + taxAmount;
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isLowStock = (quantity) => {
    return quantity <= (product.reorderLevel || 5);
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Typography variant="h5" className="font-bold capitalize mb-1">
              {product.itemName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.manufacturer}
            </Typography>
          </div>
          <div className="flex flex-col items-end">
            <Typography variant="h6" className="text-green-600 font-bold">
              ₹{formatNumber(product.salePrice)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Inc. GST
            </Typography>
          </div>
        </div>

        <Divider className="my-3" />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <InventoryIcon className="text-gray-500" />
            <div>
              <Typography variant="body2" color="textSecondary">
                In Stock
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {product.currentQuantity}
                {isLowStock(product.currentQuantity) && (
                  <Chip
                    label="Low Stock"
                    size="small"
                    color="warning"
                    className="ml-2"
                  />
                )}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarTodayIcon className="text-gray-500" />
            <div>
              <Typography variant="body2" color="textSecondary">
                Expiry
              </Typography>
              <Typography variant="body1" className="font-semibold">
                {product.expiryDate ? (
                  <>
                    {new Date(product.expiryDate).toLocaleDateString()}
                    {isExpiringSoon(product.expiryDate) && (
                      <Chip
                        label="Expiring Soon"
                        size="small"
                        color="error"
                        className="ml-2"
                      />
                    )}
                  </>
                ) : (
                  "No Expiry"
                )}
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <Typography variant="body2" className="mb-2 flex items-center gap-1">
            <InfoIcon fontSize="small" />
            Details
          </Typography>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Dimensions</div>
            <div className="text-right">{product.dimensions || "-"}</div>
            {product.packSize > 1 && (
              <>
                <div className="text-gray-600">Pack Size</div>
                <div className="text-right">{product.packSize}</div>
              </>
            )}
            <div className="text-gray-600">Weight</div>
            <div className="text-right">{product.weight}g</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant={isInCart ? "contained" : "outlined"}
            color={isInCart ? "success" : "primary"}
            startIcon={isInCart ? <ShoppingBagIcon /> : null}
            onClick={handleAddToCartClick}
            fullWidth
          >
            {isInCart ? "Update Cart" : "Add to Cart"}
          </Button>
          {isInCart && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemove}
              fullWidth
            >
              Remove
            </Button>
          )}
        </div>
      </CardContent>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-96">
          <Typography variant="h6" className="mb-4">
            {product.itemName}
          </Typography>

          {product.variants?.map((variant, index) => (
            <div key={index} className="mb-4">
              <Typography variant="subtitle2" className="mb-2">
                {variant.key}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {variant.values.filter(Boolean).map((value, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    variant={
                      selectedVariants[variant.key] === value
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleVariantClick(variant.key, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              Quantity (Max: {product.currentQuantity})
            </Typography>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              error={!!error}
              inputProps={{ min: 0, max: product.currentQuantity }}
            />
            {error && (
              <Typography color="error" variant="caption" className="mt-1">
                {error}
              </Typography>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={quantity === 0}
              fullWidth
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </Card>
  );
};

export default ProductCard;
