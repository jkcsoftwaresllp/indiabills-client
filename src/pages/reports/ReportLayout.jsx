import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  Button,
  Collapse,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { getReport } from "../../network/api";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MouseHoverPopover from "../../components/core/Explain";
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
}) => {
  const currentYear = new Date().getFullYear();
  const [totalsRow, setTotalsRow] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [chartOpen, setChartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const response = await getReport(url, { startDate, endDate });
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
        return `${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${(date.getMonth() + 1)
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
    <div style={{ padding: '0', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <Link
          color="inherit"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Home
        </Link>
        <Link
          color="inherit"
          onClick={() => navigate("/reports")}
          style={{ cursor: "pointer" }}
        >
          Reports
        </Link>
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={3} className="mb-4">
        <Grid item xs={12} sm={5} md={4}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={2}
          md={4}
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            fullWidth
          >
            Apply
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Typography variant="h6">No data found</Typography>
        </div>
      ) : (
        <>
          <Grid container spacing={2} className="mb-2">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExportPDF}
                aria-label="Export to PDF"
                startIcon={<PictureAsPdfIcon />}
              >
                Export to PDF
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExportCSV}
                aria-label="Export to CSV"
                startIcon={<FileDownloadIcon />}
              >
                Export to CSV
              </Button>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => setIsModalOpen(true)}
                aria-label="Select Columns"
              >
                <ViewColumnIcon />
              </IconButton>
            </Grid>
          </Grid>
          {renderChart && (
            <Button
              onClick={toggleChart}
              startIcon={chartOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              className="mb-2"
            >
              {chartOpen ? "Hide Chart" : "Show Chart"}
            </Button>
          )}
          <Collapse in={chartOpen}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} className="p-4">
                  {renderChart && renderChart(data)}
                </Paper>
              </Grid>
            </Grid>
          </Collapse>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div
                className="ag-theme-quartz"
                style={{ height: 600, width: "100%" }}
              >
                <AgGridReact
                  rowData={Array.isArray(data) ? data : []}
                  columnDefs={filteredColDefs}
                  pagination={true}
                  paginationPageSize={20}
                  pinnedBottomRowData={totalFields ? [totalsRow] : null}
                />
              </div>
            </Grid>
          </Grid>
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
        </>
      )}
      </div>
    </div>
  );
};

export default ReportLayout;
