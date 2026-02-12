import {
  FiPlus,
  FiRefreshCw,
  FiMapPin,
  FiCheck,
  FiThumbsDown,
  FiThumbsUp,
  FiTool,
  FiBox,
  FiZap,
  FiPackage,
  FiTrendingUp,
  FiColumns,
  FiSearch,
} from "react-icons/fi";
import DataGrid from "../../components/FormComponent/DataGrid";
import { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  InputBase,
} from "@mui/material";
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
  updateBatch,
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
import { AddCircleRounded } from "@mui/icons-material";
import DetailsModal from "../../components/core/DetailsModal";
import QuickEditModal from "../../components/core/QuickEditModal";
import TransferBatchModal from "./TransferBatchModal";
import ColumnSelector from "../../components/FormComponent/ColumnSelector";
import Modal from "../../components/core/ModalMaker";
import styles from "./ViewInventory.module.css";

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
    setActiveTab(1);
  };

  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const handleTransferBatch = () => {
    setTransferModalOpen(true);
  };

  const handleTransferSuccess = () => {
    if (selectedWarehouse) {
      fetchProducts(selectedWarehouse.id);
    }
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
  const [activeTab, setActiveTab] = useState(0);

  const [selectedBatchRows, setSelectedBatchRows] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState(null);
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Column selection state
  let initialSelectedColumns = JSON.parse(
    localStorage.getItem("Batches_selectedColumns") || "[]"
  );
  initialSelectedColumns = initialSelectedColumns.length > 0
    ? initialSelectedColumns
    : ["batchNumber", "productName", "quantity", "batchPrice", "status"];
  const [selectedColumns, setSelectedColumns] = useState(initialSelectedColumns);

  useEffect(() => {
    localStorage.setItem("Batches_selectedColumns", JSON.stringify(selectedColumns));
  }, [selectedColumns]);

  const handleOpenModal = (subBatches) => {
    setSelectedSubBatches(subBatches);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSubBatches(null);
    setIsModalOpen(false);
  };

  const handleBatchRowClicked = (rowData) => {
    setSelectedBatchData(rowData);
    setDetailsOpen(true);
  };

  const handleBatchSelectionChanged = (event) => {
    const selected = event.api.getSelectedRows();
    setSelectedBatchRows(selected);
  };

  const handleBatchQuickEdit = () => {
    if (selectedBatchRows.length === 0) {
      alert("Please select a batch to edit");
      return;
    }
    if (selectedBatchRows.length > 1) {
      alert("Please select only one batch to edit");
      return;
    }
    setQuickEditOpen(true);
  };

  const handleColumnChange = (field) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(field)) {
        return prevSelected.filter((col) => col !== field);
      } else if (prevSelected.length < 7) {
        return [...prevSelected, field];
      } else {
        alert("You can only select up to 7 columns.");
        return prevSelected;
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const warehouseColDefs = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
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
      field: "manager_name",
      headerName: "Manager",
      editable: true,
      cellStyle: { textTransform: "capitalize" },
    },
    { field: "manager_phone", headerName: "Manager Phone", editable: true },
    { field: "address_line", headerName: "Address", editable: true },
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
    { field: "pin_code", headerName: "Pin Code", editable: true },
    {
      field: "is_active",
      headerName: "Status",
      cellRenderer: (params) => (
        <span
          className={`py-1 px-3 rounded-full text-xs ${params.value
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      field: "updated_at",
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
    { headerName: "Batch Number", field: "batchNumber", width: 150, editable: true },
    { headerName: "Invoice Number", field: "invoiceNumber", width: 150, editable: true },
    { headerName: "Product Name", field: "productName", width: 200 },
    { headerName: "Quantity", field: "quantity", width: 100, editable: true },
    { headerName: "Remaining", field: "remainingQuantity", width: 100, editable: true },
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
      editable: true,
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
      editable: true,
      cellRenderer: (params) => {
        switch (params.value) {
          case "ok":
            return <FiCheck style={{ color: "#10b981" }} />;
          case "poor":
            return <FiThumbsDown style={{ color: "#ef4444" }} />;
          case "good":
            return <FiThumbsUp style={{ color: "#f59e0b" }} />;
          default:
            return params.value;
        }
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      editable: true,
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
        invoiceNumber: "",
        productName: item.product,
        quantity: item.quantity,
        remainingQuantity: item.remainingQuantity,
        subBatches: [],
        batchPrice: item.unitCost * item.quantity,
        entryDate: item.purchaseDate,
        qualityPass: "ok",
        status: "active",
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

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const batchNumberMatch = entry.batchNumber
          .toLowerCase()
          .includes(batchNumberSearch.toLowerCase());
        const invoiceNumberMatch = entry.invoiceNumber
          .toLowerCase()
          .includes(invoiceNumberSearch.toLowerCase());
        return batchNumberMatch && invoiceNumberMatch;
      }),
    [entries, batchNumberSearch, invoiceNumberSearch]
  );

  const filteredColDefs = useMemo(() =>
    colDefs.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns]
  );

  if (loading) {
    return (
      <PageAnimate>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
        </div>
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
          if (response?.status === 200 || response === 200) {
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
  ///
  return (
    <PageAnimate>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.headerSection}>
            <div>
              <h1 className={styles.pageTitle}>
                <FiPackage size={28} />
                Inventory Management
              </h1>
              <p className={styles.breadcrumbNav}>
                Dashboard / Inventory
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiBox />
              </div>
              <div className={styles.statLabel}>Products</div>
              <h3 className={styles.statValue}>{pCount}</h3>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiTrendingUp />
              </div>
              <div className={styles.statLabel}>Suppliers</div>
              <h3 className={styles.statValue}>{sCount}</h3>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiMapPin />
              </div>
              <div className={styles.statLabel}>Warehouses</div>
              <h3 className={styles.statValue}>{warehouses.length}</h3>
            </div>
            {selectedWarehouse && (
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FiPackage />
                </div>
                <div className={styles.statLabel}>Total Batches</div>
                <h3 className={styles.statValue}>{entries.length}</h3>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className={styles.tabsWrapper}>
            <div className={styles.customTabs}>
              <button
                className={`${styles.tabButton} ${activeTab === 0 ? styles.active : ""}`}
                onClick={() => setActiveTab(0)}
              >
                <FiPackage size={18} style={{ marginRight: "0.5rem" }} />
                Batches
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 1 ? styles.active : ""}`}
                onClick={() => setActiveTab(1)}
              >
                <FiMapPin size={18} style={{ marginRight: "0.5rem" }} />
                Warehouses
              </button>
            </div>
          </div>

          {/* Batches Tab */}
          {activeTab === 0 && (
            <>
              {/* Control Bar with Warehouse Selector */}
              <div className={styles.controlBar}>
                <div className={styles.warehouseSelector}>
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
                    slotProps={{
                      paper: {
                        style: {
                          borderRadius: "10px",
                          marginTop: "8px",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        },
                      },
                      listbox: {
                        style: {
                          padding: "8px 0",
                        },
                      },
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 8],
                            },
                          },
                        ],
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Warehouse"
                        variant="outlined"
                        size="small"
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            backgroundColor: "white",
                            transition: "all 0.3s ease",
                            "& fieldset": {
                              borderColor: "#e5e7eb",
                              borderWidth: "1.5px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#dc2032",
                              borderWidth: "1.5px",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#dc2032",
                              borderWidth: "2px",
                              boxShadow: "0 0 0 3px rgba(220, 32, 50, 0.1)",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            fontSize: "0.95rem",
                            fontWeight: "500",
                            color: "#1a202c",
                            padding: "10px 12px",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "#9ca3af",
                            opacity: 1,
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.9rem",
                            color: "#6b7280",
                            "&.Mui-focused": {
                              color: "#dc2032",
                            },
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          ...props.style,
                          padding: "10px 16px",
                          margin: "4px 8px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: "transparent",
                          color: "#1a202c",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(220, 32, 50, 0.08)";
                          e.currentTarget.style.color = "#dc2032";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#1a202c";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FiMapPin size={16} style={{ opacity: 0.6 }} />
                          <span>{option.name}</span>
                        </div>
                      </li>
                    )}
                  />
                </div>
                <div className={styles.actionButtons}>
                  <MouseHoverPopover
                    triggerElement={
                      <button
                        onClick={handleBatchQuickEdit}
                        className={`transition ease-in-out p-2 w-fit bg-primary rounded-full ${selectedBatchRows.length === 0
                          ? "text-slate-200"
                          : "text-amber-500 -translate-y-1 shadow-lg"
                          }`}
                        disabled={selectedBatchRows.length === 0}
                      >
                        <FiZap size={20} />
                      </button>
                    }
                    popoverContent={
                      <span className="text-xs">
                        Quick Edit{" "}
                        {selectedBatchRows.length > 0
                          ? `(${selectedBatchRows.length} selected)`
                          : ""}
                      </span>
                    }
                  />
                  <MouseHoverPopover
                    triggerElement={
                      <button
                        onClick={() => setIsColumnModalOpen(true)}
                        className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                      >
                        <FiColumns />
                      </button>
                    }
                    popoverContent={<span className="text-xs">Select Columns</span>}
                  />
                  <MouseHoverPopover
                    triggerElement={
                      <button
                        onClick={handleTransferBatch}
                        className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                      >
                        <FiRefreshCw size={20} />
                      </button>
                    }
                    popoverContent={<span className="text-xs">Transfer Batch</span>}
                  />
                  <MouseHoverPopover
                    triggerElement={
                      <button
                        onClick={manageWarehouse}
                        className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                      >
                        <FiMapPin size={20} />
                      </button>
                    }
                    popoverContent={<span className="text-xs">Manage Warehouse</span>}
                  />
                  <MouseHoverPopover
                    triggerElement={
                      <button
                        onClick={add}
                        className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                      >
                        <FiPlus />
                      </button>
                    }
                    popoverContent={<span className="text-xs">New Batch</span>}
                  />
                </div>
              </div>

              {/* Search Section */}
              <div className={styles.searchSection}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Batch Number..."
                    value={batchNumberSearch}
                    onChange={(e) => setBatchNumberSearch(e.target.value)}
                  />
                </div>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Invoice Number..."
                    value={invoiceNumberSearch}
                    onChange={(e) => setInvoiceNumberSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Data Table */}
              {selectedWarehouse ? (
                entries.length > 0 ? (
                  <div
                    className="ag-theme-quartz"
                    style={{ height: 500, width: "100%", marginBottom: "2rem" }}
                  >
                    {filteredEntries.length > 0 ? (
                      <DataGrid
                        rowData={filteredEntries}
                        colDefs={filteredColDefs}
                        menuOptions={batchMenuOptions}
                        onSelectionChanged={handleBatchSelectionChanged}
                        onRowClicked={handleBatchRowClicked}
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
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateContent}>
                      {!proceed ? (
                        <>
                          <FiTool className={styles.emptyIcon} />
                          <h3 className={styles.emptyTitle}>Setup Required</h3>
                          <p className={styles.emptyMessage}>
                            Before adding inventory, please set up the following:
                          </p>
                          <div className={styles.checklistContainer}>
                            <div className={styles.checklistTitle}>
                              Required Setup
                            </div>
                            {[
                              { item: "Warehouse", done: true },
                              { item: "Product", done: pCount > 0 },
                              { item: "Supplier", done: sCount > 0 },
                            ].map((check, idx) => (
                              <div
                                key={idx}
                                className={`${styles.checklistItem} ${check.done ? styles.completed : styles.pending
                                  }`}
                              >
                                <div className={styles.checklistCheckbox}>
                                  {check.done && "✓"}
                                </div>
                                <span className={styles.checklistText}>
                                  {check.item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <FiBox className={styles.emptyIcon} />
                          <h3 className={styles.emptyTitle}>No Batches Yet</h3>
                          <p className={styles.emptyMessage}>
                            Start by adding your first batch to this warehouse
                          </p>
                          <button
                            onClick={add}
                            className={styles.emptyActionButton}
                          >
                            <FiPlus size={18} />
                            Add First Batch
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateContent}>
                    <FiMapPin className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>Select a Warehouse</h3>
                    <p className={styles.emptyMessage}>
                      Choose a warehouse from the dropdown above to view its
                      inventory
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Warehouses Tab */}
          {activeTab === 1 && (
            <ViewData
              title="Warehouses"
              url="/internal/warehouses"
              initialColDefs={warehouseColDefs}
              idField="id"
              menuOptions={warehouseMenuOptions}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={styles.dialogTitle}>
          Sub-Batch Details
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
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
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <DetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedBatchData(null);
        }}
        data={selectedBatchData}
        columns={colDefs}
        title="Batch"
      />

      <QuickEditModal
        open={quickEditOpen}
        onClose={() => {
          setQuickEditOpen(false);
          setSelectedBatchRows([]);
        }}
        data={selectedBatchRows[0]}
        columns={colDefs}
        onSave={async (updatedData) => {
          try {
            const apiPayload = {
              batchCode: updatedData.batchNumber,
              quantity: updatedData.quantity,
              remainingQuantity: updatedData.remainingQuantity,
            };

            const response = await updateBatch(updatedData.batchId, apiPayload);

            if (response?.status === 200 || response?.status === 204 || response === 200) {
              successPopup("Batch updated successfully");
              setSelectedBatchRows([]);
              setQuickEditOpen(false);
              if (selectedWarehouse) {
                fetchProducts(selectedWarehouse.id);
              }
            } else {
              errorPopup("Failed to update batch");
            }
          } catch (error) {
            console.error("Update failed:", error);
            errorPopup("Failed to update batch");
          }
        }}
        onDelete={async (data) => {
          try {
            const response = await deleteBatch(data?.batchId);
            if (response?.status === 200 || response === 200) {
              successPopup("Deleted successfully");
              setSelectedBatchRows([]);
              setQuickEditOpen(false);
              if (selectedWarehouse) {
                fetchProducts(selectedWarehouse.id);
              }
            } else {
              errorPopup("Failed to delete");
            }
          } catch (error) {
            console.error("Delete failed:", error);
            errorPopup("Failed to delete");
          }
        }}
        title="Batch"
      />

      <TransferBatchModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        warehouses={warehouses}
        selectedWarehouse={selectedWarehouse}
        onSuccess={handleTransferSuccess}
        errorPopup={errorPopup}
        successPopup={successPopup}
      />

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
      >
        <ColumnSelector
          columns={colDefs.map((col) => ({
            field: col.field,
            headerName: col.headerName,
            editable: col.editable,
          }))}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      </Modal>
    </PageAnimate>
  );
};

export default ViewInventory;
