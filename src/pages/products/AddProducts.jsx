import { FiArrowLeft, FiBox, FiDollarSign, FiTag, FiAlertCircle } from 'react-icons/fi';
import React, { useState, useCallback, useEffect } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { createProduct } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import styles from './AddProducts.module.css';
import { getCategoryOptions } from "../../utils/cacheHelper";

const AddProducts = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    categoryId: '',
    manufacturer: '',
    brand: '',
    upc: '',
    hsn: '',
    dimensions: '',
    weight: '',
    unitMRP: '',
    purchasePrice: '',
    salePrice: '',
    reorderLevel: '0',
    maxStockLevel: '',
    cgst: '0',
    sgst: '0',
    cess: '0',
    unitOfMeasure: 'pieces',
    variants: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [rateType, setRateType] = useState("purchasePriceWithoutTax");

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const categoryOptions = getCategoryOptions();
      setCategories(categoryOptions);
    };
    loadCategories();
  }, []);

  const validateCurrentStep = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Step 1: Basic Information
      if (!formData.itemName?.trim()) newErrors.itemName = 'Product name is required';
      if (!formData.manufacturer?.trim()) newErrors.manufacturer = 'Manufacturer is required';
      if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    } else if (pageNum === 2) {
      // Step 2: Pricing & Inventory
      const unitMrp = parseFloat(formData.unitMRP);
      const purchasePrice = formData.rateType === "purchasePriceWithoutTax" 
        ? parseFloat(formData.purchasePriceWithoutTax) 
        : parseFloat(formData.purchaseRate);
      const salePrice = parseFloat(formData.salePrice);

      if (!formData.unitMRP || isNaN(unitMrp) || unitMrp <= 0) {
        newErrors.unitMRP = 'Valid Unit MRP is required';
      }
      if (!purchasePrice || isNaN(purchasePrice) || purchasePrice <= 0) {
        newErrors.purchasePriceWithoutTax = 'Valid Purchase Price is required';
      }
      if (!formData.salePrice || isNaN(salePrice) || salePrice <= 0) {
        newErrors.salePrice = 'Valid Sale Price is required';
      }

      if (unitMrp && purchasePrice && purchasePrice > unitMrp) {
        newErrors.purchasePriceWithoutTax = 'Cannot exceed Unit MRP';
      }
      if (unitMrp && salePrice && salePrice > unitMrp) {
        newErrors.salePrice = 'Cannot exceed Unit MRP';
      }

      if (formData.weight && (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0)) {
        newErrors.weight = 'Weight must be positive';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculatePurchaseRate = (purchasePriceWithoutTax, taxRate) => {
    return purchasePriceWithoutTax * (1 + taxRate / 100);
  };

  const calculatePurchasePriceWithoutTax = (purchaseRate, taxRate) => {
    return purchaseRate / (1 + taxRate / 100);
  };

  const handleRateTypeChange = (event) => {
    setRateType(event.target.value);
    setFormData((prevState) => ({
      ...prevState,
      purchasePriceWithoutTax: 0,
      purchaseRate: 0,
    }));
  };

  // Calculate purchase rate based on tax changes
  useEffect(() => {
    const totalTax = (parseFloat(formData.cgst) || 0) + (parseFloat(formData.sgst) || 0) + (parseFloat(formData.cess) || 0);

    if (rateType === "purchasePriceWithoutTax" && formData.purchasePriceWithoutTax) {
      const calculatedRate = calculatePurchaseRate(
        parseFloat(formData.purchasePriceWithoutTax),
        totalTax
      );
      setFormData((prevState) => ({
        ...prevState,
        purchaseRate: calculatedRate,
      }));
    } else if (rateType === "purchaseRate" && formData.purchaseRate) {
      const calculatedPrice = calculatePurchasePriceWithoutTax(
        parseFloat(formData.purchaseRate),
        totalTax
      );
      setFormData((prevState) => ({
        ...prevState,
        purchasePriceWithoutTax: calculatedPrice,
      }));
    }
  }, [formData.cgst, formData.sgst, formData.cess, formData.purchasePriceWithoutTax, formData.purchaseRate, rateType]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...(formData.variants || [])];
    if (field === "key") {
      newVariants[index].key = value;
    } else {
      // Store as raw string while editing, parse only on submit
      newVariants[index].values = value;
    }
    setFormData((prevState) => ({
      ...prevState,
      variants: newVariants,
    }));
  };

  const addVariantRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      variants: [...(prevState.variants || []), { key: "", values: [] }],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      variants: prevState.variants.filter((_, i) => i !== index),
    }));
  };

  const submit = async () => {
    if (!validateCurrentStep(2)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use purchasePriceWithoutTax or purchaseRate based on rateType
      const purchasePrice = rateType === "purchasePriceWithoutTax" 
        ? parseFloat(formData.purchasePriceWithoutTax) 
        : parseFloat(formData.purchaseRate);

      const apiData = {
        name: formData.itemName.trim(),
        description: formData.description?.trim() || null,
        categoryId: Number(formData.categoryId) || 1,
        manufacturer: formData.manufacturer.trim(),
        brand: formData.brand?.trim() || formData.manufacturer.trim(),
        barcode: formData.upc?.trim() || null,
        dimensions: formData.dimensions?.trim() || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        unitMrp: parseFloat(formData.unitMRP),
        purchasePrice: purchasePrice,
        salePrice: parseFloat(formData.salePrice),
        reorderLevel: parseInt(formData.reorderLevel) || 0,
        maxStockLevel: parseInt(formData.maxStockLevel) || (parseInt(formData.reorderLevel) * 10),
        isActive: true,
        unitOfMeasure: formData.unitOfMeasure || 'pieces',
        hsn: formData.hsn?.trim() || null,
        upc: formData.upc?.trim() || null,
        taxes: {
          cgst: parseFloat(formData.cgst) || 0,
          sgst: parseFloat(formData.sgst) || 0,
          cess: parseFloat(formData.cess) || 0
        },
        variants: formData.variants?.filter(v => v.key?.trim())
          .map(variant => ({
            key: variant.key.trim(),
            values: Array.isArray(variant.values) 
              ? variant.values 
              : variant.values.split(",").map(v => v.trim()).filter(v => v)
          })) || []
      };

      const response = await createProduct(apiData);

      if (response === 201 || response === 200) {
        successPopup("Product added successfully!");
        navigate('/products');
      } else {
        errorPopup("Failed to add product");
      }
    } catch (error) {
      console.error('Error creating product:', error);
      errorPopup("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Info", "Pricing & Stock", "Variants"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      categories={categories}
    />,
    <PricingPage
      key="pricing"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      rateType={rateType}
      handleRateTypeChange={handleRateTypeChange}
    />,
    <VariantPage
      key="variants"
      formData={formData}
      handleVariantChange={handleVariantChange}
      addVariantRow={addVariantRow}
      removeVariant={removeVariant}
    />
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ padding: '0.4rem 1.5rem 0rem 1.5rem' }}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <FiArrowLeft />
        </button>
      </div>
      <AddForm
        title="New Product Setup"
        steps={steps}
        pages={pages}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        onSubmit={submit}
        validatePage={validateCurrentStep}
        isSubmitting={isSubmitting}
        onError={errorPopup}
      />
    </div>
  );
};

