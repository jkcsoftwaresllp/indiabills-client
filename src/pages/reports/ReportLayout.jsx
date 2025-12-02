import {
  FiChevronDown,
  FiChevronUp,
  FiColumns,
  FiDownload,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Collapse,
  Breadcrumbs,
  Link,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { getReport } from "../../network/api";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import ColumnSelector from "../../components/FormComponent/ColumnSelector";
import Modal from "../../components/core/ModalMaker";
import { useStore } from "../../store/store";

const ReportLayout = ({
  title,
  url,
  customPDF,
  customCSV,
  columnDefs,
  renderChart = null,
  totalFields,
  fetchFunction,
}) => {
  const currentYear = new Date().getFullYear();
  const [totalsRow, setTotalsRow] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [chartOpen, setChartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(() => {
    if (title === "Sales Report") {
      return columnDefs.reduce((acc, col) => {
        if (col.children) {
          return [...acc, ...col.children.map((child) => child.field)];
        }
        return [...acc, col.field];
      }, []);
    }

    const saved = localStorage.getItem(`${title}_selectedColumns`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.warn(
          "Failed to parse selectedColumns from localStorage:",
          error
        );
      }
    }
    return columnDefs.slice(0, 6).map((col) => col.field);
  });

  const navigate = useNavigate();

  const { Organization } = useStore();

  const loadData = async () => {
    try {
      let response;
      if (fetchFunction) {
        // Use the provided fetch function
        response = await fetchFunction({ startDate, endDate });
      } else {
        // Fallback to generic getReport
        response = await getReport(url, { startDate, endDate });
      }
      setData(response);
      if (totalFields) computeTotals(response);
    } catch (error) {
      console.error(`Error fetching ${title} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [url]);

  const computeTotals = (data) => {
    const totals = {};

    totalFields.forEach((field) => {
      totals[field] = data.reduce((sum, row) => {
        const value = field
          .split(".")
          .reduce((obj, key) => (obj ? obj[key] : 0), row);
        return sum + (Number(value) || 0);
      }, 0);
    });

    totals["customerName"] = "Total";

    setTotalsRow(totals);
  };

  const handleFilter = () => {
    setLoading(true);
    setFilterApplied(true);
    loadData();
  };

  const toggleChart = () => {
    setChartOpen(!chartOpen);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    if (customPDF) {
      customPDF(doc, columnDefs, data, title, Organization.initials);
      return;
    }

    doc.setFontSize(18);
    doc.text(`${title} Report`, 14, 22);

    const headers = [
      columnDefs
        .filter((col) => selectedColumns.includes(col.field))
        .map((col) => col.headerName),
    ];

    const formatDate = (value) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (typeof value === "string" && dateRegex.test(value)) {
        const date = new Date(value);
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      }
      return value;
    };

    const rows = data.map((row) =>
      columnDefs
        .filter((col) => selectedColumns.includes(col.field))
        .map((col) => {
          const value = row[col.field];

          if (value === null || value === undefined) {
            return "";
          }

          const formattedValue = formatDate(value);
          return formattedValue !== value ? formattedValue : value.toString();
        })
    );

    doc.autoTable({
      startY: 30,
      head: headers,
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: "striped",
      columnStyles: columnDefs
        .filter((col) => selectedColumns.includes(col.field))
        .reduce((acc, col, index) => {
          acc[index] = { cellWidth: "wrap" };
          return acc;
        }, {}),
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      pageBreak: "auto",
    });

    doc.save(`${title}_report.pdf`);
  };

  const handleExportCSV = () => {
    if (customCSV) {
      customCSV(columnDefs, data, title, Papa, Organization.initials);
      return;
    }

    try {
      const headers = columnDefs
        .filter((col) => selectedColumns.includes(col.field))
        .map((col) => col.headerName);

      const csvData = data.map((row) =>
        columnDefs
          .filter((col) => selectedColumns.includes(col.field))
          .map((col) =>
            row[col.field] !== null && row[col.field] !== undefined
              ? row[col.field]
              : ""
          )
      );

      const combinedData = [headers, ...csvData];

      const csv = Papa.unparse(combinedData, {
        quotes: true,
        quoteChar: '"',
        delimiter: ",",
        header: false,
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  const handleColumnChange = (field) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(field)) {
        return prevSelected.filter((col) => col !== field);
      } else {
        return [...prevSelected, field];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem(
      `${title}_selectedColumns`,
      JSON.stringify(selectedColumns)
    );
  }, [selectedColumns, title]);

  const filteredColDefs = columnDefs
    .map((col) => {
      if (col.children) {
        const filteredChildren = col.children.filter((child) =>
          selectedColumns.includes(child.field)
        );
        return filteredChildren.length > 0
          ? { ...col, children: filteredChildren }
          : null;
      }
      return selectedColumns.includes(col.field) ? col : null;
    })
    .filter(Boolean);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        bgcolor: "#f8fafc",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            mb: 1.5,
            "& .MuiBreadcrumbs-separator": {
              mx: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <Link
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => navigate("/reports")}
            sx={{
              cursor: "pointer",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Reports
          </Link>
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: "#64748b",
              }}
            >
              {data.length > 0 && `Showing ${data.length} records`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters Section */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderBottom: "1px solid #e2e8f0",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            alignItems: "flex-end",
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{
              width: { xs: "calc(50% - 8px)", sm: "180px" },
              minWidth: "140px",
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            variant="outlined"
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{
              width: { xs: "calc(50% - 8px)", sm: "180px" },
              minWidth: "140px",
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleFilter}
            startIcon={<FiFilter size={16} />}
            sx={{
              height: "40px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            Apply Filter
          </Button>
          {filterApplied && (
            <Chip
              label="Filter Applied"
              size="small"
              variant="outlined"
              sx={{ height: "32px", fontSize: "0.65rem" }}
            />
          )}
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                Loading report...
              </Typography>
            </Box>
          </Box>
        ) : data.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: "center",
              bgcolor: "#f1f5f9",
              border: "none",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#64748b",
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              No data found
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: "#94a3b8",
              }}
            >
              Try adjusting your filters or selecting a different date range
            </Typography>
          </Paper>
        ) : (
          <Box>
            {/* Action Bar */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                mb: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Tooltip title="Refresh data">
                <IconButton
                  size="small"
                  onClick={handleFilter}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: { xs: "6px", sm: "8px" },
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <FiRefreshCw size={16} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Export as PDF">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExportPDF}
                  startIcon={<FiDownload size={14} />}
                  sx={{
                    textTransform: "none",
                    borderColor: "#e2e8f0",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    padding: { xs: "4px 8px", sm: "6px 12px" },
                    "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                  }}
                >
                  PDF
                </Button>
              </Tooltip>

              <Tooltip title="Export as CSV">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExportCSV}
                  startIcon={<FiDownload size={14} />}
                  sx={{
                    textTransform: "none",
                    borderColor: "#e2e8f0",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    padding: { xs: "4px 8px", sm: "6px 12px" },
                    "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                  }}
                >
                  CSV
                </Button>
              </Tooltip>

              <Tooltip title="Select columns">
                <IconButton
                  onClick={() => setIsModalOpen(true)}
                  size="small"
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: { xs: "6px", sm: "8px" },
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  <FiColumns size={16} />
                </IconButton>
              </Tooltip>

              <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />

              {renderChart && (
                <Button
                  size="small"
                  onClick={toggleChart}
                  startIcon={
                    chartOpen ? (
                      <FiChevronUp size={14} />
                    ) : (
                      <FiChevronDown size={14} />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    color: "#0f172a",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    padding: { xs: "4px 8px", sm: "6px 12px" },
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  {chartOpen ? "Hide" : "Show"} Chart
                </Button>
              )}
            </Box>

            {/* Chart Section */}
            {renderChart && (
              <Collapse in={chartOpen}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflowX: "auto",
                  }}
                >
                  {renderChart(data)}
                </Paper>
              </Collapse>
            )}

            {/* Data Table */}
            <Paper
              sx={{
                overflow: "hidden",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <Box
                className="ag-theme-quartz"
                sx={{
                  height: { xs: 300, sm: 400, md: 600 },
                  width: "100%",
                  "& .ag-header": {
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  },
                  "& .ag-header-cell": {
                    fontWeight: 600,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "#475569",
                  },
                  "& .ag-row": {
                    borderBottom: "1px solid #f1f5f9",
                  },
                  "& .ag-row:hover": {
                    bgcolor: "#f8fafc",
                  },
                  "& .ag-cell": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "#334155",
                  },
                }}
              >
                <AgGridReact
                  rowData={Array.isArray(data) ? data : []}
                  columnDefs={filteredColDefs}
                  pagination={true}
                  paginationPageSize={20}
                  pinnedBottomRowData={totalFields ? [totalsRow] : null}
                  domLayout="autoHeight"
                />
              </Box>
            </Paper>

            {/* Column Selector Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ColumnSelector
                columns={columnDefs.flatMap((col) => {
                  if (col.children) {
                    return [
                      ...col.children.map((child) => ({
                        field: child.field,
                        headerName: `${col.headerName} - ${child.headerName}`,
                        editable: child.editable || false,
                      })),
                    ];
                  }
                  return [
                    {
                      field: col.field,
                      headerName: col.headerName,
                      editable: col.editable || false,
                    },
                  ];
                })}
                selectedColumns={selectedColumns}
                onColumnChange={handleColumnChange}
              />
            </Modal>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportLayout;
