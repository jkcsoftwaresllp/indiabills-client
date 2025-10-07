import Modal from "../../components/InventoryComponents/Modal";
import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Grid,
  InputAdornment,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { formatToIndianCurrency } from "../../utils/FormHelper";

const ProductModal = ({
  open,
  handleClose,
  products,
  handleAddProduct,
  selectedProducts,
  handleRemoveProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleDiscountChange = (event) => {
    setDiscount(parseFloat(event.target.value));
  };

  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.checked ? "value" : "percentage");
  };

  const handleManufactureDateChange = (event) => {
    setManufactureDate(event.target.value);
    if (expiryDate && new Date(event.target.value) > new Date(expiryDate)) {
      setExpiryDateError("Expiry date cannot be before manufacture date");
    } else {
      setExpiryDateError("");
    }
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);
    if (
      manufactureDate &&
      new Date(event.target.value) < new Date(manufactureDate)
    ) {
      setExpiryDateError("Expiry date cannot be before manufacture date");
    } else {
      setExpiryDateError("");
    }
  };

  const handleAdd = () => {
    if (selectedProduct && !expiryDateError) {
      handleAddProduct({
        itemId: selectedProduct.id.toString(),
        itemName: selectedProduct.name,
        quantity,
        discount,
        discountType,
        packSize: selectedProduct.packSize,
        recordUnitPrice: selectedProduct.purchaseRate,
        manufactureDate,
        expiryDate,
      });
      setSelectedProduct(null);
      setQuantity(1);
      setDiscount(0);
      setManufactureDate("");
      setExpiryDate("");
      handleClose();
    }
  };

  const totalPrice = selectedProduct
    ? selectedProduct.purchaseRate * quantity
    : 0;

  const discountedPrice =
    discountType === "percentage"
      ? totalPrice - (totalPrice * (discount || 0)) / 100
      : totalPrice - (discount || 0);

  return (
    <Modal
      title={"Add Products to Batch"}
      handleClose={handleClose}
      open={open}
      submit={handleAdd}
    >
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id={"pro"}
              options={products}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedProduct}
              onChange={handleProductChange}
              renderInput={(params) => (
                <TextField {...params} label={"Product"} fullWidth />
              )}
            />
          </Grid>
          {selectedProduct && (
            <>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Pack Size: {selectedProduct.packSize}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Price per Pack: ₹
                  {formatToIndianCurrency(
                    (selectedProduct.purchasePrice || selectedProduct.purchaseRate || 0).toFixed(2)
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Total Price (before discount):{" "}
                  {totalPrice > 0
                    ? `₹${formatToIndianCurrency(totalPrice.toFixed(2))}`
                    : "0"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Total Price (after discount):{" "}
                  {totalPrice > 0
                    ? `₹${formatToIndianCurrency(
                        discountedPrice.toFixed(2)
                      )}`
                    : "0"}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={discountType === "value"}
                  onChange={handleDiscountTypeChange}
                  name="discountType"
                  color="primary"
                />
              }
              label="Discount in Value"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {discountType === "percentage" ? "%" : "₹"}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Manufacture Date"
              type="date"
              value={manufactureDate}
              onChange={handleManufactureDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!expiryDateError}
              helperText={expiryDateError}
            />
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default ProductModal;
