import { FiEdit, FiFileText } from 'react-icons/fi';
import StockIssuesEditTab from "./StockIssuesEditTab";
import BatchInvoicePreview from "./yeah"; // Import your batch
import { useNavigate, useParams } from "react-router-dom";
import { getBatchById, updateBatch, getProducts, getSuppliers, getWarehouses } from "../../network/api";
import { useEffect, useState } from "react";
import PageAnimate from "../../components/Animate/PageAnimate";
import BatchItemsEditTab from "./BatchItemsEditTab";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import SpinnerFullPage from "../more/spinner";
import { useStore } from "../../store/store";
import MouseHoverPopover from "../../components/core/Explain";

const EditBatch = () => {
  const { batchId } = useParams();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [organization, setOrganization] = useState({});

  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const [itemsInBatch, setItemsInBatch] = useState([]);

  const [batchData, setBatchData] = useState(null);
  const [formState, setFormState] = useState({
    batchNumber: "",
    invoiceNumber: "",
    batchPrice: "",
    entryDate: "",
    qualityPass: "",
    status: "",
    warehouseId: "",
    supplierId: "",
    subBatch: [],
    stockIssues: [],
  });

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batch = await getBatchById(batchId);
        if (batch) {
          setBatchData(batch);

          // Map batch data to form state
          setFormState({
            batchNumber: batch.batchCode || "",
            invoiceNumber: batch.invoiceNumber || "",
            batchPrice: (batch.quantity * batch.unitCost) || "",
            entryDate: batch.purchaseDate ? batch.purchaseDate.split('T')[0] : "",
            qualityPass: batch.qualityPass || "ok",
            status: batch.isActive ? "active" : "inactive",
            warehouseId: batch.warehouseId || "",
            supplierId: batch.supplierId || "",
            subBatch: [{
              id: generateUniqueId(),
              subBatchId: batch.id,
              itemId: batch.productId,
              itemName: batch.productName || "",
              quantity: batch.quantity || "",
              packSize: 1,
              recordUnitPrice: batch.unitCost || "",
              discount: 0,
              discountType: "percentage",
              manufactureDate: batch.manufactureDate ? batch.manufactureDate.split('T')[0] : "",
              expiryDate: batch.expiryDate ? batch.expiryDate.split('T')[0] : "",
            }],
            stockIssues: [],
          });
        } else {
          errorPopup('Batch not found');
          navigate('/inventory');
        }
      } catch (error) {
        console.error('Error fetching batch:', error);
        errorPopup('Failed to load batch data');
        navigate('/inventory');
      }
    };

    fetchData();
  }, [batchId]);

  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleCloseInvoice = () => setOpenInvoice(false);

  useEffect(() => {
    const uniqueItems = formState.subBatch.reduce((acc, item) => {
      if (item.itemId && !acc.some((i) => i.id === item.itemId)) {
        acc.push({
          id: item.itemId,
          name: item.itemName || "",
        });
      }
      return acc;
    }, []);
    setItemsInBatch(uniqueItems);

    setFormState((prevState) => ({
      ...prevState,
      stockIssues: prevState.stockIssues
        .map((issue) => {
          const itemExists = uniqueItems.some(
            (item) => item.id === issue.itemId
          );
          if (!itemExists) {
            return {
              ...issue,
              itemId: "",
              itemName: "",
            };
          }
          return issue;
        })
        .filter(Boolean),
    }));
  }, [formState.subBatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleItemChange = (id, e) => {
    const { name, value } = e.target;

    if (name === "itemId") {
      const selectedItem = itemsList.find(
        (item) => item.id === parseInt(value, 10)
      );
      setFormState((prevState) => ({
        ...prevState,
        subBatch: prevState.subBatch.map((item) =>
          item.id === id
            ? {
                ...item,
                itemId: parseInt(value, 10),
                itemName: selectedItem?.name || "",
              }
            : item
        ),
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        subBatch: prevState.subBatch.map((item) =>
          item.id === id ? { ...item, [name]: value } : item
        ),
      }));
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: generateUniqueId(),
      itemId: "",
      itemName: "",
      quantity: "",
      packSize: "",
      recordUnitPrice: "",
      discount: "",
      discountType: "",
      manufactureDate: "",
      expiryDate: "",
    };
    setFormState((prevState) => ({
      ...prevState,
      subBatch: [...prevState.subBatch, newItem],
    }));
  };

  const handleDeleteItem = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      subBatch: prevState.subBatch.filter((item) => item.id !== id),
    }));
  };

  const handleIssueChange = (id, e) => {
    const { name, value } = e.target;

    if (name === "itemId") {
      const selectedItem = itemsInBatch.find(
        (item) => item.id.toString() === value.toString()
      );
      setFormState((prevState) => ({
        ...prevState,
        stockIssues: prevState.stockIssues.map((issue) =>
          issue.id === id
            ? {
                ...issue,
                itemId: value,
                itemName: selectedItem?.name || "",
              }
            : issue
        ),
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        stockIssues: prevState.stockIssues.map((issue) =>
          issue.id === id ? { ...issue, [name]: value } : issue
        ),
      }));
    }
  };

  const handleAddIssue = () => {
    const newIssue = {
      id: generateUniqueId(),
      stockIssueId: null,
      itemId: "",
      itemName: "",
      faultyQuantity: "",
      reason: "",
      remarks: "",
      dateAdded: new Date().toISOString().substring(0, 10),
      addedBy: "",
    };
    setFormState((prevState) => ({
      ...prevState,
      stockIssues: [...prevState.stockIssues, newIssue],
    }));
  };

  const handleDeleteIssue = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      stockIssues: prevState.stockIssues.filter(
        (issue) => issue.id !== id
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Map form state back to API format
      const updateData = {
        batchCode: formState.batchNumber,
        purchaseDate: formState.entryDate,
        quantity: Number(formState.subBatch[0]?.quantity),
        remainingQuantity: Number(formState.subBatch[0]?.quantity),
        unitCost: Number(formState.subBatch[0]?.recordUnitPrice),
        warehouseId: Number(formState.warehouseId),
        supplierId: Number(formState.supplierId),
        expiryDate: formState.subBatch[0]?.expiryDate || null,
        remarks: formState.remarks || '',
        isActive: formState.status === "active"
      };

      const status = await updateBatch(batchId, updateData);
      
      if (status === 200) {
        successPopup("Batch updated successfully!");
        navigate("/inventory");
      } else {
        errorPopup("Failed to update batch");
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      errorPopup("Failed to update the batch");
    }
  };

  const [itemsList, setItemsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const productsResponse = await getProducts();
        const suppliersResponse = await getSuppliers();
        const warehousesResponse = await getWarehouses();
        
        setItemsList(Array.isArray(productsResponse) ? productsResponse : []);
        setSuppliersList(Array.isArray(suppliersResponse) ? suppliersResponse : []);
        setWarehousesList(Array.isArray(warehousesResponse) ? warehousesResponse : []);
      } catch (error) {
        console.error('Error fetching options:', error);
        setItemsList([]);
        setSuppliersList([]);
        setWarehousesList([]);
      }
    };
    fetchOptions();
  }, []);

  if (!batchData) return <SpinnerFullPage />;

  return (
    <PageAnimate>
      <h2 className="text-2xl font-bold mb-4">Edit Batch #{batchId}</h2>

      <MouseHoverPopover
        triggerElement={
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenInvoice}
          >
            <FiFileText />
          </Button>
        }
        popoverContent={<span className="text-xs">View Invoice</span>}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Batch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextField
                label="Batch Number"
                name="batchNumber"
                value={formState.batchNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={formState.invoiceNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Batch Price"
                name="batchPrice"
                type="number"
                value={formState.batchPrice}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Entry Date"
                name="entryDate"
                type="date"
                value={formState.entryDate}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Quality Pass</InputLabel>
                <Select
                  name="qualityPass"
                  value={formState.qualityPass}
                  onChange={handleInputChange}
                >
                  <MenuItem value="ok">OK</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formState.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="in stock">In Stock</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Warehouse</InputLabel>
                <Select
                  name="warehouseId"
                  value={formState.warehouseId}
                  onChange={handleInputChange}
                >
                  {warehousesList.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  name="supplierId"
                  value={formState.supplierId}
                  onChange={handleInputChange}
                >
                  {suppliersList.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.supplierName || supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <BatchItemsEditTab
          items={formState.subBatch}
          availableItems={itemsList}
          handleItemChange={handleItemChange}
          handleDeleteItem={handleDeleteItem}
          handleAddItem={handleAddItem}
        />

        <StockIssuesEditTab
          issues={formState.stockIssues}
          availableItems={itemsInBatch}
          handleIssueChange={handleIssueChange}
          handleDeleteIssue={handleDeleteIssue}
          handleAddIssue={handleAddIssue}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="contained" color="primary">
            Update Batch
          </Button>
        </div>
      </form>

      <BatchInvoicePreview
        open={openInvoice}
        handleClose={handleCloseInvoice}
        formData={formState}
        selectedProducts={formState.subBatch}
        totalPrice={formState.batchPrice}
        selectedSupplier={suppliersList.find(
          (s) => s.id === Number(formState.supplierId)
        )}
        selectedLocation={warehousesList.find(
          (w) => w.id === Number(formState.warehouseId)
        )}
        stockIssues={formState.stockIssues}
      />
    </PageAnimate>
  );
};

export default EditBatch;