export default AddProducts;

const BasicPage = React.memo(({ formData, handleChange, errors, categories }) => {
  const categoryList = categories.length > 0 ? categories : [
    "Electronics", "Sports", "Home Decorations", "Toys", "Fashion", "Food", "Others"
  ];

  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiBox className={styles.pageIcon} />
          <h1>Basic Information</h1>
          <p>Let's start with the product basics</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Product Name *</label>
            <input
              type="text"
              name="itemName"
              placeholder="e.g., Nike Air Max Running Shoes"
              value={formData.itemName}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.itemName ? styles.error : ''}`}
            />
            {errors.itemName && <span className={styles.errorMsg}>{errors.itemName}</span>}
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.textArea}`}
              rows="3"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Manufacturer *</label>
            <input
              type="text"
              name="manufacturer"
              placeholder="e.g., Nike Inc."
              value={formData.manufacturer}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.manufacturer ? styles.error : ''}`}
            />
            {errors.manufacturer && <span className={styles.errorMsg}>{errors.manufacturer}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="Brand name"
              value={formData.brand}
              onChange={handleChange}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput} ${errors.categoryId ? styles.error : ''}`}
            >
              <option value="">Select a category</option>
              {categoryList.map((cat, idx) => (
                <option key={idx} value={idx + 1}>{cat}</option>
              ))}
            </select>
            {errors.categoryId && <span className={styles.errorMsg}>{errors.categoryId}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Unit of Measure</label>
            <select
              name="unitOfMeasure"
              value={formData.unitOfMeasure}
              onChange={handleChange}
              className={`${styles.fieldInput} ${styles.selectInput}`}
            >
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="grams">Grams</option>
              <option value="liters">Liters</option>
              <option value="ml">Milliliters</option>
              <option value="meters">Meters</option>
              <option value="cm">Centimeters</option>
              <option value="boxes">Boxes</option>
              <option value="packs">Packs</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Barcode / UPC</label>
            <input
              type="text"
              name="upc"
              placeholder="e.g., 123456789012"
              value={formData.upc}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="50"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>HSN Code</label>
            <input
              type="text"
              name="hsn"
              placeholder="e.g., 64041100"
              value={formData.hsn}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="12"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Dimensions</label>
            <input
              type="text"
              name="dimensions"
              placeholder="e.g., 30x15x10 cm"
              value={formData.dimensions}
              onChange={handleChange}
              className={styles.fieldInput}
              maxLength="100"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Weight</label>
            <input
              type="number"
              name="weight"
              placeholder="in grams"
              value={formData.weight}
              onChange={handleChange}
              className={`${styles.fieldInput} ${errors.weight ? styles.error : ''}`}
              min="0"
              step="0.01"
            />
            {errors.weight && <span className={styles.errorMsg}>{errors.weight}</span>}
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const PricingPage = React.memo(({ formData, handleChange, errors, rateType, handleRateTypeChange }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiDollarSign className={styles.pageIcon} />
          <h1>Pricing & Inventory</h1>
          <p>Set prices and stock levels</p>
        </div>

        <div className={styles.fieldGrid}>
          {/* Pricing Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiTag size={18} />
              <h3>Pricing</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Unit MRP *</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="unitMRP"
                placeholder="0.00"
                value={formData.unitMRP}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.unitMRP ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.unitMRP && <span className={styles.errorMsg}>{errors.unitMRP}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Sale Price *</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>₹</span>
              <input
                type="number"
                name="salePrice"
                placeholder="0.00"
                value={formData.salePrice}
                onChange={handleChange}
                className={`${styles.fieldInput} ${errors.salePrice ? styles.error : ''}`}
                min="0"
                step="0.01"
              />
            </div>
            {errors.salePrice && <span className={styles.errorMsg}>{errors.salePrice}</span>}
          </div>

          {/* Taxes Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiAlertCircle size={18} />
              <h3>Taxes</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>CGST (%)</label>
            <input
              type="number"
              name="cgst"
              placeholder="0"
              value={formData.cgst}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>SGST (%)</label>
            <input
              type="number"
              name="sgst"
              placeholder="0"
              value={formData.sgst}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>CESS (%)</label>
            <input
              type="number"
              name="cess"
              placeholder="0"
              value={formData.cess}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          {/* Purchase Price with/without Tax */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Purchase Rate Type</label>
            <div className={styles.rateTypeOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="rateType"
                  value="purchasePriceWithoutTax"
                  checked={rateType === "purchasePriceWithoutTax"}
                  onChange={handleRateTypeChange}
                />
                Without Tax
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="rateType"
                  value="purchaseRate"
                  checked={rateType === "purchaseRate"}
                  onChange={handleRateTypeChange}
                />
                With Tax
              </label>
            </div>
          </div>

          {rateType === "purchasePriceWithoutTax" && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Purchase Price (Without Tax) *</label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    name="purchasePriceWithoutTax"
                    placeholder="0.00"
                    value={formData.purchasePriceWithoutTax || ''}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Purchase Rate (With Tax)</label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={formData.purchaseRate !== undefined ? formData.purchaseRate.toFixed(2) : ''}
                    disabled
                    className={styles.fieldInput}
                  />
                </div>
                <small className={styles.fieldHint}>Auto-calculated based on taxes</small>
              </div>
            </>
          )}

          {rateType === "purchaseRate" && (
            <>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Purchase Rate (With Tax) *</label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    name="purchaseRate"
                    placeholder="0.00"
                    value={formData.purchaseRate || ''}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Purchase Price (Without Tax)</label>
                <div className={styles.currencyInput}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={formData.purchasePriceWithoutTax !== undefined ? formData.purchasePriceWithoutTax.toFixed(2) : ''}
                    disabled
                    className={styles.fieldInput}
                  />
                </div>
                <small className={styles.fieldHint}>Auto-calculated based on taxes</small>
              </div>
            </>
          )}

          {/* Inventory Section */}
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <FiBox size={18} />
              <h3>Inventory</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              placeholder="10"
              value={formData.reorderLevel}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
            />
            <small className={styles.fieldHint}>When stock drops below this, you'll be notified</small>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Max Stock Level</label>
            <input
              type="number"
              name="maxStockLevel"
              placeholder="100"
              value={formData.maxStockLevel}
              onChange={handleChange}
              className={styles.fieldInput}
              min="0"
            />
            <small className={styles.fieldHint}>Maximum stock to maintain</small>
          </div>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

PricingPage.displayName = 'PricingPage';

const VariantPage = React.memo(({ formData, handleVariantChange, addVariantRow, removeVariant }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiTag className={styles.pageIcon} />
          <h1>Product Variants</h1>
          <p>Add size, color, or other variants (optional)</p>
        </div>

        <div className={styles.variantsContainer}>
          {formData.variants && formData.variants.length > 0 ? (
            <div className={styles.variantsList}>
              {formData.variants.map((variant, index) => (
                <div key={index} className={styles.variantCard}>
                  <div className={styles.variantField}>
                    <label className={styles.fieldLabel}>Variant Type</label>
                    <input
                      type="text"
                      placeholder="e.g., Size, Color, Material"
                      value={variant.key}
                      onChange={(e) => handleVariantChange(index, "key", e.target.value)}
                      className={styles.fieldInput}
                    />
                  </div>
                  <div className={styles.variantField}>
                    <label className={styles.fieldLabel}>Values (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., S, M, L, XL"
                      value={Array.isArray(variant.values) ? variant.values.join(", ") : variant.values}
                      onChange={(e) => handleVariantChange(index, "values", e.target.value)}
                      className={styles.fieldInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className={styles.removeBtn}
                    title="Remove variant"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No variants added yet</p>
              <small>Add variants like size, color, or material for your product</small>
            </div>
          )}

          <button
            type="button"
            onClick={addVariantRow}
            className={styles.addVariantBtn}
          >
            + Add Variant
          </button>
        </div>
      </div>
    </MultiPageAnimate>
  );
});

VariantPage.displayName = 'VariantPage';
