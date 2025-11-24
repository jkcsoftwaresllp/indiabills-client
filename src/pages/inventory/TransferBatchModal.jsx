import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getBatchesByWarehouse, transferBatch } from "../../network/api";

const TransferBatchModal = ({
  open,
  onClose,
  warehouses,
  selectedWarehouse,
  onSuccess,
  errorPopup,
  successPopup,
}) => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState(selectedWarehouse || null);
  const [destinationWarehouse, setDestinationWarehouse] = useState(null);
  const [fromBatchCode, setFromBatchCode] = useState("");
  const [toBatchCode, setToBatchCode] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch batches when source warehouse changes
  useEffect(() => {
    if (sourceWarehouse) {
      fetchBatches(sourceWarehouse.id);
    } else {
      setBatches([]);
      setProducts([]);
    }
  }, [sourceWarehouse]);

  const fetchBatches = async (warehouseId) => {
    try {
      setLoading(true);
      const batchesData = await getBatchesByWarehouse(warehouseId);
      setBatches(batchesData);
      
      // Extract unique products
      const uniqueProducts = [
        ...new Map(batchesData.map((batch) => [batch.productId, batch])).values(),
      ];
      setProducts(uniqueProducts);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setError("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  // Filter batches by selected product
  const filteredBatches = batches.filter((batch) => {
    if (!productId) return true;
    return batch.productId === parseInt(productId);
  });

  const handleTransfer = async () => {
    setError("");

    // Validation
    if (!sourceWarehouse) {
      setError("Please select a source warehouse");
      return;
    }
    if (!destinationWarehouse) {
      setError("Please select a destination warehouse");
      return;
    }
    if (sourceWarehouse.id === destinationWarehouse.id) {
      setError("Source and destination warehouses must be different");
      return;
    }
    if (!productId) {
      setError("Please select a product");
      return;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        from_warehouse_id: sourceWarehouse.id,
        to_warehouse_id: destinationWarehouse.id,
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
      };

      // Add optional fields if provided
      if (fromBatchCode.trim()) {
        payload.from_batch_code = fromBatchCode.trim();
      }
      if (toBatchCode.trim()) {
        payload.to_batch_code = toBatchCode.trim();
      }

      const response = await transferBatch(payload);
      successPopup("Batch transferred successfully");
      onSuccess();
      handleClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to transfer batch";
      setError(errorMessage);
      errorPopup(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setFromBatchCode("");
    setToBatchCode("");
    setProductId("");
    setQuantity("");
    setSourceWarehouse(selectedWarehouse || null);
    setDestinationWarehouse(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Transfer Batch</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth>
            <InputLabel>Source Warehouse</InputLabel>
            <Select
              value={sourceWarehouse?.id || ""}
              onChange={(e) => {
                const warehouse = warehouses.find((w) => w.id === e.target.value);
                setSourceWarehouse(warehouse);
              }}
              label="Source Warehouse"
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Destination Warehouse</InputLabel>
            <Select
              value={destinationWarehouse?.id || ""}
              onChange={(e) => {
                const warehouse = warehouses.find((w) => w.id === e.target.value);
                setDestinationWarehouse(warehouse);
              }}
              label="Destination Warehouse"
            >
              {warehouses
                .filter((w) => w.id !== sourceWarehouse?.id)
                .map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={loading || !sourceWarehouse}>
            <InputLabel>Product</InputLabel>
            <Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              label="Product"
            >
              {products.map((product) => (
                <MenuItem key={product.productId} value={product.productId}>
                  {product.product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={loading || !productId}>
            <InputLabel>Source Batch (Optional)</InputLabel>
            <Select
              value={fromBatchCode}
              onChange={(e) => setFromBatchCode(e.target.value)}
              label="Source Batch (Optional)"
            >
              <MenuItem value="">All batches</MenuItem>
              {filteredBatches.map((batch) => (
                <MenuItem key={batch.id} value={batch.batchCode}>
                  {batch.batchCode} (Qty: {batch.remainingQuantity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Destination Batch Code (Optional)"
            variant="outlined"
            value={toBatchCode}
            onChange={(e) => setToBatchCode(e.target.value)}
            placeholder="Leave empty to merge into earliest batch or create new"
            disabled={loading}
            helperText="Leave empty to merge into earliest batch or create new batch"
          />

          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            disabled={loading}
            required
          />

          {fromBatchCode && filteredBatches.length > 0 && (
            <Box sx={{ p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption" display="block">
                <strong>Source Batch Info:</strong>
              </Typography>
              {filteredBatches
                .filter((b) => b.batchCode === fromBatchCode)
                .map((batch) => (
                  <Typography key={batch.id} variant="caption" display="block">
                    Remaining: {batch.remainingQuantity} | Cost: ₹
                    {batch.unitCost}
                  </Typography>
                ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleTransfer}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Transfer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferBatchModal;
