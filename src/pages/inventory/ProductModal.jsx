import { useState } from "react";
import { FiX, FiPackage } from 'react-icons/fi';
import { formatToIndianCurrency } from "../../utils/FormHelper";
import styles from './ProductModal.module.css';

const ProductModal = ({
  open,
  handleClose,
  products,
  handleAddProduct,
  selectedProducts,
  handleRemoveProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [errors, setErrors] = useState({});

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p.id.toString() === productId);
    setSelectedProduct(product || null);
    setErrors({});
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value === "" ? "" : parseInt(value, 10));
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    setDiscount(value === "" ? "" : parseFloat(value));
  };

  const handleDiscountTypeChange = () => {
    setDiscountType(discountType === "percentage" ? "value" : "percentage");
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

  const validateAndAdd = () => {
    const newErrors = {};

    if (!selectedProduct) {
      newErrors.product = "Please select a product";
    }
    if (quantity === "" || Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (expiryDateError) {
      newErrors.expiry = expiryDateError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Use purchase_price from product data
      const purchasePrice = Number(selectedProduct?.purchase_price || 0);
      
      handleAddProduct({
        itemId: selectedProduct.id.toString(),
        itemName: selectedProduct.name,
        quantity: Number(quantity),
        discount: discount === "" ? 0 : Number(discount),
        discountType,
        packSize: selectedProduct.packSize || 1,
        recordUnitPrice: purchasePrice,
        manufactureDate,
        expiryDate,
      });
      resetForm();
      handleClose();
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity("");
    setDiscount("");
    setDiscountType("percentage");
    setManufactureDate("");
    setExpiryDate("");
    setErrors({});
  };

  // Use product's purchase_price for calculations
  const purchasePrice = selectedProduct ? Number(selectedProduct?.purchase_price || 0) : 0;
  const totalPrice = selectedProduct && quantity ? purchasePrice * Number(quantity) : 0;
  const discountedPrice =
    discountType === "percentage"
      ? totalPrice - (totalPrice * (Number(discount) || 0)) / 100
      : totalPrice - (Number(discount) || 0);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleSection}>
            <FiPackage className={styles.headerIcon} />
            <h2 className={styles.modalTitle}>Add Products to Batch</h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            title="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Product Selection */}
          <div className={styles.formSection}>
            <label className={styles.label}>Select Product *</label>
            <select
              value={selectedProduct?.id || ""}
              onChange={handleProductChange}
              className={`${styles.select} ${errors.product ? styles.errorInput : ""}`}
            >
              <option value="">-- Choose a Product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.product && <span className={styles.error}>{errors.product}</span>}
          </div>

          {/* Product Info */}
          {selectedProduct && (
            <div className={styles.productInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Unit of Measure</span>
                  <span className={styles.infoValue}>{selectedProduct.unit_of_measure || "pieces"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Purchase Price</span>
                  <span className={styles.infoValue}>₹{formatToIndianCurrency(Number(selectedProduct.purchase_price || 0).toFixed(2))}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>MRP</span>
                  <span className={styles.infoValue}>₹{formatToIndianCurrency(Number(selectedProduct.unit_mrp || 0).toFixed(2))}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Sale Price</span>
                  <span className={styles.infoValue}>₹{formatToIndianCurrency(Number(selectedProduct.sale_price || 0).toFixed(2))}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Reorder Level</span>
                  <span className={styles.infoValue}>{selectedProduct.reorder_level || 0}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <label className={styles.label}>Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                    className={`${styles.input} ${errors.quantity ? styles.errorInput : ""}`}
                    min="1"
                  />
                  {errors.quantity && <span className={styles.error}>{errors.quantity}</span>}
                </div>

                <div className={styles.formSection}>
                  <label className={styles.label}>Discount</label>
                  <div className={styles.discountWrapper}>
                    <input
                      type="number"
                      value={discount}
                      onChange={handleDiscountChange}
                      placeholder="Enter discount"
                      className={styles.input}
                      min="0"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={handleDiscountTypeChange}
                      className={styles.discountToggle}
                      title="Toggle discount type"
                    >
                      {discountType === "percentage" ? "%" : "₹"}
                    </button>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <label className={styles.label}>Manufacture Date</label>
                  <input
                    type="date"
                    value={manufactureDate}
                    onChange={handleManufactureDateChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formSection}>
                  <label className={styles.label}>Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className={`${styles.input} ${expiryDateError ? styles.errorInput : ""}`}
                  />
                  {expiryDateError && <span className={styles.error}>{expiryDateError}</span>}
                </div>
              </div>

              {/* Price Summary */}
              <div className={styles.priceSummary}>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Purchase Price (per unit):</span>
                  <span className={styles.priceValue}>₹{formatToIndianCurrency(purchasePrice.toFixed(2))}</span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Total (Qty × Price):</span>
                  <span className={styles.priceValue}>₹{formatToIndianCurrency(totalPrice.toFixed(2))}</span>
                </div>
                {Number(discount) > 0 && (
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>Discount:</span>
                    <span className={styles.discountValue}>-₹{formatToIndianCurrency(Math.abs(discountedPrice - totalPrice).toFixed(2))}</span>
                  </div>
                )}
                <div className={`${styles.priceRow} ${styles.finalPrice}`}>
                  <span className={styles.priceLabel}>Final Price:</span>
                  <span className={styles.priceValueFinal}>₹{formatToIndianCurrency(discountedPrice.toFixed(2))}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={styles.addBtn}
            onClick={validateAndAdd}
            disabled={!selectedProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
