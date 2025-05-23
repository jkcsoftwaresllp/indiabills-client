import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useEffect, useState } from "react";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DescriptionIcon from "@mui/icons-material/Description";
import { getReport } from "../../network/api";
import SettleCreditModal from "./SettleCreditModal"; // New modal
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import DebitModal from "./DebitModal";
import { useStore } from "../../store/store";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CustomerSelector } from "../../components/FormComponent/CustomerSelector";
import { formatDate } from "../../utils/FormHelper";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import as side-effect
import Papa from "papaparse";
import EditCreditModal from "./EditCredit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MouseHoverPopover from "../../components/core/Explain";
import { Button } from "@mui/material";

interface Credit {
  creditId: number;
  customerId: number;
  creditAmount: number;
  debitAmount: number;
  balance: number;
  adjustment: number;
  invoiceId: number;
  invoiceNumber: number;
  orderId: number;
  remarks: string;
  dateAdded: string;
  addedBy: string;
  lastEditedDate: string;
  lastEditedBy: string;
}

const CreditReport = () => {
  const [creditData, setCreditData] = useState<Credit[]>([]);
  const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
  const [selectedCreditId, setSelectedCreditId] = useState<number | null>(null);
  const { successPopup, errorPopup, Organization } = useStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [totalsRow, setTotalsRow] = useState<any>({});

  const [startDate, setStartDate] = useState<string>(Organization.fiscalStart);
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (!Organization.fiscalStart) return;

    const date = new Date(Organization.fiscalStart);

    date.setFullYear(date.getFullYear() + 1);
    date.setDate(date.getDate() - 1);

    setEndDate(date.toISOString().split("T")[0]);
  }, [Organization.fiscalStart]);

  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [closingBalance, setClosingBalance] = useState<number>(0);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");

  const fetchCreditData = async (
    customerID: string | number,
    startDate: string,
    endDate: string,
  ) => {
    if (!customerID) return;
    try {
      const response = await getReport(`/reports/credits/${customerID}`, {
        startDate,
        endDate,
      });
      // console.log(response);
      setCreditData(response.transactions as unknown as Credit[]);
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

  const handleOpenDebitModal = (creditId: number) => {
    setSelectedCreditId(creditId);
    setIsDebitModalOpen(true);
  };

  const handleCloseDebitModal = () => {
    setSelectedCreditId(null);
    setIsDebitModalOpen(false);
  };

  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  const formatNumbers = (numbers: string, prefix: string) => {
    if (!numbers) return "-";
    return `${prefix}-${numbers.split(",").join(`, ${prefix}-`)}`;
  };

  const formatReportRow = (row: any) => {
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

  const computeTotals = (data: any[]) => {
    const totals: any = {
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

    // Add header
    doc.setFontSize(16);
    doc.text("Credit Report", 40, 40);

    // Format data for PDF
    const formatRow = (row: any) => {
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

    // Add totals row
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
        3: { halign: "left", textColor: [0, 128, 0] }, // Credit column
        4: { halign: "left", textColor: [255, 0, 0] }, // Debit column
        5: { halign: "left" }, // Balance column
      },
      didParseCell: function (data) {
        // Style the balance column based on value
        if (data.column.index === 5 && data.row.index > 0) {
          const value = parseFloat(data.cell.raw as string);
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

      // Transform data using the shared formatter
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

      // Add totals row
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

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Credit_Report_${new Date().toISOString().split("T")[0]}.csv`,
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
    // {
    //   headerName: "ID",
    //   field: "creditId",
    //   width: 50,
    //   cellRenderer: (params: any) => {
    //     if (params.node?.rowPinned) return null; // Show 'Total' only in pinned row
    //     return (
    //       <p>
    //         <span className="text-blue-950">#</span>
    //         <span className="font-medium">{params.value}</span>
    //       </p>
    //     );
    //   },
    // },
    {
      headerName: "Date",
      field: "invoiceDate",
      cellRenderer: (params: any) => {
        const value = params.value || params.data.amountDate; // Fallback to amountDate
        if (params.node?.rowPinned) return null;
        return <p>{formatDate(value) || "-"}</p>;
      },
    },
    {
      headerName: "Particulars",
      field: "debitMethod",
      cellRenderer: (params: any) => {
        const value = params.value;
        if (params.node?.rowPinned) return null; // Show 'Total' only in pinned row
        return (
          <p className="uppercase">{value ? `by cash in hand` : `to sales`}</p>
        );
      },
    },
    {
      headerName: "Reference Number",
      field: "invoiceNumber",
      cellRenderer: (params: any) => {
        if (params.node?.rowPinned) return "Total";

        // Handle comma-separated debit numbers
        if (params.data.amountType === "debit") {
          const numbers = params.data.debitNumber.split(",");
          const newarr = numbers.map((num) => Number(num));
          console.log("numbers", typeof newarr, newarr); // fucking piece of shit js; todo: length()
          return (
            <p className="capitalize">{`DEB-${numbers.join(", DEB-")}`}</p>
          );
        }

        // Handle comma-separated invoice numbers
        if (params.data.invoiceNumber) {
          const numbers = params.data.invoiceNumber.split(",");
          return (
            <p className="capitalize">
              {`${Organization.initials}-${numbers.join(
                `, ${Organization.initials}-`,
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
      cellRenderer: (params: any) => {
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
      cellRenderer: (params: any) => {
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
          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label> */}
        </div>
        <div className="flex flex-col">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 bg-light rounded-xl border text-sm"
          />
          {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label> */}
        </div>
        <button
          className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl"
          onClick={() =>
            fetchCreditData(selectedCustomerId, startDate, endDate)
          }
        >
          <CheckCircleOutlineIcon fontSize="small" />
        </button>
      </section>

      <section className="control-bar w-fit self-center">
        {/* opening balance */}
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

        {/* debit button */}
        <div className="flex items-center font-bold gap-4 border-x-4 px-4 py-2 transition cursor-pointer hover:bg-slate-100 rounded-xl">
          <label>Debit</label>
          <button
            className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl"
            onClick={() => setIsSettleModalOpen(true)}
          >
            <PointOfSaleIcon />
          </button>
        </div>

        {/* print options */}
        <div className="flex gap-4">
          <MouseHoverPopover
            triggerElement={
              <button
                className="p-2 min-w-12 text-slate-200 text-sm bg-primary rounded-xl hover:bg-accent transition"
                onClick={() => setIsEditModalOpen(!isEditModalOpen)}
              >
                <BorderColorIcon />
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
                <PictureAsPdfIcon />
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
                <DescriptionIcon />
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
            creditId={selectedCreditId!} // Type assertion since it's checked before opening
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
              // defaultColDef={{
              //   sortable: true,
              //   resizable: true,
              //   suppressMovable: true,
              // }}
              // domLayout="autoHeight" // Important for printing all rows
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
            // Refresh data if needed
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
