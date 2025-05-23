// ReportLayout.tsx

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
import "jspdf-autotable"; // Import as side-effect
import Papa from "papaparse";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MouseHoverPopover from "../../components/core/Explain";
import ColumnSelector from "../../components/FormComponent/ColumnSelector"; // Ensure this component exists
import Modal from "../../components/core/ModalMaker"; // Ensure this component exists
import { useStore } from "../../store/store";

interface ReportLayoutProps {
	title: string;
	url: string;
	columnDefs: any[];
	customPDF?: any;
	customCSV?: any;
	totalFields?: string[];
	renderChart?: (data: any[]) => JSX.Element;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
	title,
	url,
	customPDF,
	customCSV,
	columnDefs,
	renderChart = null,
	totalFields,
}) => {
	const currentYear = new Date().getFullYear();
	const [totalsRow, setTotalsRow] = useState<any>({});
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [startDate, setStartDate] = useState<string>(`${currentYear}-01-01`);
	const [endDate, setEndDate] = useState<string>(`${currentYear}-12-31`);
	const [chartOpen, setChartOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
		if (title === "Sales Report") {
			return columnDefs.reduce((acc: string[], col) => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url]);

	const computeTotals = (data: any[]) => {
		const totals: any = {};

		totalFields.forEach((field) => {
			// Fix nested field value extraction
			totals[field] = data.reduce((sum, row) => {
				const value = field.split('.').reduce((obj, key) =>
					obj ? obj[key] : 0, row); // Use proper object traversal
				return sum + (Number(value) || 0);
			}, 0);
		});

		// Set label for first column
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

		// Custom PDF function
		if (customPDF) {
			customPDF(doc, columnDefs, data, title, Organization.initials);
			return;
		}

		// Title
		doc.setFontSize(18);
		doc.text(`${title} Report`, 14, 22);

		// Prepare table headers using headerName
		const headers = [
			columnDefs
				.filter((col) => selectedColumns.includes(col.field))
				.map((col) => col.headerName),
		];

		// Function to format date strings
		const formatDate = (value: any) => {
			// Check if the value is a date string in ISO format
			const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
			if (typeof value === 'string' && dateRegex.test(value)) {
				const date = new Date(value);
				// Format: DD/MM/YYYY (time removed)
				return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
			}
			return value;
		};

		// Prepare table data with formatted dates
		const rows = data.map((row) =>
			columnDefs
				.filter((col) => selectedColumns.includes(col.field))
				.map((col) => {
					const value = row[col.field];

					if (value === null || value === undefined) {
						return "";
					}

					// Check if this column might contain dates
					// You can add specific column detection here if needed
					// Example: if (col.field === 'dateAdded' || col.field === 'entryDate') { ... }

					// Format if it's a date, otherwise convert to string
					const formattedValue = formatDate(value);
					return formattedValue !== value ? formattedValue : value.toString();
				})
		);

		// Add autoTable
		doc.autoTable({
			startY: 30,
			head: headers,
			body: rows,
			styles: { fontSize: 10 },
			headStyles: { fillColor: [22, 160, 133] },
			theme: "striped",
			columnStyles: columnDefs
				.filter((col) => selectedColumns.includes(col.field))
				.reduce((acc: { [key: number]: any }, col, index) => {
					acc[index] = { cellWidth: "wrap" };
					return acc;
				}, {}),
			margin: { top: 0, bottom: 0, left: 0, right: 0 },
			pageBreak: "auto",
		});

		// Save PDF
		doc.save(`${title}_report.pdf`);
	};

	const handleExportCSV = () => {
		if (customCSV) {
			customCSV(columnDefs, data, title, Papa, Organization.initials); // Ensure this function exists
			return;
		}

		console.log("using traditional approach...");

		try {
			// Extract headers using headerName
			const headers = columnDefs
				.filter((col) => selectedColumns.includes(col.field))
				.map((col) => col.headerName);

			// Map data to match headers
			const csvData = data.map((row) =>
				columnDefs
					.filter((col) => selectedColumns.includes(col.field))
					.map((col) =>
						row[col.field] !== null && row[col.field] !== undefined
							? row[col.field]
							: ""
					)
			);

			// Combine headers and data
			const combinedData = [headers, ...csvData];

			// Convert to CSV
			const csv = Papa.unparse(combinedData, {
				quotes: true,
				quoteChar: '"',
				delimiter: ",",
				header: false,
			});

			// Create blob and trigger download
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

	const handleColumnChange = (field: string) => {
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

	// const filteredColDefs = columnDefs.filter((col) =>
	//   selectedColumns.includes(col.field),
	// );

	const filteredColDefs = columnDefs
		.map((col) => {
			if (col.children) {
				// For grouped columns, keep the group if any child is selected
				const filteredChildren = col.children.filter((child) =>
					selectedColumns.includes(child.field)
				);
				return filteredChildren.length > 0
					? { ...col, children: filteredChildren }
					: null;
			}
			// For regular columns, keep if selected
			return selectedColumns.includes(col.field) ? col : null;
		})
		.filter(Boolean);

	return (
		<Container className="p-6">
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
			) : data.length === 0 ? (
				<Container>
					<Typography variant="h6">No data found</Typography>
				</Container>
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
					{renderChart && <Button
						onClick={toggleChart}
						startIcon={chartOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						className="mb-2"
					>
						{chartOpen ? "Hide Chart" : "Show Chart"}
					</Button>
					}
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
									rowData={data}
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
		</Container>
	);
};

export default ReportLayout;
