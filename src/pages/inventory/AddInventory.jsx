import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import ProductModal from "./ProductModal";
import PageAnimate from "../../components/Animate/PageAnimate";
import {
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Box,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { getWarehouses, getProducts, getSuppliers, createBatch } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatToIndianCurrency } from "../../utils/FormHelper";
import InputBox from "../../components/FormComponent/InputBox";
import MouseHoverPopover from "../../components/core/Explain";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddLocationModal from "./AddLocationModal";
import DropdownBar from "../../components/FormComponent/DropdownBar";
import BatchInvoicePreview from "./yeah";

const AddInventory = () => {
  const [locations, setLocations] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);

  const closeLocationModal = () => {
    setOpenLocationModal(false);
  };
  const closeProductModal = () => {
    setOpenProductModal(false);
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  const fetchLocations = async () => {
    try {
      const data = await getWarehouses();
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLocations([]);
    }
  };

  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const [formData, setFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stockIssues, setStockIssues] = useState([]);

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedSupplier || selectedProducts.length === 0) {
      errorPopup("Please select warehouse, supplier, and add products!");
      return;
    }

    if (!formData.batchNumber || !formData.entryDate) {
      errorPopup("Please fill in batch number and entry date!");
      return;
    }

    // Validate selected products
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

    // Create batch data for each product (new API expects one batch per product)
    const totalQuantity = selectedProducts.reduce((total, product) => total + Number(product.quantity), 0);
    
    try {
      // Create a batch for the first product (or create multiple batches if needed)
      const mainProduct = selectedProducts[0];
      const batchData = {
        productId: Number(mainProduct.itemId),
        supplierId: Number(selectedSupplier?.id),
        batchCode: formData.batchNumber,
        purchaseDate: formData.entryDate,
        expiryDate: mainProduct.expiryDate || null,
        quantity: Number(mainProduct.quantity),
        remainingQuantity: Number(mainProduct.quantity),
        unitCost: Number(mainProduct.recordUnitPrice),
        warehouseId: Number(selectedLocation?.id),
        remarks: formData.remarks || '',
        isActive: true
      };

      const response = await createBatch(batchData);

      if (response === 201 || response === 200) {
        successPopup("Batch added successfully!");
        navigate("/inventory");
      } else {
        errorPopup("Failed to add batch");
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      errorPopup("Error adding batch!");
    }
  };

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
      const productInfo = products.find((p) => p.id.toString() === product.itemId);
      if (productInfo) {
        const productPrice = productInfo.purchaseRate || 0;
        const discountedPrice =
          product.discountType === "percentage"
            ? productPrice * product.quantity * (1 - product.discount / 100)
            : productPrice * product.quantity - product.discount;
        return total + discountedPrice;
      }
      return total;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

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

  const [openInvoice, setOpenInvoice] = useState(false);

  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleCloseInvoice = () => setOpenInvoice(false);

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
          const unitPrice = Number(productInfo.purchasePrice || productInfo.purchaseRate || 0) / Number(packSize);
          const faultyQuantity = Number(issue.faultyQuantity) || 0;

          const issuePrice = unitPrice * faultyQuantity;

          return total + issuePrice;
        }
      }

      return total;
    }, 0);
  };

  return (
    <PageAnimate>
      <div className={"w-full flex flex-col gap-8 justify-center items-center"}>
        <div className="flex items-center justify-between p-4 gap-4 w-full">
          <h1
            className={
              "text-2xl transition p-4 hover:shadow-lg w-full text-center border font-extrabold idms-inventory"
            }
          >
            adding to <span className={"text-rose-400"}>inventory</span>.
          </h1>
          <div>
            <MouseHoverPopover
              triggerElement={
                <Button variant={"outlined"} color="primary" onClick={handleOpenInvoice}>
                  <ReceiptIcon />
                </Button>
              }
              popoverContent={<span className="text-xs"> View Invoice </span>}
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
          <button
            onClick={handleSubmit}
            type="submit"
            className="py-3 px-12 m-5 shadow-xl w-fit misc-button"
            disabled={
              !selectedLocation ||
              !selectedSupplier ||
              selectedProducts.length === 0
            }
          >
            <CheckCircleIcon />
            <span className="ml-2">Submit</span>
          </button>
        </div>

        {selectedProducts.length > 0 && (
          <section className="flex gap-4 p-4 w-full overflow-x-scroll">
            {selectedProducts.map((product, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-2 p-2 rounded-lg relative"
              >
                <h1 className="text-lg font-semibold">{product.itemName}</h1>
                <p className="text-sm">Quantity: {product.quantity}</p>
                <p className="text-sm">Pack Size: {product.packSize}</p>
                <p className="text-sm">Discount: {product.discount}</p>
                <p className="text-sm font-semibold">
                  Manufacture Date: {product.manufactureDate}
                </p>
                <p className="text-sm font-semibold">
                  {product.expiryDate
                    ? `Expiry Date: ${product.expiryDate}`
                    : "No expiry for the product"}
                </p>
                <button
                  onClick={() => handleRemoveProduct(product.itemId)}
                  className="p-2 rounded-full text-red-400 absolute top-0 right-0"
                >
                  <RemoveCircleOutlineIcon />
                </button>
              </div>
            ))}
          </section>
        )}

        <Typography variant="h6" className="mt-4">
          Total Price: ₹{formatToIndianCurrency(totalPrice.toFixed(2))}
        </Typography>

        <form
          className={
            "flex flex-col justify-center items-center p-8 gap-8 border-2 w-full h-fit"
          }
        >
          <div className={"flex gap-2 w-full"}>
            <div className="w-full">
              <DropdownBar
                data={locations}
                selectedData={selectedLocation}
                setSelectedData={setSelectedLocation}
                label={"Warehouse"}
              />
            </div>
            <Button
              sx={{
                textTransform: "capitalize",
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
                padding: "1rem",
              }}
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenLocationModal(true)}
            >
              new warehouse?
            </Button>
          </div>

          <InputBox
            name="entryDate"
            type="date"
            label="Entry"
            placeholder={"dd/mm/yyyy"}
            value={formData?.entryDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, entryDate: e.target.value }))
            }
          />

          <InputBox
            name="batchNumber"
            type="text"
            label="Batch Number"
            placeholder={"xxxxxxxxxxx"}
            value={formData?.batchNumber}
            startText={"#"}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))
            }
            required
          />
          <InputBox
            name="invoiceNumber"
            type="text"
            label="Invoice Number"
            placeholder={"xxxxxxxxxxx"}
            value={formData?.invoiceNumber}
            startText={"#"}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))
            }
          />

          {suppliers.length > 0 && (
            <div className={"w-full"}>
              <DropdownBar
                data={suppliers}
                selectedData={selectedSupplier}
                setSelectedData={setSelectedSupplier}
                label={"Supplier"}
              />
            </div>
          )}

          <Button
            sx={{ textTransform: "capitalize" }}
            startIcon={<PlaylistAddCheckCircleIcon />}
            onClick={() => setOpenProductModal(true)}
          >
            Add Items
          </Button>
        </form>

        <Accordion sx={{ width: "100%", marginTop: 4 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="stock-issue-content"
            id="stock-issue-header"
          >
            <Typography variant="h6">Report Stock Issue</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {stockIssues.map((issue, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    border: "1px solid #ccc",
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Autocomplete
                    options={selectedProducts}
                    getOptionLabel={(option) => option.itemName}
                    onChange={(event, value) =>
                      handleSelectProduct(index, event, value)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Product" />
                    )}
                  />
                  <TextField
                    label="Faulty Quantity"
                    name="faultyQuantity"
                    type="number"
                    value={issue.faultyQuantity}
                    onChange={(e) => handleIssueChange(index, e)}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Reason</InputLabel>
                    <Select
                      name="reason"
                      value={issue.reason || ""}
                      onChange={(e) => handleIssueChange(index, e)}
                    >
                      <MenuItem value="leakage">Leakage</MenuItem>
                      <MenuItem value="breakage">Breakage</MenuItem>
                      <MenuItem value="shortage">Shortage</MenuItem>
                      <MenuItem value="bbd">BBD</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Remarks"
                    name="remarks"
                    value={issue.remarks}
                    onChange={(e) => handleIssueChange(index, e)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveStockIssue(index)}
                  >
                    Remove Issue
                  </Button>
                </Box>
              ))}
              <Typography variant="h6" className="mt-4">
                Aggregated Price for Faulty Units: ₹
                {formatToIndianCurrency(calculateFaultyUnitsPrice().toFixed(2))}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddStockIssue}
              >
                Add Issue
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>

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
    </PageAnimate>
  );
};

export default AddInventory;