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

interface SubBatch {
  id: string;
  subBatchId?: number;
  itemId?: number;
  itemName: string;
  quantity: number | string;
  packSize: number | string;
  recordUnitPrice: number | string;
  discount: number | string;
  discountType: string;
  manufactureDate: string;
  expiryDate: string;
}

const EditBatch = () => {
  const { batchId } = useParams<{ batchId: string }>();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [organization, setOrganization] = useState<Organization>(
    {} as Organization,
  );

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

  const [itemsInBatch, setItemsInBatch] = useState<any[]>([]);

  const [batchData, setBatchData] = useState<any>(null);
  const [formState, setFormState] = useState<any>({
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

      // Extract unique items present in the batch
      const uniqueItems = batch.subBatch.reduce((acc: any[], item: any) => {
        if (!acc.some((i) => i.id === item.itemId)) {
          acc.push({
            id: item.itemId,
            name: item.itemName || "",
          });
        }
        return acc;
      }, []);
      setItemsInBatch(uniqueItems);

      // Map itemName to itemId for stockIssues
      const stockIssuesWithItemId =
        batch.stockIssues?.map((issue: any) => {
          const matchingItem = uniqueItems.find(
            (item) => item.name === issue.itemName,
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
          batch.subBatch.map((item: any) => ({
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

  // Add handlers for modal
  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleCloseInvoice = () => setOpenInvoice(false);

  useEffect(() => {
    // Extract unique items from formState.subBatch
    const uniqueItems = formState.subBatch.reduce((acc: any[], item: any) => {
      if (item.itemId && !acc.some((i) => i.id === item.itemId)) {
        acc.push({
          id: item.itemId,
          name: item.itemName || "",
        });
      }
      return acc;
    }, []);
    setItemsInBatch(uniqueItems);

    setFormState((prevState: any) => ({
      ...prevState,
      stockIssues: prevState.stockIssues
        .map((issue: any) => {
          const itemExists = uniqueItems.some(
            (item) => item.id === issue.itemId,
          );
          if (!itemExists) {
            // Option 1: Remove the stock issue
            // return null;

            // Option 2: Reset itemId and itemName
            return {
              ...issue,
              itemId: "",
              itemName: "",
            };
          }
          return issue;
        })
        .filter(Boolean), // Remove nulls if using Option 1
    }));
  }, [formState.subBatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => ({ ...prevState, [name]: value }));
  };
  const handleItemChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "itemId") {
      const selectedItem = itemsList.find(
        (item) => item.id === parseInt(value, 10),
      );
      setFormState((prevState: any) => ({
        ...prevState,
        subBatch: prevState.subBatch.map((item: any) =>
          item.id === id
            ? {
                ...item,
                itemId: parseInt(value, 10),
                itemName: selectedItem?.name || "",
              }
            : item,
        ),
      }));
    } else {
      setFormState((prevState: any) => ({
        ...prevState,
        subBatch: prevState.subBatch.map((item: any) =>
          item.id === id ? { ...item, [name]: value } : item,
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
    setFormState((prevState: any) => ({
      ...prevState,
      subBatch: [...prevState.subBatch, newItem],
    }));
  };

  const handleDeleteItem = (id: string) => {
    setFormState((prevState: any) => ({
      ...prevState,
      subBatch: prevState.subBatch.filter((item: any) => item.id !== id),
    }));
  };

  const handleIssueChange = (
    id: string,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    if (name === "itemId") {
      const selectedItem = itemsInBatch.find(
        (item) => item.id.toString() === value.toString(),
      );
      setFormState((prevState: any) => ({
        ...prevState,
        stockIssues: prevState.stockIssues.map((issue: any) =>
          issue.id === id
            ? {
                ...issue,
                itemId: value,
                itemName: selectedItem?.name || "",
              }
            : issue,
        ),
      }));
    } else {
      setFormState((prevState: any) => ({
        ...prevState,
        stockIssues: prevState.stockIssues.map((issue: any) =>
          issue.id === id ? { ...issue, [name]: value } : issue,
        ),
      }));
    }
  };

  // Handle adding a new stock issue
  const handleAddIssue = () => {
    const newIssue = {
      id: generateUniqueId(),
      stockIssueId: null, // New issue will not have an ID yet
      itemId: "",
      itemName: "",
      faultyQuantity: "",
      reason: "", // Added field
      remarks: "",
      dateAdded: new Date().toISOString().substring(0, 10),
      addedBy: "", // Set this to the current user's name if available
    };
    setFormState((prevState: any) => ({
      ...prevState,
      stockIssues: [...prevState.stockIssues, newIssue],
    }));
  };

  // Handle deleting a stock issue
  const handleDeleteIssue = (id: string) => {
    setFormState((prevState: any) => ({
      ...prevState,
      stockIssues: prevState.stockIssues.filter(
        (issue: any) => issue.id !== id,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  const [itemsList, setItemsList] = useState<any[]>([]);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [warehousesList, setWarehousesList] = useState<any[]>([]);

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
      <h2 className="text-2xl font-bold mb-4">Edit Batch #{batchId}</h2>

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
        popoverContent={<span className="text-xs">View Invoice</span>}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Batch Details */}
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
                      {" "}
                      {warehouse.name}{" "}
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
                      {" "}
                      {supplier.name}{" "}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Sub-Batches */}
        <BatchItemsEditTab
          items={formState.subBatch}
          availableItems={itemsList}
          handleItemChange={handleItemChange}
          handleDeleteItem={handleDeleteItem}
          handleAddItem={handleAddItem}
        />

        {/* Stock Issues */}
        <StockIssuesEditTab
          issues={formState.stockIssues}
          availableItems={itemsInBatch}
          handleIssueChange={handleIssueChange}
          handleDeleteIssue={handleDeleteIssue}
          handleAddIssue={handleAddIssue}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          {" "}
          <Button type="submit" variant="contained" color="primary">
            {" "}
            Update Batch{" "}
          </Button>{" "}
        </div>
      </form>

      {/* Invoice Preview Modal */}
      <BatchInvoicePreview
        open={openInvoice}
        handleClose={handleCloseInvoice}
        formData={formState}
        selectedProducts={formState.subBatch}
        totalPrice={formState.batchPrice}
        selectedSupplier={suppliersList.find(
          (s) => s.id === Number(formState.supplierId),
        )}
        selectedLocation={warehousesList.find(
          (w) => w.id === Number(formState.warehouseId),
        )}
        stockIssues={formState.stockIssues}
      />
    </PageAnimate>
  );
};

export default EditBatch;
