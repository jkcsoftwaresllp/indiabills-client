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
import styles from './styles/ProductCard.module.css';

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
  <Card className={`${styles.card} ${styles.cardHover}`}>
    <CardContent className={styles.cardContent}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Typography variant="h5" className={styles.title}>
            {product.itemName}
          </Typography>
          <Typography variant="body2" color="textSecondary" className={styles.subtitle}>
            {product.manufacturer}
          </Typography>
        </div>
        <div className={styles.priceContainer}>
          <Typography variant="h6" className={styles.price}>
            ₹{formatNumber(product.salePrice)}
          </Typography>
          <Typography variant="caption" color="textSecondary" className={styles.caption}>
            Inc. GST
          </Typography>
        </div>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.gridTwoCols}>
        <div className={styles.flexGap2}>
          <InventoryIcon className={styles.iconGray} />
          <div>
            <Typography variant="body2" color="textSecondary">
              In Stock
            </Typography>
            <Typography variant="body1" className="font-semibold">
              {product.currentQuantity}
              {isLowStock(product.currentQuantity) && (
                <Chip label="Low Stock" size="small" color="warning" className="ml-2" />
              )}
            </Typography>
          </div>
        </div>
        <div className={styles.flexGap2}>
          <CalendarTodayIcon className={styles.iconGray} />
          <div>
            <Typography variant="body2" color="textSecondary">
              Expiry
            </Typography>
            <Typography variant="body1" className="font-semibold">
              {product.expiryDate ? (
                <>
                  {new Date(product.expiryDate).toLocaleDateString()}
                  {isExpiringSoon(product.expiryDate) && (
                    <Chip label="Expiring Soon" size="small" color="error" className="ml-2" />
                  )}
                </>
              ) : (
                'No Expiry'
              )}
            </Typography>
          </div>
        </div>
      </div>

      <div className={styles.detailsBox}>
        <Typography variant="body2" className={styles.detailsTitle}>
          <InfoIcon fontSize="small" />
          Details
        </Typography>
        <div className={styles.detailsGrid}>
          <div className={styles.detailsLabel}>Dimensions</div>
          <div className={styles.detailsValue}>{product.dimensions || '-'}</div>
          {product.packSize > 1 && (
            <>
              <div className={styles.detailsLabel}>Pack Size</div>
              <div className={styles.detailsValue}>{product.packSize}</div>
            </>
          )}
          <div className={styles.detailsLabel}>Weight</div>
          <div className={styles.detailsValue}>{product.weight}g</div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          variant={isInCart ? 'contained' : 'outlined'}
          color={isInCart ? 'success' : 'primary'}
          startIcon={isInCart ? <ShoppingBagIcon /> : null}
          onClick={handleAddToCartClick}
          fullWidth
        >
          {isInCart ? 'Update Cart' : 'Add to Cart'}
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
      <Box className={styles.modalBox}>
        <Typography variant="h6" className={styles.modalTitle}>
          {product.itemName}
        </Typography>

        {product.variants?.map((variant, index) => (
          <div key={index} className={styles.variantSection}>
            <Typography variant="subtitle2" className={styles.variantTitle}>
              {variant.key}
            </Typography>
            <div className={styles.variantButtons}>
              {variant.values
                .filter(Boolean)
                .map((value, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    variant={selectedVariants[variant.key] === value ? 'contained' : 'outlined'}
                    onClick={() => handleVariantClick(variant.key, value)}
                  >
                    {value}
                  </Button>
                ))}
            </div>
          </div>
        ))}

        <div className={styles.quantitySection}>
          <Typography variant="subtitle2" className={styles.quantityTitle}>
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
            <Typography color="error" variant="caption" className={styles.errorText}>
              {error}
            </Typography>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button variant="outlined" onClick={() => setIsModalOpen(false)} fullWidth>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm} disabled={quantity === 0} fullWidth>
            Confirm
          </Button>
        </div>
      </Box>
    </Modal>
  </Card>
);
};

export default ProductCard;
