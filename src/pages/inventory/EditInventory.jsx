import StockIssuesEditTab from "./StockIssuesEditTab";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BatchInvoicePreview from "./yeah"; // Import your batch
import { useNavigate, useParams } from "react-router-dom";
import { getRequest, getRow, getStuff, updatePut } from "../../network/api";
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
import styles from './styles/EditBatch.module.css';

const EditBatch = () => {
  const { batchId } = useParams();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getRequest(`/organization`);
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };

    fetchOrganization();
  }, []);

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
      const data = await getRow(`/inventory/edit/${batchId}`);
      const batch = data[0];
      setBatchData(batch);

      const uniqueItems = batch.subBatch.reduce((acc, item) => {
        if (!acc.some((i) => i.id === item.itemId)) {
          acc.push({
            id: item.itemId,
            name: item.itemName || "",
          });
        }
        return acc;
      }, []);
      setItemsInBatch(uniqueItems);

      const stockIssuesWithItemId =
        batch.stockIssues?.map((issue) => {
          const matchingItem = uniqueItems.find(
            (item) => item.name === issue.itemName
          );
          return {
            id: generateUniqueId(),
            stockIssueId: issue.stockIssueId,
            itemId: matchingItem?.id || "",
            itemName: issue.itemName || "",
            reason: issue.reason,
            faultyQuantity: issue.faultyQuantity || "",
            remarks: issue.remarks || "",
            dateAdded: issue.dateAdded ? issue.dateAdded.substring(0, 10) : "",
            addedBy: issue.addedBy || "",
          };
        }) || [];

      setFormState({
        batchNumber: batch.batchNumber || "",
        invoiceNumber: batch.invoiceNumber || "",
        batchPrice: batch.batchPrice || "",
        entryDate: batch.entryDate ? batch.entryDate.substring(0, 10) : "",
        qualityPass: batch.qualityPass || "",
        status: batch.status || "",
        warehouseId: batch.warehouseId || "",
        supplierId: batch.supplierId || "",
        subBatch:
          batch.subBatch.map((item) => ({
            id: generateUniqueId(),
            subBatchId: item.subBatchId,
            itemId: item.itemId,
            itemName: item.itemName || "",
            quantity: item.quantity || "",
            packSize: item.packSize || "",
            recordUnitPrice: item.recordUnitPrice || "",
            discount: item.discount || "",
            discountType: item.discountType || "",
            manufactureDate: item.manufactureDate
              ? item.manufactureDate.substring(0, 10)
              : "",
            expiryDate: item.expiryDate ? item.expiryDate.substring(0, 10) : "",
          })) || [],
        stockIssues: stockIssuesWithItemId,
      });
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

    console.log(formState);

    const response = await updatePut(`/inventory/edit/${batchId}`, formState);
    if (response !== 200) {
      console.error("Failed to update batch");
      errorPopup("Failed to update the batch");
      return;
    }
    successPopup("Batch Updated!");
    navigate("/inventory");
  };

  const [itemsList, setItemsList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const itemsData = await getStuff("/products/options");
      setItemsList(itemsData);
      const suppliersData = await getStuff("/suppliers/options");
      setSuppliersList(suppliersData);
      const warehousesData = await getStuff("/inventory/warehouses");
      setWarehousesList(warehousesData);
    };
    fetchOptions();
  }, []);

  if (!batchData) return <SpinnerFullPage />;

  return (
  <PageAnimate>
    <h2 className={styles.heading}>Edit Batch #{batchId}</h2>

    <MouseHoverPopover
      triggerElement={
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenInvoice}
        >
          <ReceiptIcon />
        </Button>
      }
      popoverContent={<span className={styles.popoverText}>View Invoice</span>}
    />

    <form onSubmit={handleSubmit} className={styles.formSpacing}>
      <div className={styles.sectionSpacing}>
        <h3 className="text-xl font-semibold">Batch Details</h3>
        <div className={styles.gridCols}>
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
                    {supplier.name}
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

      <div className={styles.alignRight}>
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