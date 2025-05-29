import ReportLayout from "./ReportLayout";
import { getData } from "../../network/api";

const PMSReport = () => {
  const url = '/reports/pms';

  const columnDefs = [
    { headerName: "Invoice Number", field: "invoiceNumber" },
    { 
      headerName: "Invoice Date", 
      field: "invoiceDate",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { headerName: "Party Name", field: "customerName" },
    { headerName: "GSTIN", field: "customerGstin" },
    {
      headerName: "12% Slab",
      children: [
        { headerName: "Sales", field: "slab12.sales" },
        { headerName: "CGST", field: "slab12.cgst" },
        { headerName: "SGST", field: "slab12.sgst" },
      ]
    },
    {
      headerName: "18% Slab",
      children: [
        { headerName: "Sales", field: "slab18.sales" },
        { headerName: "CGST", field: "slab18.cgst" },
        { headerName: "SGST", field: "slab18.sgst" },
      ]
    },
    {
      headerName: "28% Slab",
      children: [
        { headerName: "Sales", field: "slab28.sales" },
        { headerName: "CGST", field: "slab28.cgst" },
        { headerName: "SGST", field: "slab28.sgst" },
      ]
    },
    // {
    //   headerName: "32% Slab",
    //   children: [
    //     { headerName: "Sales", field: "slab32.sales" },
    //     { headerName: "CGST", field: "slab32.cgst" },
    //     { headerName: "SGST", field: "slab32.sgst" },
    //   ]
    // },
    { headerName: "Cess", field: "cess" },
    { headerName: "Gross", field: "gross" }
  ];

  const totalFields = [
    "slab12.sales",
    "slab12.cgst",
    "slab12.sgst",
    "slab18.sales",
    "slab18.cgst",
    "slab18.sgst",
    "slab28.sales",
    "slab28.cgst",
    "slab28.sgst",
    "slab32.sales",
    "slab32.cgst",
    "slab32.sgst",
    "cess",
    "gross"
  ];

	return (
		<ReportLayout
			title="Sales Report"
			url={url}
      customPDF={handleExportPDF}
      customCSV={handleExportCSV}
      totalFields={totalFields}
			columnDefs={columnDefs}
		/>
	);
};

export default PMSReport;

// TODO
// give headers border
// use initials before invoice numbers
// center the customer name (party name)
// give INR formatting to the amounts

// Update both handleExportPDF and handleExportCSV as follows:

// Updated handleExportPDF:
const handleExportPDF = (doc, columnDefs, data, title, ini) => {
  const flattenColumnDefs = (cols) => {
    return cols.reduce((acc, col) => {
      if (col.children) {
        return [...acc, ...flattenColumnDefs(col.children)];
      }
      return [...acc, col];
    }, []);
  };

  // Title
  doc.setFontSize(14);
  doc.text(`${title} Report`, 10, 18);

  // Helper: transform header text with customizations for specific headers
  const transformHeader = (header) => {
    if (header === "Invoice Number") return "Inv No";
    if (header === "Invoice Date") return "Inv Date";
    const match = header.match(/^(\d+)%\s+(.*)$/);
    if (match) {
      return `${match[2]}@${match[1]}%`;
    }
    return header;
  };

  // Helper: get nested field value and default empty slab values to 0.
  const getFieldValue = (row, field) => {
    let value;
    if (field.includes(".")) {
      value = field.split('.').reduce((acc, part) => acc ? acc[part] : "", row) || "";
    } else {
      value = row[field] || "";
    }
    if (field.toLowerCase().includes("slab") && (value === "" || value === null || value === undefined)) {
      return "0";
    }
    return value;
  };

  // Build header rows and export columns array
  const headerRows = [[], []];
  const exportColumns = [];

  columnDefs.forEach((col) => {
    if (col.children) {
      headerRows[0].push({
        content: transformHeader(col.headerName),
        colSpan: col.children.length,
        styles: { halign: "center", fontSize: 7 }
      });
      col.children.forEach((child) => {
        headerRows[1].push({
          content: transformHeader(child.headerName),
          styles: { halign: "center", fontSize: 4, fillColor: [218, 165, 32] }
        });
        exportColumns.push(child);
      });
    } else {
      headerRows[0].push({
        content: transformHeader(col.headerName),
        rowSpan: 2,
        styles: { halign: "center", fontSize: 5 }
      });
      exportColumns.push(col);
    }
  });

  // Prepare table data with custom formatting (prepend ini to invoice numbers)
  const rows = data.map((row) =>
    exportColumns.map((col) => {
      let cellValue = getFieldValue(row, col.field);
      if (col.field.toLowerCase().includes("date") && cellValue) {
        const d = new Date(cellValue);
        cellValue = d.toLocaleDateString();
      }
      if (col.field === "invoiceNumber") {
        cellValue = `${ini}-${cellValue}`;
      }
      if (col.field.toLowerCase().includes("slab") && (cellValue === "" || cellValue === null)) {
        cellValue = "0";
      }
      return cellValue.toString();
    })
  );

  const colStyles = exportColumns.reduce((acc, col, index) => {
    if (col.headerName === "Party Name") {
      acc[index] = { cellWidth: 40, overflow: 'ellipsize' };
    } else if (col.headerName === "GSTIN") {
      acc[index] = { cellWidth: 30, overflow: 'ellipsize' };
    } else if (col.headerName === "Inv No") {
      acc[index] = { cellWidth: 13, overflow: 'ellipsize' };
    } else if (col.headerName === "Inv Date") {
      acc[index] = { cellWidth: 13, overflow: 'ellipsize' };
    } else {
      acc[index] = { cellWidth: 'auto' };
    }
    return acc;
  }, {});

  doc.autoTable({
    startY: 30,
    head: headerRows,
    body: rows,
    styles: { fontSize: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [22, 160, 133] },
    theme: "striped",
    columnStyles: colStyles,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    pageBreak: "auto",
  });

  doc.save(`${title}_report.pdf`);
};

// Updated handleExportCSV:
const handleExportCSV = (columnDefs, data, title, Papa, ini) => {
  try {
    const flattenColumnDefs = (cols) => {
      return cols.reduce((acc, col) => {
        if (col.children) {
          return [...acc, ...flattenColumnDefs(col.children)];
        }
        return [...acc, col];
      }, []);
    };

    const transformHeader = (header) => {
      if (header === "Invoice Number") return "Inv No";
      if (header === "Invoice Date") return "Inv Date";
      const match = header.match(/^(\d+)%\s+(.*)$/);
      if (match) {
        return `${match[2]}@${match[1]}%`;
      }
      return header;
    };

    const getFieldValue = (row, field) => {
      let value = "";
      if (field.includes(".")) {
        value = field.split(".").reduce((acc, part) => (acc ? acc[part] : ""), row) || "";
      } else {
        value = row[field] || "";
      }
      if (field.toLowerCase().includes("slab") && (value === "" || value === null || value === undefined)) {
        return "0";
      }
      return value;
    };

    const exportColumns = flattenColumnDefs(columnDefs);

    const headers = exportColumns.map((col) => transformHeader(col.headerName));

    const csvData = data.map((row) =>
      exportColumns.map((col) => {
        let cellValue = getFieldValue(row, col.field);
        if (col.field.toLowerCase().includes("date") && cellValue) {
          const d = new Date(cellValue);
          cellValue = d.toLocaleDateString();
        }
        if (col.field === "invoiceNumber") {
          cellValue = `${ini}${cellValue}`;
        }
        return cellValue.toString();
      })
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
