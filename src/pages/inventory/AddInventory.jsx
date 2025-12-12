import { FiCheckCircle, FiMinus, FiPlus, FiFileText, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import ProductModal from "./ProductModal";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useEffect, useState } from "react";
import { getWarehouses, getProducts, getSuppliers, createBatch } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { formatToIndianCurrency } from "../../utils/FormHelper";
import InputBox from "../../components/FormComponent/InputBox";
import MouseHoverPopover from "../../components/core/Explain";
import AddLocationModal from "./AddLocationModal";
import DropdownBar from "../../components/FormComponent/DropdownBar";
import BatchInvoicePreview from "./yeah";
import styles from './AddInventory.module.css';

const AddInventory = () => {
  const [locations, setLocations] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stockIssues, setStockIssues] = useState([]);
  const [openInvoice, setOpenInvoice] = useState(false);

  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const fetchLocations = async () => {
    try {
      const data = await getWarehouses();
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLocations([]);
    }
  };

  const closeLocationModal = () => setOpenLocationModal(false);
  const closeProductModal = () => setOpenProductModal(false);
  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleCloseInvoice = () => setOpenInvoice(false);

  const handleAddProduct = (newItem) => {
    setSelectedProducts((prevProducts) => [...prevProducts, newItem]);
  };

  const handleRemoveProduct = (itemIdToRemove) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter(({ itemId }) => itemId !== itemIdToRemove)
    );
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, product) => {
      // Use recordUnitPrice from selectedProduct (already includes product's purchase_price)
      const unitPrice = Number(product.recordUnitPrice || 0);
      const itemTotal = unitPrice * Number(product.quantity);
      
      // Calculate final price after discount
      const discountedPrice =
        product.discountType === "percentage"
          ? itemTotal * (1 - Number(product.discount || 0) / 100)
          : itemTotal - Number(product.discount || 0);
      
      return total + discountedPrice;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedSupplier || selectedProducts.length === 0) {
      errorPopup("Please select warehouse, supplier, and add products!");
      return;
    }

    if (!formData.batchNumber || !formData.entryDate) {
      errorPopup("Please fill in batch number and entry date!");
      return;
    }

    for (const product of selectedProducts) {
      if (!product.quantity || product.quantity <= 0) {
        errorPopup(`Please enter valid quantity for ${product.itemName}`);
        return;
      }
      if (!product.recordUnitPrice || product.recordUnitPrice <= 0) {
        errorPopup(`Please enter valid unit price for ${product.itemName}`);
        return;
      }
    }

    try {
      let successCount = 0;
      const errors = [];

      for (let i = 0; i < selectedProducts.length; i++) {
        const product = selectedProducts[i];
        const batchCode = selectedProducts.length === 1
          ? formData.batchNumber
          : `${formData.batchNumber}-${product.itemId}`;

        const batchData = {
          productId: Number(product.itemId),
          supplierId: Number(selectedSupplier?.id),
          batchCode: batchCode,
          purchaseDate: formData.entryDate,
          expiryDate: product.expiryDate || null,
          quantity: Number(product.quantity),
          remainingQuantity: Number(product.quantity),
          unitCost: Number(product.recordUnitPrice),
          warehouseId: Number(selectedLocation?.id),
          remarks: formData.remarks || '',
          isActive: true
        };

        try {
          const response = await createBatch(batchData);
          if (response === 201 || response === 200) {
            successCount++;
          } else {
            errors.push(`Failed to create batch for ${product.itemName}`);
          }
        } catch (batchError) {
          console.error(`Error creating batch for ${product.itemName}:`, batchError);
          errors.push(`Error creating batch for ${product.itemName}: ${batchError.message || 'Unknown error'}`);
        }
      }

      if (successCount === selectedProducts.length) {
        successPopup(`${successCount} batch(es) added successfully!`);
        navigate("/inventory");
      } else if (successCount > 0) {
        successPopup(`${successCount} out of ${selectedProducts.length} batch(es) added successfully. Some failed.`);
        if (errors.length > 0) {
          errorPopup(`Errors: ${errors.join('; ')}`);
        }
      } else {
        errorPopup(`Failed to add any batches. Errors: ${errors.join('; ')}`);
      }
    } catch (error) {
      console.error('Error in batch creation process:', error);
      errorPopup("Error adding batches!");
    }
  };

  const handleIssueChange = (index, e) => {
    const { name, value } = e.target;
    const newStockIssues = [...stockIssues];
    newStockIssues[index] = { ...newStockIssues[index], [name]: value };
    setStockIssues(newStockIssues);
  };

  const handleSelectProduct = (index, event, value) => {
    setStockIssues((prevIssues) =>
      prevIssues.map((issue, i) =>
        i === index ? { ...issue, itemName: value ? value.itemName : "" } : issue
      )
    );
  };

  const handleAddStockIssue = () => {
    setStockIssues((prevIssues) => [
      ...prevIssues,
      { itemName: "", faultyQuantity: 0, reason: "", remarks: "" },
    ]);
  };

  const handleRemoveStockIssue = (index) => {
    setStockIssues((prevIssues) => prevIssues.filter((_, i) => i !== index));
  };

  const calculateFaultyUnitsPrice = () => {
    return stockIssues.reduce((total, issue) => {
      const product = selectedProducts.find((p) => p.itemName === issue.itemName);
      if (product) {
        const productInfo = products.find((p) => p.id.toString() === product.itemId);
        if (productInfo) {
          const packSize = productInfo.packSize || 1;
          const unitPrice = Number(productInfo.purchaseRate || productInfo.purchasePrice || 0) / Number(packSize);
          const faultyQuantity = Number(issue.faultyQuantity) || 0;
          const issuePrice = unitPrice * faultyQuantity;
          return total + issuePrice;
        }
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const suppliersData = await getSuppliers();
        setProducts(Array.isArray(productsData) ? productsData : []);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setSuppliers([]);
        errorPopup('Failed to load products and suppliers');
      }
    };

    fetchLocations();
    fetchData();
  }, []);

  return (
    <PageAnimate>
      <div className={styles.pageContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.titleWrapper}>
                <FiPackage className={styles.titleIcon} />
                <div>
                  <h1 className={styles.pageTitle}>Add to Inventory</h1>
                  <p className={styles.pageSubtitle}>Create and manage product batches</p>
                </div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <MouseHoverPopover
                triggerElement={
                  <button className={styles.invoiceBtn} onClick={handleOpenInvoice}>
                    <FiFileText />
                  </button>
                }
                popoverContent={<span className="text-xs">View Invoice</span>}
              />
              <button
                onClick={handleSubmit}
                disabled={!selectedLocation || !selectedSupplier || selectedProducts.length === 0}
                className={styles.submitBtn}
              >
                <FiCheckCircle />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          {/* Left Panel - Form Section */}
          <div className={styles.leftPanel}>
            <div className={styles.formCard}>
              <h2 className={styles.sectionTitle}>Batch Details</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Warehouse *</label>
                  <div className={styles.selectWrapper}>
                    <DropdownBar
                      data={locations}
                      selectedData={selectedLocation}
                      setSelectedData={setSelectedLocation}
                      label={"Select Warehouse"}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <button
                    type="button"
                    onClick={() => setOpenLocationModal(true)}
                    className={styles.addNewBtn}
                  >
                    <FiPlus /> New Warehouse
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Entry Date *</label>
                  <InputBox
                    name="entryDate"
                    type="date"
                    placeholder={"dd/mm/yyyy"}
                    value={formData?.entryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, entryDate: e.target.value }))
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Batch Number *</label>
                  <InputBox
                    name="batchNumber"
                    type="text"
                    placeholder={"Enter batch number"}
                    value={formData?.batchNumber}
                    startText={"#"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Invoice Number</label>
                  <InputBox
                    name="invoiceNumber"
                    type="text"
                    placeholder={"Enter invoice number"}
                    value={formData?.invoiceNumber}
                    startText={"#"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))
                    }
                  />
                  {/* <span className={styles.note}>Not in backend - optional field</span> */}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Supplier *</label>
                  <div className={styles.selectWrapper}>
                    {suppliers.length > 0 && (
                      <DropdownBar
                        data={suppliers}
                        selectedData={selectedSupplier}
                        setSelectedData={setSelectedSupplier}
                        label={"Select Supplier"}
                      />
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Remarks</label>
                  <textarea
                    name="remarks"
                    className={styles.textarea}
                    placeholder="Add any remarks..."
                    value={formData?.remarks || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, remarks: e.target.value }))
                    }
                    rows="3"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenProductModal(true)}
                className={styles.addProductsBtn}
              >
                <FiPlus /> Add Products
              </button>
            </div>
          </div>

          {/* Right Panel - Summary Section */}
          <div className={styles.rightPanel}>
            {/* Products Summary */}
            <div className={styles.summaryCard}>
              <h2 className={styles.sectionTitle}>Added Products</h2>
              
              {selectedProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiPackage className={styles.emptyIcon} />
                  <p>No products added yet</p>
                  <span>Add products to continue</span>
                </div>
              ) : (
                <div className={styles.productsList}>
                  {selectedProducts.map((product, index) => (
                    <div key={index} className={styles.productCard}>
                      <div className={styles.productHeader}>
                        <h3 className={styles.productName}>{product.itemName}</h3>
                        <button
                          onClick={() => handleRemoveProduct(product.itemId)}
                          className={styles.removeBtn}
                          title="Remove product"
                        >
                          <FiMinus />
                        </button>
                      </div>
                      
                      <div className={styles.productDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Quantity:</span>
                          <span className={styles.value}>{product.quantity}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Unit Price:</span>
                          <span className={styles.value}>₹{formatToIndianCurrency(Number(product.recordUnitPrice || 0).toFixed(2))}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Pack Size:</span>
                          <span className={styles.value}>{product.packSize}</span>
                        </div>
                        {product.discount > 0 && (
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Discount:</span>
                            <span className={styles.value}>{product.discount}{product.discountType === "percentage" ? "%" : "₹"}</span>
                          </div>
                        )}
                        {product.manufactureDate && (
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Mfg Date:</span>
                            <span className={styles.value}>{product.manufactureDate}</span>
                          </div>
                        )}
                        {product.expiryDate && (
                          <div className={styles.detailRow}>
                            <span className={styles.label}>Expiry:</span>
                            <span className={styles.value}>{product.expiryDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            {selectedProducts.length > 0 && (
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Cost Summary</h3>
                <div className={styles.costRow}>
                  <span className={styles.costLabel}>Total Price:</span>
                  <span className={styles.costValue}>₹{formatToIndianCurrency(totalPrice.toFixed(2))}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stock Issues Section */}
        <div className={styles.stockIssuesSection}>
          <div className={styles.issuesHeader}>
            <div className={styles.issuesTitleWrapper}>
              <FiAlertTriangle className={styles.issuesIcon} />
              <h2 className={styles.issuesTitle}>Report Stock Issues</h2>
            </div>
            <button
              type="button"
              onClick={handleAddStockIssue}
              className={styles.addIssueBtn}
            >
              <FiPlus /> Add Issue
            </button>
          </div>

          {stockIssues.length === 0 ? (
            <div className={styles.issuesEmpty}>
              <p>No stock issues reported</p>
            </div>
          ) : (
            <div className={styles.issuesList}>
              {stockIssues.map((issue, index) => (
                <div key={index} className={styles.issueCard}>
                  <div className={styles.issueGrid}>
                    <div className={styles.issueField}>
                      <label className={styles.label}>Product</label>
                      <select
                        value={issue.itemName || ""}
                        onChange={(e) => {
                          const selected = selectedProducts.find(p => p.itemName === e.target.value);
                          handleSelectProduct(index, null, selected);
                        }}
                        className={styles.select}
                      >
                        <option value="">Select Product</option>
                        {selectedProducts.map((product) => (
                          <option key={product.itemId} value={product.itemName}>
                            {product.itemName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.issueField}>
                      <label className={styles.label}>Faulty Quantity</label>
                      <input
                        type="number"
                        name="faultyQuantity"
                        value={issue.faultyQuantity}
                        onChange={(e) => handleIssueChange(index, e)}
                        className={styles.input}
                        min="0"
                      />
                    </div>

                    <div className={styles.issueField}>
                      <label className={styles.label}>Reason</label>
                      <select
                        name="reason"
                        value={issue.reason || ""}
                        onChange={(e) => handleIssueChange(index, e)}
                        className={styles.select}
                      >
                        <option value="">Select Reason</option>
                        <option value="leakage">Leakage</option>
                        <option value="breakage">Breakage</option>
                        <option value="shortage">Shortage</option>
                        <option value="bbd">BBD</option>
                      </select>
                    </div>

                    <div className={styles.issueField}>
                      <label className={styles.label}>Remarks</label>
                      <textarea
                        name="remarks"
                        value={issue.remarks}
                        onChange={(e) => handleIssueChange(index, e)}
                        className={styles.textarea}
                        rows="2"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStockIssue(index)}
                    className={styles.removeIssueBtn}
                  >
                    <FiMinus /> Remove
                  </button>
                </div>
              ))}

              {stockIssues.length > 0 && (
                <div className={styles.faultyUnitsSummary}>
                  <span className={styles.faultyLabel}>Aggregated Price for Faulty Units:</span>
                  <span className={styles.faultyValue}>₹{formatToIndianCurrency(calculateFaultyUnitsPrice().toFixed(2))}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ProductModal
          open={openProductModal}
          handleClose={closeProductModal}
          products={products.filter(
            (product) =>
              !selectedProducts.some((p) => p.itemId === product.id.toString())
          )}
          selectedProducts={selectedProducts}
          handleAddProduct={handleAddProduct}
          handleRemoveProduct={handleRemoveProduct}
        />

        <AddLocationModal
          open={openLocationModal}
          handleClose={closeLocationModal}
          fetchLocations={fetchLocations}
        />

        <BatchInvoicePreview
          open={openInvoice}
          handleClose={handleCloseInvoice}
          formData={formData}
          selectedProducts={selectedProducts}
          totalPrice={totalPrice}
          selectedSupplier={selectedSupplier}
          selectedLocation={selectedLocation}
          stockIssues={stockIssues}
        />
      </div>
    </PageAnimate>
  );
};

export default AddInventory;
