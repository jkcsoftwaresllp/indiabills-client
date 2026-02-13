import {
  FiCheckCircle,
  FiColumns,
  FiPlus,
  FiSearch,
  FiZap,
  FiAlertCircle,
  FiInbox,
  FiArrowRight,
} from "react-icons/fi";
import { useEffect, useState, useMemo } from "react";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../components/FormComponent/DataGrid";
import ColumnSelector from "../../components/FormComponent/ColumnSelector";
import NoDataFound from "../../components/FormComponent/NoDataFound";
import QuickEditModal from "../../components/core/QuickEditModal";
import DetailsModal from "../../components/core/DetailsModal";
import { IconButton, InputBase } from "@mui/material";
import "ag-grid-community/styles/ag-theme-material.css";
import Modal from "../../components/core/ModalMaker";
import {
  updateStuff,
  deleteStuff,
  getData,
  getReport,
} from "../../network/api";
import { cutShort } from "../../utils/FormHelper";
import { CircularProgress, Container, Grid } from "@mui/material";
import MouseHoverPopover from "../../components/core/Explain";
import { useStore } from "../../store/store";

const ViewData = ({
  title,
  url,
  idField,
  initialColDefs,
  disableControls,
  dateRange,
  customDataFetcher,
  mockData,
  menuOptions,
  transformPayload,
  deleteHandler,
  updateHandler,
}) => {
  const navigate = useNavigate();
  const { refreshTableId, Organization } = useStore();

  const id_field = idField || cutShort(title);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [colDefs, setColDefs] = useState(initialColDefs);
  const [startDate, setStartDate] = useState(Organization.fiscalStart);
  const [endDate, setEndDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [columnLimitWarning, setColumnLimitWarning] = useState(false);

  useEffect(() => {
    if (!Organization.fiscalStart) return;
    const date = new Date(Organization.fiscalStart);
    date.setFullYear(date.getFullYear() + 1);
    date.setDate(date.getDate() - 1);
    setEndDate(date.toISOString().split("T")[0]);
  }, [Organization.fiscalStart]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ✅ Updated data fetching logic to include mockData
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (mockData && Array.isArray(mockData)) {
          setRowData(mockData);
        } else {
          const data = customDataFetcher
            ? await customDataFetcher()
            : await getData(url);
          setRowData(data || []);
        }
      } catch (error) {
        console.error("Data fetch failed:", error);
        setRowData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, customDataFetcher, mockData]);

  const handleFilter = () => {
    setLoading(true);
    getReport(`${url}/range`, { startDate, endDate }).then((response) => {
      setRowData(response);
      setLoading(false);
    });
  };

  let initialSelectedColumns = JSON.parse(
    localStorage.getItem(`${title}_selectedColumns`) || "[]"
  );

  initialSelectedColumns = initialSelectedColumns.filter((col) =>
    initialColDefs.map((col) => col.field).includes(col)
  );

  const [selectedColumns, setSelectedColumns] = useState(
    initialSelectedColumns.length > 0
      ? initialSelectedColumns
      : colDefs.slice(0, 7).map((col) => col.field)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      `${title}_selectedColumns`,
      JSON.stringify(selectedColumns)
    );
  }, [selectedColumns, title]);

  useEffect(() => {
    setColDefs(
      initialColDefs.map((col) => ({
        ...col,
        editable: editable ? col.editable : false,
      }))
    );
  }, [editable, initialColDefs]);

  const handleColumnChange = (field) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(field)) {
        return prevSelected.filter((col) => col !== field);
      } else if (prevSelected.length < 7) {
        return [...prevSelected, field];
      } else {
        setColumnLimitWarning(true);
        setTimeout(() => setColumnLimitWarning(false), 4000);
        return prevSelected;
      }
    });
  };

  const filteredColDefs = useMemo(
    () => colDefs.filter((col) => selectedColumns.includes(col.field)),
    [colDefs, selectedColumns]
  );

  const filteredRowData = useMemo(
    () =>
      Array.isArray(rowData)
        ? rowData.filter((row) =>
            Object.values(row).some((value) => {
              // Skip null, undefined, and non-primitive values
              if (value === null || value === undefined) return false;

              // Handle objects and arrays
              if (typeof value === "object") return false;

              // Convert to string and search
              return String(value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
          )
        : [],
    [rowData, searchTerm]
  );

  const onCellValueChanged = (event) => {
    // Use updateHandler if provided, otherwise fall back to updateStuff
    if (updateHandler) {
      const payloadToSend = transformPayload
        ? transformPayload(event.data)
        : event.data;
      updateHandler(event.data[id_field], payloadToSend).then();
    } else {
      updateStuff(`${url}/update/${event.data[id_field]}`, {
        value: event.data,
      }).then();
    }
  };

  const handleQuickEdit = () => {
    if (selectedRows.length === 0) {
      alert("Please select a row to edit");
      return;
    }
    if (selectedRows.length > 1) {
      alert("Please select only one row to edit");
      return;
    }
    setQuickEditOpen(true);
  };

  const handleQuickEditSave = async (updatedData) => {
    try {
      const { successPopup, errorPopup } = useStore.getState();

      // Transform payload if transformer provided
      const payloadToSend = transformPayload
        ? transformPayload(updatedData)
        : updatedData;

      let response;
      // Use updateHandler if available, otherwise fall back to updateStuff
      if (updateHandler) {
        response = await updateHandler(updatedData[id_field], payloadToSend);
      } else {
        response = await updateStuff(`${url}/update/${updatedData[id_field]}`, {
          value: payloadToSend,
        });
      }

      if (response?.status === 200 || response === 200) {
        // Update table with original data format (not transformed)
        setRowData((prev) =>
          prev.map((row) =>
            row[id_field] === updatedData[id_field] ? updatedData : row
          )
        );
        setQuickEditOpen(false);
        setSelectedRows([]);
        const itemType = title.slice(0, -1); // Remove trailing 's' (Items -> Item, Suppliers -> Supplier)
        successPopup?.(`${itemType} updated successfully`);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      const { errorPopup } = useStore.getState();
      console.error("Update failed:", error);
      errorPopup?.(error.message || `Failed to update ${title.toLowerCase()}`);
    }
  };

  const handleQuickEditDelete = async (data) => {
    try {
      const { successPopup, errorPopup } = useStore.getState();

      let response;
      if (deleteHandler) {
        // Use deleteHandler if provided
        response = await deleteHandler(data[id_field]);
      } else {
        // Fallback to generic delete
        response = await deleteStuff(`${url}/delete/${data[id_field]}`);
      }

      if (response?.status === 200 || response === 200) {
        setRowData((prev) =>
          prev.filter((row) => row[id_field] !== data[id_field])
        );
        setQuickEditOpen(false);
        setSelectedRows([]);
        const itemType = title.slice(0, -1); // Remove trailing 's' (Items -> Item, Suppliers -> Supplier)
        successPopup?.(`${itemType} deleted successfully`);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      const { errorPopup } = useStore.getState();
      console.error("Delete failed:", error);
      errorPopup?.(error.message || `Failed to delete ${title.toLowerCase()}`);
    }
  };

  const onSelectionChanged = (event) => {
    const selected = event.api.getSelectedRows();
    setSelectedRows(selected);
  };

  const handleRowClicked = (rowData) => {
    setSelectedRowData(rowData);
    setDetailsOpen(true);
  };

  const add = () => {
    if (title === "Batches") {
      navigate("/inventory/add");
    } else {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/manager/")) {
        navigate(`${currentPath}/add`);
      } else if (currentPath.startsWith("/operator/")) {
        navigate(`${currentPath}/add`);
      } else if (title === "Category") {
        navigate(`/products/category/add`);
      } else if (currentPath.startsWith("/products")) {
        navigate(`${currentPath}/add`);
      } else if (currentPath.startsWith("/transport")) {
        navigate(`${currentPath}/add`);
      } else {
        navigate(`/${title.toLowerCase()}/add`);
      }
    }
  };

  useEffect(() => {
    if (!refreshTableId) return;
    setRowData((prev) =>
      prev.filter((row) => row[id_field] !== refreshTableId)
    );
  }, [refreshTableId, id_field]);

  if (loading) {
    return (
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
    );
  }

  return (
    <PageAnimate>
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-2 sm:px-4 py-4">
        <div className="w-full lg:w-auto">
          <h4 className="text-2xl sm:text-3xl transition font-bold hover:text-rose-500 truncate">
            {title}
          </h4>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center w-full sm:w-auto border rounded-lg px-2 py-1">
            <IconButton type="button" aria-label="search" size="small">
              <FiSearch />
            </IconButton>
            <InputBase
              placeholder={`Search ${title}`}
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 sm:flex-none ml-1"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          {dateRange && (
            <section className="flex flex-col sm:flex-row gap-2 w-full sm:w-fit justify-between items-center border-2 transition p-2 hover:shadow-lg rounded-xl">
              <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                <label className="text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 bg-light rounded-xl border text-xs sm:text-sm w-full"
                />
              </div>
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 bg-light rounded-xl border text-xs sm:text-sm w-full"
                />
              </div>
              <button
                className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl w-full sm:w-auto"
                onClick={handleFilter}
              >
                <FiCheckCircle fontSize="small" />
              </button>
            </section>
          )}

          <section className="flex items-center justify-center sm:justify-between gap-2 w-full sm:w-auto">
            {!disableControls && (
              <MouseHoverPopover 
                triggerElement={
                  <button
                    onClick={handleQuickEdit}
                    className={`transition ease-in-out p-2 w-fit bg-primary rounded-full ${
                      selectedRows.length === 0
                        ? "text-slate-200"
                        : "text-amber-500 -translate-y-1 shadow-lg"
                    }`}
                    disabled={selectedRows.length === 0}
                  >
                    <FiZap />
                  </button>
                }
                popoverContent={
                  <span className="text-xs">
                    {" "}
                    Quick Edit{" "}
                    {selectedRows.length > 0
                      ? `(${selectedRows.length})`
                      : ""}{" "}
                  </span>
                }
              />
            )}
            <MouseHoverPopover
              triggerElement={
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                >
                  <FiColumns />
                </button>
              }
              popoverContent={<span className="text-xs"> Columns </span>}
            />
            {!disableControls && (
              <MouseHoverPopover
                triggerElement={
                  <button
                    onClick={add}
                    className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200"
                  >
                    <FiPlus />
                  </button>
                }
                popoverContent={<span className="text-xs"> New </span>}
              />
            )}
          </section>
        </div>
      </header>

      {/* Column Limit Warning Toast */}
      {columnLimitWarning && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              background:
                "linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(220, 38, 38, 0.9) 100%)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "10px",
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
              boxShadow: "0 8px 24px rgba(220, 38, 38, 0.3)",
              backdropFilter: "blur(10px)",
              maxWidth: "350px",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <FiAlertCircle
              size={18}
              style={{
                flexShrink: 0,
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
            <span>You can select up to 7 columns only</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      <div
        className="ag-theme-quartz overflow-x-auto"
        style={{ height: "500px", width: "100%", marginBottom: "2rem" }}
      >
        {filteredRowData.length > 0 ? (
          <DataGrid
            rowData={filteredRowData}
            colDefs={filteredColDefs}
            menuOptions={menuOptions}
            onCellValueChanged={onCellValueChanged}
            onSelectionChanged={onSelectionChanged}
            onRowClicked={handleRowClicked}
          />
        ) : (
          <NoDataFound title={title} onAddNew={add} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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

      <QuickEditModal
        open={quickEditOpen}
        onClose={() => {
          setQuickEditOpen(false);
          setSelectedRows([]);
        }}
        data={selectedRows[0]}
        columns={initialColDefs}
        onSave={handleQuickEditSave}
        onDelete={handleQuickEditDelete}
        title={title}
      />

      <DetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedRowData(null);
        }}
        data={selectedRowData}
        columns={initialColDefs}
        title={title}
      />
    </PageAnimate>
  );
};

export default ViewData;
