import { FiSave, FiTrash2, FiX, FiEdit3, FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import styles from "./QuickEditModal.module.css";

const QuickEditModal = ({
  open,
  onClose,
  data,
  columns,
  onSave,
  onDelete,
  title,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [priceInputType, setPriceInputType] = useState(null); // null, "withoutTax", or "withTax"
  const [finalPriceType, setFinalPriceType] = useState(null); // "purchasePriceWithoutTax" or "purchaseRate"

  // Calculate total tax
  const totalTax =
    (parseFloat(formData.cgst) || 0) +
    (parseFloat(formData.sgst) || 0) +
    (parseFloat(formData.cess) || 0);

  // Calculate price with tax based on purchase price without tax
  const calculatedPriceWithTax = formData.purchasePriceWithoutTax
    ? parseFloat(formData.purchasePriceWithoutTax) * (1 + totalTax / 100)
    : 0;

  // Calculate price without tax based on purchase price with tax
  const calculatedPriceWithoutTax = formData.purchaseRate
    ? parseFloat(formData.purchaseRate) / (1 + totalTax / 100)
    : 0;

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
      setErrors({});
      setSubmitError("");
      // Auto-detect price input type based on existing data
      if (data.purchase_price) {
        // If purchase_price exists, assume it's "withoutTax" by default
        setPriceInputType("withoutTax");
        setFinalPriceType("purchasePriceWithoutTax");
      }
    }
  }, [data, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSubmitError("");

      // Handle purchase price based on selection
      const dataToSave = { ...formData };

      if (
        priceInputType &&
        (priceInputType === "withoutTax" || priceInputType === "withTax")
      ) {
        // If tax-based pricing was used, set purchase_price based on finalPriceType
        if (finalPriceType === "purchasePriceWithoutTax") {
          dataToSave.purchase_price =
            dataToSave.purchasePriceWithoutTax || dataToSave.purchase_price;
        } else if (finalPriceType === "purchaseRate") {
          dataToSave.purchase_price =
            dataToSave.purchaseRate || dataToSave.purchase_price;
        }
      }

      await onSave(dataToSave);
    } catch (error) {
      setSubmitError(error.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete(data);
      setShowDeleteConfirm(false);
    } catch (error) {
      setSubmitError(error.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const editableColumns = columns.filter((col) => col.editable && col.field);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.titleWithIcon}>
              <FiEdit3 className={styles.titleIcon} />
              <h2 className={styles.title}>Edit {title}</h2>
            </div>
            <p className={styles.subtitle}>Update information below</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {submitError && (
            <div className={styles.errorAlert}>
              <FiAlertCircle className={styles.errorIcon} />
              <span>{submitError}</span>
            </div>
          )}

          {editableColumns.length > 0 ? (
            <div className={styles.fieldGrid}>
              {editableColumns.map((col) => {
                // Skip purchase_price if tax-based pricing is in use
                if (
                  col.field === "purchase_price" &&
                  (priceInputType === "withoutTax" ||
                    priceInputType === "withTax")
                ) {
                  return null;
                }

                // Render tax section header
                if (
                  col.field === "cgst" &&
                  !editableColumns.find((c) => c.field === "purchase_price")
                ) {
                  return (
                    <div key="tax-section" className={styles.sectionHeader}>
                      <h4>Tax & Pricing</h4>
                    </div>
                  );
                }

                // Determine input type based on field name and type
                let inputType = col.type || "text";
                if (
                  col.field.includes("price") ||
                  col.field.includes("mrp") ||
                  col.field.includes("weight")
                ) {
                  inputType = "number";
                } else if (
                  col.field.includes("cgst") ||
                  col.field.includes("sgst") ||
                  col.field.includes("cess")
                ) {
                  inputType = "number";
                } else if (
                  col.field.includes("level") ||
                  col.field.includes("stock")
                ) {
                  inputType = "number";
                }

                return (
                  <div key={col.field} className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      {col.headerName}
                    </label>
                    <input
                      type={inputType}
                      step={inputType === "number" ? "0.01" : undefined}
                      value={formData[col.field] ?? ""}
                      onChange={(e) => {
                        handleChange(col.field, e.target.value);
                        // Reset price input type when taxes change
                        if (
                          col.field === "cgst" ||
                          col.field === "sgst" ||
                          col.field === "cess"
                        ) {
                          setPriceInputType(null);
                          setFinalPriceType(null);
                        }
                      }}
                      placeholder={`Enter ${col.headerName.toLowerCase()}`}
                      className={`${styles.fieldInput} ${
                        errors[col.field] ? styles.error : ""
                      }`}
                      disabled={loading}
                    />
                    {errors[col.field] && (
                      <span className={styles.errorMsg}>
                        {errors[col.field]}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Price Input Type Selection */}
              {editableColumns.some(
                (col) => col.field === "purchase_price"
              ) && (
                <>
                  <div
                    className={styles.fieldGroup}
                    style={{ gridColumn: "1/-1" }}
                  >
                    <label className={styles.fieldLabel}>
                      Step 1: Which price would you like to enter? *
                    </label>
                    {errors.priceInputType && (
                      <span className={styles.errorMsg}>
                        {errors.priceInputType}
                      </span>
                    )}
                    <div className={styles.rateTypeOptions}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="priceInputType"
                          value="withoutTax"
                          checked={priceInputType === "withoutTax"}
                          onChange={(e) => setPriceInputType(e.target.value)}
                          disabled={loading}
                        />
                        Purchase Price (Without Tax)
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="priceInputType"
                          value="withTax"
                          checked={priceInputType === "withTax"}
                          onChange={(e) => setPriceInputType(e.target.value)}
                          disabled={loading}
                        />
                        Purchase Price (With Tax)
                      </label>
                    </div>
                  </div>

                  {priceInputType && (
                    <>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          {priceInputType === "withoutTax"
                            ? "Purchase Price (Without Tax)"
                            : "Purchase Price (With Tax)"}{" "}
                          *
                        </label>
                        <input
                          type="number"
                          name={
                            priceInputType === "withoutTax"
                              ? "purchasePriceWithoutTax"
                              : "purchaseRate"
                          }
                          placeholder="0.00"
                          value={
                            priceInputType === "withoutTax"
                              ? formData.purchasePriceWithoutTax || ""
                              : formData.purchaseRate || ""
                          }
                          onChange={(e) =>
                            handleChange(
                              priceInputType === "withoutTax"
                                ? "purchasePriceWithoutTax"
                                : "purchaseRate",
                              e.target.value
                            )
                          }
                          className={`${styles.fieldInput} ${
                            errors[
                              priceInputType === "withoutTax"
                                ? "purchasePriceWithoutTax"
                                : "purchaseRate"
                            ]
                              ? styles.error
                              : ""
                          }`}
                          min="0"
                          step="0.01"
                          disabled={loading}
                        />
                        {errors[
                          priceInputType === "withoutTax"
                            ? "purchasePriceWithoutTax"
                            : "purchaseRate"
                        ] && (
                          <span className={styles.errorMsg}>
                            {
                              errors[
                                priceInputType === "withoutTax"
                                  ? "purchasePriceWithoutTax"
                                  : "purchaseRate"
                              ]
                            }
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          {priceInputType === "withoutTax"
                            ? "Purchase Price (With Tax)"
                            : "Purchase Price (Without Tax)"}
                        </label>
                        <input
                          type="number"
                          name={
                            priceInputType === "withoutTax"
                              ? "purchaseRate"
                              : "purchasePriceWithoutTax"
                          }
                          placeholder="0.00"
                          value={
                            priceInputType === "withoutTax"
                              ? formData.purchaseRate || ""
                              : formData.purchasePriceWithoutTax || ""
                          }
                          onChange={(e) =>
                            handleChange(
                              priceInputType === "withoutTax"
                                ? "purchaseRate"
                                : "purchasePriceWithoutTax",
                              e.target.value
                            )
                          }
                          className={styles.fieldInput}
                          min="0"
                          step="0.01"
                          disabled={loading}
                        />
                        <small className={styles.fieldHint}>
                          Recommended: ₹
                          {priceInputType === "withoutTax"
                            ? calculatedPriceWithTax.toFixed(2)
                            : calculatedPriceWithoutTax.toFixed(2)}{" "}
                          (based on {totalTax}% tax)
                        </small>
                      </div>

                      <div
                        className={styles.fieldGroup}
                        style={{ gridColumn: "1/-1" }}
                      >
                        <label className={styles.fieldLabel}>
                          Step 2: Which price should be used for your records? *
                        </label>
                        {errors.finalPriceType && (
                          <span className={styles.errorMsg}>
                            {errors.finalPriceType}
                          </span>
                        )}
                        <div className={styles.rateTypeOptions}>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name="finalPriceType"
                              value="purchasePriceWithoutTax"
                              checked={
                                finalPriceType === "purchasePriceWithoutTax"
                              }
                              onChange={(e) =>
                                setFinalPriceType(e.target.value)
                              }
                              disabled={loading}
                            />
                            Purchase Price Without Tax (₹
                            {formData.purchasePriceWithoutTax || "0.00"})
                          </label>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name="finalPriceType"
                              value="purchaseRate"
                              checked={finalPriceType === "purchaseRate"}
                              onChange={(e) =>
                                setFinalPriceType(e.target.value)
                              }
                              disabled={loading}
                            />
                            Purchase Price With Tax (₹
                            {formData.purchaseRate || "0.00"})
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiEdit3 />
              </div>
              <p>No editable fields available</p>
              <span>Check your field configuration</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            title="Delete this item"
            disabled={loading}
          >
            <FiTrash2 />
            {loading ? "Deleting..." : "Delete"}
          </button>
          <div className={styles.footerActions}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={loading}
            >
              <FiSave />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationModal}>
              <div className={styles.confirmationIcon}>
                <FiAlertCircle />
              </div>
              <h3 className={styles.confirmationTitle}>Delete Item</h3>
              <p className={styles.confirmationMessage}>
                Are you sure you want to delete this {title.toLowerCase()}? This
                action cannot be undone.
              </p>
              <div className={styles.confirmationActions}>
                <button
                  className={styles.confirmCancelBtn}
                  onClick={handleCancelDelete}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmDeleteBtn}
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickEditModal;
