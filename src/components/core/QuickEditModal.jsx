import { FiSave, FiTrash2, FiX, FiEdit3, FiAlertCircle, FiImage, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import styles from "./QuickEditModal.module.css";
import { uploadProductImage } from "../../network/api/productsApi";
import { uploadCategoryImage } from "../../network/api/Category";

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
  const [finalPriceType, setFinalPriceType] = useState(null); // "salePriceWithoutTax" or "saleRate"
  const [uploadingImage, setUploadingImage] = useState(false);

  // Calculate total tax
  const totalTax =
    (parseFloat(formData.cgst) || 0) +
    (parseFloat(formData.sgst) || 0) +
    (parseFloat(formData.cess) || 0);

  // Calculate price with tax based on sale price without tax
  const calculatedPriceWithTax = formData.salePriceWithoutTax
    ? parseFloat(formData.salePriceWithoutTax) * (1 + totalTax / 100)
    : 0;

  // Calculate price without tax based on sale price with tax
  const calculatedPriceWithoutTax = formData.saleRate
    ? parseFloat(formData.saleRate) / (1 + totalTax / 100)
    : 0;

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
      setErrors({});
      setSubmitError("");
      // Auto-detect price input type based on existing data
      if (data.sale_price) {
        // If sale_price exists, assume it's "withoutTax" by default
        setPriceInputType("withoutTax");
        setFinalPriceType("salePriceWithoutTax");
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
        // If tax-based pricing was used, set sale_price based on finalPriceType
        if (finalPriceType === "salePriceWithoutTax") {
          dataToSave.sale_price =
            dataToSave.salePriceWithoutTax || dataToSave.sale_price;
        } else if (finalPriceType === "saleRate") {
          dataToSave.sale_price =
            dataToSave.saleRate || dataToSave.sale_price;
        }
      }

      // Clean up temporary fields added by price calculation
      delete dataToSave.salePriceWithoutTax;
      delete dataToSave.saleRate;

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      let result;
      // Determine which upload function to use based on data fields
      if (formData.id && formData.name) {
        // Check if it's a product or category based on available fields
        if (formData.category_id !== undefined || formData.manufacturer !== undefined) {
          // It's a product
          result = await uploadProductImage(file, formData.id);
        } else {
          // It's a category
          result = await uploadCategoryImage(file, formData.id);
        }
      } else {
        return;
      }

      if (result.status === 200) {
        setFormData((prev) => ({
          ...prev,
          image_url: result.data.imageUrl || result.data.url,
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setSubmitError("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
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
                // Skip sale_price if tax-based pricing is in use
                  if (
                    col.field === "sale_price" &&
                    (priceInputType === "withoutTax" ||
                      priceInputType === "withTax")
                  ) {
                    return null;
                  }

                  // Render tax section header
                  if (
                    col.field === "cgst" &&
                    !editableColumns.find((c) => c.field === "sale_price")
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

                // Render select dropdown if options are provided
                if (col.options && Array.isArray(col.options)) {
                  return (
                    <div key={col.field} className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>
                        {col.headerName}
                      </label>
                      <select
                        value={formData[col.field] ?? ""}
                        onChange={(e) => {
                          handleChange(col.field, e.target.value);
                        }}
                        className={`${styles.fieldInput} ${
                          errors[col.field] ? styles.error : ""
                        }`}
                        disabled={loading}
                      >
                        <option value="">Select {col.headerName.toLowerCase()}</option>
                        {col.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors[col.field] && (
                        <span className={styles.errorMsg}>
                          {errors[col.field]}
                        </span>
                      )}
                    </div>
                  );
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
                (col) => col.field === "sale_price"
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
                        Sale Price (Without Tax)
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
                        Sale Price (With Tax)
                      </label>
                    </div>
                  </div>

                  {priceInputType && (
                    <>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          {priceInputType === "withoutTax"
                             ? "Sale Price (Without Tax)"
                             : "Sale Price (With Tax)"}{" "}
                           *
                          </label>
                          <input
                           type="number"
                           name={
                             priceInputType === "withoutTax"
                               ? "salePriceWithoutTax"
                               : "saleRate"
                           }
                           placeholder="0.00"
                           value={
                             priceInputType === "withoutTax"
                               ? formData.salePriceWithoutTax || ""
                               : formData.saleRate || ""
                           }
                           onChange={(e) =>
                             handleChange(
                               priceInputType === "withoutTax"
                                 ? "salePriceWithoutTax"
                                 : "saleRate",
                               e.target.value
                             )
                           }
                           className={`${styles.fieldInput} ${
                             errors[
                               priceInputType === "withoutTax"
                                 ? "salePriceWithoutTax"
                                 : "saleRate"
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
                             ? "salePriceWithoutTax"
                             : "saleRate"
                          ] && (
                           <span className={styles.errorMsg}>
                             {
                               errors[
                                 priceInputType === "withoutTax"
                                   ? "salePriceWithoutTax"
                                   : "saleRate"
                               ]
                            }
                          </span>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          {priceInputType === "withoutTax"
                            ? "Sale Price (With Tax)"
                            : "Sale Price (Without Tax)"}
                            </label>
                            <input
                            type="number"
                            name={
                            priceInputType === "withoutTax"
                              ? "saleRate"
                              : "salePriceWithoutTax"
                            }
                            placeholder="0.00"
                            value={
                            priceInputType === "withoutTax"
                              ? formData.saleRate || ""
                              : formData.salePriceWithoutTax || ""
                            }
                            onChange={(e) =>
                            handleChange(
                              priceInputType === "withoutTax"
                                ? "saleRate"
                                : "salePriceWithoutTax",
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
                              value="salePriceWithoutTax"
                              checked={
                                finalPriceType === "salePriceWithoutTax"
                              }
                              onChange={(e) =>
                                setFinalPriceType(e.target.value)
                              }
                              disabled={loading}
                            />
                            Sale Price Without Tax (₹
                            {formData.salePriceWithoutTax || "0.00"})
                          </label>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name="finalPriceType"
                              value="saleRate"
                              checked={finalPriceType === "saleRate"}
                              onChange={(e) =>
                                setFinalPriceType(e.target.value)
                              }
                              disabled={loading}
                            />
                            Sale Price With Tax (₹
                            {formData.saleRate || "0.00"})
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </>
                )}

                {/* Image Upload Section */}
                <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.fieldLabel}>Product/Category Image</label>
                <div style={{
                 border: '2px dashed #ccc',
                 borderRadius: '8px',
                 padding: '20px',
                 textAlign: 'center',
                 cursor: 'pointer',
                 backgroundColor: '#f9f9f9',
                 position: 'relative',
                 minHeight: '150px',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center'
                }}>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   disabled={uploadingImage || loading}
                   style={{
                     position: 'absolute',
                     width: '100%',
                     height: '100%',
                     opacity: 0,
                     cursor: uploadingImage || loading ? 'not-allowed' : 'pointer'
                   }}
                 />
                 {formData.image_url ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                     <img 
                       src={formData.image_url} 
                       alt="Preview" 
                       style={{ maxHeight: '120px', maxWidth: '120px', borderRadius: '4px' }}
                     />
                     <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Click to change image</p>
                   </div>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                     <FiImage size={32} style={{ color: '#999' }} />
                     {uploadingImage ? (
                       <p style={{ color: '#666', margin: 0 }}>
                         <FiLoader size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                         Uploading...
                       </p>
                     ) : (
                       <p style={{ color: '#666', margin: 0 }}>Click to upload image</p>
                     )}
                   </div>
                 )}
                </div>
                </div>
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
