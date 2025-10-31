import DataGrid from "../../components/FormComponent/DataGrid";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RecommendIcon from "@mui/icons-material/Recommend";
import DoneIcon from "@mui/icons-material/Done";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  LocationCity as LocationCityIcon,
  AddCircleRounded,
  SwitchAccessShortcut as SwitchAccessShortcutIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material";
import {
  getStuff,
  getCount,
  deleteRow,
  getWarehouses,
  getBatches,
  getBatchesByWarehouse,
  deleteBatch,
  deleteWarehouse,
  getProducts,
  getSuppliers,
} from "../../network/api";
import PageAnimate from "../../components/Animate/PageAnimate";
import InventoryTable from "./InventoryTable";
import Checklist from "../../components/FormComponent/Checklist";
import ViewData from "../../layouts/form/ViewData";
import {
  CustomPaper,
  CustomPopper,
  formatToIndianCurrency,
} from "../../utils/FormHelper";
import MouseHoverPopover from "../../components/core/Explain";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

const ViewInventory = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const add = () => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/operator/")) {
      navigate("/operator/inventory/add");
    } else {
      navigate("/inventory/add");
    }
  };

  const manageWarehouse = () => {
    setActiveTab(1); // Switch to Warehouses tab
  };

  const transferBatch = () => {
    alert("Transfer batch feature (work in progress)");
  };

  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [entries, setEntries] = useState([]);
  const [sCount, setSCount] = useState(0);
  const [pCount, setPCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubBatches, setSelectedSubBatches] = useState(null);

  const [batchNumberSearch, setBatchNumberSearch] = useState("");
  const [invoiceNumberSearch, setInvoiceNumberSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: Batches, 1: Warehouses

  const handleOpenModal = (subBatches) => {
    setSelectedSubBatches(subBatches);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSubBatches(null);
    setIsModalOpen(false);
  };

  const warehouseColDefs = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: false,
      cellRenderer: (params) => (
        <p>
          <span className="text-blue-950">#</span>
          <span className="font-medium">{params.value}</span>
        </p>
      ),
    },
    {
      field: "name",
      headerName: "Warehouse Name",
      filter: true,
      editable: true,
    },
    { field: "code", headerName: "Code", editable: true },
    { field: "capacity", headerName: "Capacity", editable: true },
    {
      field: "managerName",
      headerName: "Manager",
      editable: true,
      cellStyle: { textTransform: "capitalize" },
    },
    { field: "managerPhone", headerName: "Manager Phone", editable: true },
    { field: "addressLine", headerName: "Address", editable: true },
    {
      field: "city",
      headerName: "City",
      editable: true,
      cellStyle: { textTransform: "capitalize" },
    },
    {
      field: "state",
      headerName: "State",
      editable: true,
      cellStyle: { textTransform: "capitalize" },
    },
    { field: "pinCode", headerName: "Pin Code", editable: true },
    {
      field: "isActive",
      headerName: "Status",
      cellRenderer: (params) => (
        <span
          className={`py-1 px-3 rounded-full text-xs ${
            params.value
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
  ];

  const colDefs = [
    {
      headerName: "ID",
      field: "batchId",
      width: 50,
      cellRenderer: (params) => (
        <p>
          <span className="text-blue-950">#</span>
          <span className="font-medium">{params.value}</span>
        </p>
      ),
    },
    { headerName: "Batch Number", field: "batchNumber", width: 150 },
    { headerName: "Invoice Number", field: "invoiceNumber", width: 150 },
    { headerName: "Product Name", field: "productName", width: 200 },
    { headerName: "Quantity", field: "quantity", width: 100 },
    { headerName: "Remaining", field: "remainingQuantity", width: 100 },
    {
      headerName: "Sub Batches",
      field: "subBatches",
      width: 120,
      cellRenderer: (params) => (
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <button
              id="showSubBatches"
              onClick={() => handleOpenModal(params.data.subBatches)}
              className="text-blue-600 flex items-center gap-2"
            >
              <span className="bg-blue-600 font-bold rounded-full text-xs text-slate-300 flex items-center justify-center p-1 h-4 w-4">
                {params.data.subBatches.length}
              </span>
              <span className="hover:underline">Item(s)</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      headerName: "Batch Price",
      field: "batchPrice",
      width: 150,
      cellClassRules: { money: (p) => p.value },
      valueFormatter: ({ value }) => formatToIndianCurrency(value.toString()),
    },
    {
      headerName: "Entry",
      field: "entryDate",
      width: 210,
      valueFormatter: ({ value }) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      },
    },
    {
      headerName: "Pass",
      field: "qualityPass",
      width: 80,
      cellRenderer: (params) => {
        switch (params.value) {
          case "ok":
            return <DoneIcon sx={{ color: "success.main" }} />;
          case "poor":
            return <ThumbDownIcon sx={{ color: "error.main" }} />;
          case "good":
            return <RecommendIcon sx={{ color: "warning.main" }} />;
          default:
            return params.value;
        }
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      cellRenderer: (params) => (
        <span className="py-px px-5 bg-emerald-50 border border-emerald-300 rounded-xl capitalize text-sm text-emerald-800">
          {params.value}
        </span>
      ),
    },
    { headerName: "Supplier Name", field: "supplierName" },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const wData = await getWarehouses();
        const warehouses = Array.isArray(wData) ? wData : [];

        // Get counts from products and suppliers
        const [productsData, suppliersData] = await Promise.all([
          getProducts(),
          getSuppliers(),
        ]);

        setPCount(Array.isArray(productsData) ? productsData.length : 0);
        setSCount(Array.isArray(suppliersData) ? suppliersData.length : 0);
        setWarehouses(warehouses);

        if (warehouses.length === 1) {
          setSelectedWarehouse(warehouses[0]);
          fetchProducts(warehouses[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchProducts = async (locationID) => {
    try {
      const response = await getBatchesByWarehouse(locationID);
      const mappedProducts = response.map((item) => ({
        id: item.id,
        batchId: item.id,
        batchNumber: item.batchCode,
        invoiceNumber: "", // Not in response, perhaps add if available
        productName: item.product,
        quantity: item.quantity,
        remainingQuantity: item.remainingQuantity,
        subBatches: [], // Not in response, perhaps need to fetch separately
        batchPrice: item.unitCost * item.quantity, // Assuming
        entryDate: item.purchaseDate,
        qualityPass: "ok", // Default
        status: "active", // Assuming
        supplierName: item.supplier,
      }));
      const sortedProducts = mappedProducts.sort((a, b) => {
        const dateA = new Date(a.entryDate).getTime();
        const dateB = new Date(b.entryDate).getTime();
        return dateB - dateA;
      });
      setEntries(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setEntries([]);
    }
  };

  useEffect(() => {
    if (selectedWarehouse) {
      fetchProducts(selectedWarehouse.id);
    } else {
      setEntries([]);
    }
  }, [selectedWarehouse]);

  const proceed = !!(selectedWarehouse && pCount > 0 && sCount > 0);

  const filteredEntries = entries.filter((entry) => {
    const batchNumberMatch = entry.batchNumber
      .toLowerCase()
      .includes(batchNumberSearch.toLowerCase());
    const invoiceNumberMatch = entry.invoiceNumber
      .toLowerCase()
      .includes(invoiceNumberSearch.toLowerCase());
    return batchNumberMatch && invoiceNumberMatch;
  });

  if (loading) {
    return (
      <PageAnimate>
        <Container>
          <Grid
            container
            style={{ minHeight: "80vh" }}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Grid>
        </Container>
      </PageAnimate>
    );
  }

  const batchMenuOptions = [
    {
      label: "Inspect",
      action: (data) => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/operator/")) {
          navigate(`/operator/inventory/${data?.batchId}`);
        } else {
          navigate(`/inventory/${data?.batchId}`);
        }
      },
    },
    {
      label: "Delete",
      action: async (data) => {
        try {
          const response = await deleteBatch(data?.batchId);
          if (response === 200) {
            successPopup("Deleted successfully");
            setEntries((prev) =>
              prev.filter((row) => row.batchId !== data?.batchId)
            );
          } else {
            errorPopup("Failed to delete");
          }
        } catch (error) {
          console.error("Delete failed:", error);
          errorPopup("Failed to delete");
        }
      },
    },
  ];

  const warehouseMenuOptions = [
    {
      label: "Inspect",
      action: (data) => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/operator/")) {
          navigate(`/operator/inventory/warehouses/${data?.id}`);
        } else {
          navigate(`/inventory/warehouses/${data?.id}`);
        }
      },
    },
    {
      label: "Edit",
      action: (data) => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/operator/")) {
          navigate(`/operator/inventory/warehouses/${data?.id}/edit`);
        } else {
          navigate(`/inventory/warehouses/${data?.id}/edit`);
        }
      },
    },
    {
      label: "Delete",
      action: async (data) => {
        try {
          const response = await deleteWarehouse(data?.id);
          if (response === 200) {
            successPopup("Deleted successfully");
            // Refresh warehouses list, but since ViewData handles it, perhaps not needed
          } else {
            errorPopup("Failed to delete");
          }
        } catch (error) {
          console.error("Delete failed:", error);
          errorPopup("Failed to delete");
        }
      },
    },
  ];

  return (
    <PageAnimate>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
          marginY={1}
        >
          <Grid item xs={12}>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
            >
              <Tab label="Batches" />
              <Tab label="Warehouses" />
            </Tabs>
          </Grid>
        </Grid>

        {activeTab === 0 && (
          <>
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="space-between"
              marginY={2}
            >
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="warehouse"
                  options={warehouses}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={selectedWarehouse}
                  PopperComponent={CustomPopper}
                  PaperComponent={CustomPaper}
                  onChange={(event, newValue) => setSelectedWarehouse(newValue)}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Warehouse"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Grid item>
                    <MouseHoverPopover
                      triggerElement={
                        <button
                          onClick={() => transferBatch()}
                          className={`transition text-slate-300 ease-in-out p-2 w-fit bg-primary rounded-full`}
                        >
                          <ImportExportIcon />
                        </button>
                      }
                      popoverContent={
                        <span className="text-xs"> Transfer batch </span>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <MouseHoverPopover
                      triggerElement={
                        <button
                          onClick={() => manageWarehouse()}
                          className={`transition text-slate-300 ease-in-out p-2 w-fit bg-primary rounded-full`}
                        >
                          <LocationCityIcon />
                        </button>
                      }
                      popoverContent={
                        <span className="text-xs"> Manage Warehouse </span>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <MouseHoverPopover
                      triggerElement={
                        <button
                          onClick={() => add()}
                          className={`transition text-slate-300 ease-in-out p-2 w-fit bg-primary rounded-full`}
                        >
                          <AddIcon />
                        </button>
                      }
                      popoverContent={
                        <span className="text-xs"> Add a batch </span>
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginBottom={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Batch Number"
                  variant="outlined"
                  fullWidth
                  value={batchNumberSearch}
                  onChange={(e) => setBatchNumberSearch(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Invoice Number"
                  variant="outlined"
                  fullWidth
                  value={invoiceNumberSearch}
                  onChange={(e) => setInvoiceNumberSearch(e.target.value)}
                />
              </Grid>
            </Grid>

            {selectedWarehouse ? (
              entries.length > 0 ? (
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <div
                      className="ag-theme-quartz"
                      style={{ height: 400, overflowX: "auto", width: "100%" }}
                    >
                      {filteredEntries.length > 0 ? (
                        <DataGrid
                          menuOptions={batchMenuOptions}
                          rowData={filteredEntries}
                          colDefs={colDefs}
                        />
                      ) : (
                        <div className="h-full grid place-items-center">
                          <div className="flex gap-4 items-center">
                            <h1 className="text-2xl">
                              No data found{" "}
                              <span className="ml-4">ʕ•́ᴥ•̀ʔっ</span>
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: "60vh" }}
                >
                  {!proceed ? (
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item>
                          <PrecisionManufacturingIcon
                            sx={{ fontSize: 100, color: "error.main" }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">
                            Inventory is{" "}
                            <span style={{ color: "#f44336" }}>empty</span>.
                          </Typography>
                        </Grid>
                        {proceed && (
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<AddCircleRounded />}
                              component={NavLink}
                              to="/inventory/add"
                            >
                              Generate an Entry Bill
                            </Button>
                          </Grid>
                        )}
                        {!proceed && (
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="textSecondary"
                              align="center"
                            >
                              Add the following before proceeding:
                            </Typography>
                            <Checklist
                              list={[
                                { item: "Warehouse", done: true },
                                { item: "Item", done: pCount > 0 },
                                { item: "Supplier", done: sCount > 0 },
                              ]}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item>
                          <WarehouseIcon
                            sx={{ fontSize: 100, color: "primary.main" }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5" align="center">
                            Select a{" "}
                            <span style={{ color: "#f44336" }}>warehouse</span>{" "}
                            from above.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "60vh" }}
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <WarehouseIcon
                        sx={{ fontSize: 100, color: "primary.main" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" align="center">
                        Select a{" "}
                        <span style={{ color: "#f44336" }}>warehouse</span> from
                        above.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}

        {activeTab === 1 && (
          <ViewData
            title="Warehouses"
            url="/internal/warehouses"
            initialColDefs={warehouseColDefs}
            menuOptions={warehouseMenuOptions}
          />
        )}

        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sub-Batch Details</DialogTitle>
          <DialogContent>
            {selectedSubBatches && selectedSubBatches.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sub Batch ID</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Packing</TableCell>
                    <TableCell>Purchase Rate</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Manufacturing</TableCell>
                    <TableCell>Expiry</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedSubBatches.map((subBatch) => (
                    <TableRow key={subBatch.subBatchId}>
                      <TableCell>{subBatch.subBatchId}</TableCell>
                      <TableCell>{subBatch.itemName}</TableCell>
                      <TableCell>{subBatch.quantity}</TableCell>
                      <TableCell>1x{subBatch.packSize}</TableCell>
                      <TableCell>₹{subBatch.recordUnitPrice}</TableCell>
                      <TableCell>
                        {subBatch.discountType === "value"
                          ? `₹${subBatch.discount}`
                          : `${subBatch.discount}%`}
                      </TableCell>
                      <TableCell>₹{subBatch.subtotal}</TableCell>
                      <TableCell>
                        {subBatch.manufactureDate
                          ? new Date(
                              subBatch.manufactureDate
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {subBatch.expiryDate
                          ? new Date(subBatch.expiryDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>No sub-batch information available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageAnimate>
  );
};

export default ViewInventory;
