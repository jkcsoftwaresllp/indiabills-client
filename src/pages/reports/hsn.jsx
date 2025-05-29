import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { formatCurrency } from "../../utils/FormHelper";
import ReportLayout from "./ReportLayout";
import { useStore } from "../../store/store";

const HSNReport = () => {
  const { Organization } = useStore();

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) => {
        if (params.node.rowIndex === params.api.getDisplayedRowCount() - 1) {
          return "";
        }
        return params.node.rowIndex + 1;
      },
      width: 80,
      pinned: "left",
      sortable: false,
    },
    {
      headerName: "HSN",
      field: "hsn",
      filter: true,
      width: 120,
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
    },
    {
      headerName: "UQC",
      field: "uqc",
      width: 100,
    },
    {
      headerName: "Total Quantity",
      field: "totalQuantity",
      type: "numericColumn",
      valueFormatter: (params) => Number(params.value).toLocaleString(),
    },
    {
      headerName: "Total Value",
      field: "totalValue",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
    {
      headerName: "Rate",
      field: "rate",
      type: "numericColumn",
      valueFormatter: (params) => (params.value ? `${params.value}%` : ""),
      width: 100,
    },
    {
      headerName: "Taxable Value",
      field: "totalTaxableValue",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
    {
      headerName: "IGST",
      field: "totalIntegratedTax",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
    {
      headerName: "CGST",
      field: "totalCentralTax",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
    {
      headerName: "SGST",
      field: "totalStateUTTax",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
    {
      headerName: "Cess",
      field: "totalCess",
      type: "numericColumn",
      valueFormatter: (params) => formatCurrency(Number(params.value)),
    },
  ];

  const formatExportRow = (row, index) => [
    row.hsn,
    row.description,
    row.uqc,
    row.totalQuantity,
    row.totalValue,
    row.rate ? `${row.rate}%` : "",
    row.totalTaxableValue,
    row.totalIntegratedTax,
    row.totalCentralTax,
    row.totalStateUTTax,
    row.totalCess,
  ];

  return (
    <ReportLayout
      title="HSN Summary Report"
      url="/reports/hsn/summary"
      columnDefs={columnDefs}
      exportFilename={`HSN_Report_${Organization.initials}`}
      exportHeaders={[
        "S.No",
        "HSN",
        "Description",
        "UQC",
        "Total Quantity",
        "Total Value",
        "Rate",
        "Taxable Value",
        "IGST",
        "CGST",
        "SGST",
        "Cess",
      ]}
      formatExportRow={formatExportRow}
    />
  );
};

export default HSNReport;
