import { FiCheckCircle, FiDollarSign, FiDownload, FiEdit, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { getReport } from "../../network/api";
import SettleCreditModal from "./SettleCreditModal";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import DebitModal from "./DebitModal";
import { useStore } from "../../store/store";
import { CustomerSelector } from "../../components/FormComponent/CustomerSelector";
import { formatDate } from "../../utils/FormHelper";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import EditCreditModal from "./EditCredit";
import MouseHoverPopover from "../../components/core/Explain";
import { Button } from "@mui/material";

const CreditReport = () => {
  const [creditData, setCreditData] = useState([]);
  const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState(null);
  const { successPopup, errorPopup, Organization } = useStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [totalsRow, setTotalsRow] = useState({});

  const [startDate, setStartDate] = useState(Organization.fiscalStart);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!Organization.fiscalStart) return;

    const date = new Date(Organization.fiscalStart);

    date.setFullYear(date.getFullYear() + 1);
    date.setDate(date.getDate() - 1);

    setEndDate(date.toISOString().split("T")[0]);
  }, [Organization.fiscalStart]);

  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const fetchCreditData = async (customerID, startDate, endDate) => {
    if (!customerID) return;
    try {
      const response = await getReport(`/reports/credits/${customerID}`, {
        startDate,
        endDate,
      });
      setCreditData(response.transactions);
      setOpeningBalance(response.openingBalance);
      setClosingBalance(response.closingBalance);

      computeTotals(response.transactions);
    } catch (error) {
      console.error("Error fetching credits api:", error);
    }
  };

  const handleDebitSuccess = () => {
    fetchCreditData(selectedCustomerId).then();
  };

  const handleOpenDebitModal = (creditId) => {
    setSelectedCreditId(creditId);
    setIsDebitModalOpen(true);
  };

  const handleCloseDebitModal = () => {
    setSelectedCreditId(null);
    setIsDebitModalOpen(false);
  };

  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  const formatNumbers = (numbers, prefix) => {
    if (!numbers) return "-";
    return `${prefix}-${numbers.split(",").join(`, ${prefix}-`)}`;
  };

  const formatReportRow = (row) => {
    return {
      date: formatDate(row.invoiceDate || row.amountDate) || "-",
      particulars: row.debitMethod ? "by cash in hand" : "to sales",
      reference: row.debitNumber
        ? formatNumbers(row.debitNumber, "DEB")
        : row.invoiceNumber
        ? formatNumbers(row.invoiceNumber, Organization.initials)
        : "-",
      credit: row.amountType === "credit" ? Number(row.amount)?.toFixed(2) : "",
      debit: row.amountType !== "credit" ? Number(row.amount)?.toFixed(2) : "",
      balance:
        Number(row.balance) < 0
          ? row.balance.toFixed(2)
          : "+" + row.balance.toFixed(2),
      remarks: row.remarks || "-",
    };
  };

  const computeTotals = (data) => {
    const totals = {
      amount: data.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
      balance: data[data.length - 1]?.balance || 0,
    };

    setTotalsRow(totals);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "landscape",
      compress: true,
    });

    doc.setFontSize(16);
    doc.text("Credit Report", 40, 40);

    const formatRow = (row) => {
      return [
        formatDate(row.invoiceDate || row.amountDate) || "-",
        row.debitMethod ? "BY CASH IN HAND" : "TO SALES",
        row.debitNumber
          ? formatNumbers(row.debitNumber, "DEB")
          : row.invoiceNumber
          ? formatNumbers(row.invoiceNumber, Organization.initials)
          : "-",
        row.amountType === "credit" ? Number(row.amount)?.toFixed(2) : "",
        row.amountType !== "credit" ? Number(row.amount)?.toFixed(2) : "",
        Number(row.balance) < 0
          ? row.balance.toFixed(2)
          : "+" + row.balance.toFixed(2),
        row.remarks || "-",
      ];
    };

    const headers = [
      "Date",
      "Particulars",
      "Reference",
      "Credit",
      "Debit",
      "Balance",
      "Remarks",
    ];

    const rows = creditData.map(formatRow);

    if (totalsRow) {
      rows.push([
        "Total",
        "",
        "",
        "",
        "",
        Number(totalsRow.balance).toFixed(2),
        "",
      ]);
    }

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 60,
      margin: { top: 40, right: 15, bottom: 15, left: 15 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        3: { halign: "left", textColor: [0, 128, 0] },
        4: { halign: "left", textColor: [255, 0, 0] },
        5: { halign: "left" },
      },
      didParseCell: function (data) {
        if (data.column.index === 5 && data.row.index > 0) {
          const value = parseFloat(data.cell.raw);
          data.cell.styles.textColor = value < 0 ? [255, 0, 0] : [0, 128, 0];
        }
      },
    });

    doc.save(`Credit_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "Date",
        "Particulars",
        "Reference",
        "Credit",
        "Debit",
        "Balance",
        "Remarks",
      ];

      const rows = creditData.map((row) => {
        const formatted = formatReportRow(row);
        return [
          formatted.date,
          formatted.particulars,
          formatted.reference,
          formatted.credit,
          formatted.debit,
          formatted.balance,
          formatted.remarks,
        ];
      });

      if (totalsRow) {
        rows.push([
          "Total",
          "",
          "",
          "",
          "",
          Number(totalsRow.balance).toFixed(2),
          "",
        ]);
      }

      const csv = Papa.unparse({
        fields: headers,
        data: rows,
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Credit_Report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      errorPopup("Failed to export CSV");
    }
  };

  const columnDefs = [
    {
      headerName: "Date",
      field: "invoiceDate",
      cellRenderer: (params) => {
        const value = params.value || params.data.amountDate;
        if (params.node?.rowPinned) return null;
        return <p>{formatDate(value) || "-"}</p>;
      },
    },
    {
      headerName: "Particulars",
      field: "debitMethod",
      cellRenderer: (params) => {
        const value = params.value;
        if (params.node?.rowPinned) return null;
        return (
          <p className="uppercase">{value ? `by cash in hand` : `to sales`}</p>
        );
      },
    },
    {
      headerName: "Reference Number",
      field: "invoiceNumber",
      cellRenderer: (params) => {
        if (params.node?.rowPinned) return "Total";

        if (params.data.amountType === "debit") {
          const numbers = params.data.debitNumber.split(",");
          return (
            <p className="capitalize">{`DEB-${numbers.join(", DEB-")}`}</p>
          );
        }

        if (params.data.invoiceNumber) {
          const numbers = params.data.invoiceNumber.split(",");
          return (
            <p className="capitalize">
              {`${Organization.initials}-${numbers.join(
                `, ${Organization.initials}-`
              )}`}
            </p>
          );
        }

        return <p className="capitalize">-</p>;
      },
    },
    {
      headerName: "Credit",
      field: "amount",
      valueFormatter: ({ value, data }) => {
        if (!data?.amountType || data.amountType !== "credit") return "";
        return Number(value)?.toFixed(2) || "N/A";
      },
      cellStyle: { fontWeight: "bold", color: "green" },
    },
    {
      headerName: "Debit",
      field: "amount",
      valueFormatter: ({ value, data }) => {
        if (!data?.amountType || data.amountType === "credit") return "";
        return Number(value)?.toFixed(2) || "N/A";
      },
      cellStyle: { fontWeight: "bold", color: "red" },
    },
    {
      headerName: "Balance",
      field: "balance",
      cellRenderer: (params) => {
        const balance = Number(params.value);
        const isNegative = balance < 0;
        const formattedBalance = isNegative
          ? balance.toFixed(2)
          : `+${balance.toFixed(2)}`;
        const colorStyle = { color: isNegative ? "red" : "green" };

        return <span style={colorStyle}>{formattedBalance}</span>;
      },
      cellStyle: { fontWeight: "semiBold" },
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: (params) => {
        const value = params.value;
        if (params.node?.rowPinned) return null;
        return <p className="capitalize">{value || "-"}</p>;
      },
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-4 bg-light h-full rounded-xl">
      <section className="control-bar">
        <CustomerSelector
          data={selectedCustomerId}
          setData={setSelectedCustomerId}
        />

        <div className="flex flex-col items-end">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 bg-light rounded-xl border text-sm"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-light rounded-xl border text-sm"
          />
        </div>
        <button
          className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl"
          onClick={() =>
            fetchCreditData(selectedCustomerId, startDate, endDate)
          }
        >
          <FiCheckCircle fontSize="small" />
        </button>
      </section>

      <section className="control-bar w-fit self-center">
        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Opening Balance
          </p>
          <p
            className={`text-lg font-semibold text-gray-700 dark:text-gray-300`}
          >
            {openingBalance.toLocaleString(undefined, {
              style: "currency",
              currency: "INR",
            })}
          </p>
        </div>

        <div className="flex items-center font-bold gap-4 border-x-4 px-4 py-2 transition cursor-pointer hover:bg-slate-100 rounded-xl">
          <label>Debit</label>
          <button
            className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl"
            onClick={() => setIsSettleModalOpen(true)}
          >
            <FiDollarSign />
          </button>
        </div>

        <div className="flex gap-4">
          <MouseHoverPopover
            triggerElement={
              <button
                className="p-2 min-w-12 text-slate-200 text-sm bg-primary rounded-xl hover:bg-accent transition"
                onClick={() => setIsEditModalOpen(!isEditModalOpen)}
              >
                <FiEdit />
              </button>
            }
            popoverContent={<span className="text-xs"> Edit </span>}
          />
          <MouseHoverPopover
            triggerElement={
              <button
                className="p-2 min-w-12 text-slate-200 text-sm bg-primary rounded-xl hover:bg-accent transition"
                onClick={handleExportPDF}
              >
                <FiDownload />
              </button>
            }
            popoverContent={<span className="text-xs"> Export as PDF </span>}
          />
          <MouseHoverPopover
            triggerElement={
              <button
                className="p-2 min-w-12 text-slate-200 text-sm bg-primary rounded-xl hover:bg-accent transition"
                onClick={handleExportCSV}
              >
                <FiFileText />
              </button>
            }
            popoverContent={<span className="text-xs"> Export as CSV </span>}
          />
        </div>
      </section>

      {creditData && (
        <main className="flex flex-col gap-4">
          <DebitModal
            isOpen={isDebitModalOpen}
            onClose={handleCloseDebitModal}
            onDebitSuccess={handleDebitSuccess}
            creditId={selectedCreditId}
          />
          <div
            className="ag-theme-quartz"
            style={{
              height: 400,
              width: "100%",
              boxShadow: "2px 10px 16px rgba(42, 42, 42, 0.19)",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            <AgGridReact
              rowData={creditData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={20}
              pinnedBottomRowData={creditData.length > 0 ? [totalsRow] : null}
            />
          </div>
        </main>
      )}
      {isSettleModalOpen && (
        <SettleCreditModal
          key={selectedCustomerId}
          onClose={() => setIsSettleModalOpen(false)}
          customerId={selectedCustomerId}
          creditData={creditData}
          onSettleSuccess={() => {
            fetchCreditData(selectedCustomerId, startDate, endDate);
            setIsSettleModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditCreditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          creditDataOld={creditData}
          onEditSuccess={() => {
            fetchCreditData(selectedCustomerId, startDate, endDate);
          }}
        />
      )}
    </div>
  );
};

export default CreditReport;
