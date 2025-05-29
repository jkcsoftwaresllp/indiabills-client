import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import ReportLayout from "./ReportLayout";
import { formatToIndianCurrency } from "../../utils/FormHelper";

const StockIssuesReport = () => {
  const columnDefs = [
    {
      headerName: "Date",
      field: "dateAdded",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { headerName: "Item Name", field: "itemName" },
    { headerName: "Supplier", field: "supplierName" },
    {
      headerName: "Batch Details",
      field: "batchNumber",
      valueFormatter: (params) =>
        `${params.data.batchNumber} (Inv: ${params.data.invoiceNumber})`,
    },
    {
      headerName: "Faulty Quantity",
      field: "faultyQuantity",
      valueFormatter: (params) => params.value.toLocaleString(),
    },
    {
      headerName: "Unit Price",
      field: "recordUnitPrice",
      valueFormatter: (params) => formatToIndianCurrency(params.value),
    },
    {
      headerName: "Loss Amount",
      field: "lossAmount",
      valueFormatter: (params) => formatToIndianCurrency(params.value),
      cellStyle: { color: "red" },
    },
    {
      headerName: "Batch Value",
      field: "totalBatchValue",
      valueFormatter: (params) => formatToIndianCurrency(params.value),
    },
    {
      headerName: "Loss %",
      field: "lossPercentage",
      valueGetter: (params) => {
        const lossPercent =
          (params.data.lossAmount / params.data.totalBatchValue) * 100;
        return lossPercent.toFixed(2) + "%";
      },
      cellStyle: (params) => ({
        color:
          params.value > 10 ? "red" : params.value > 5 ? "orange" : "green",
      }),
    },
    { headerName: "Reason", field: "reason" },
    { headerName: "Remarks", field: "remarks" },
    { headerName: "Added By", field: "addedBy" },
  ];

  const renderStockIssuesChart = (data) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Loss Amount by Date */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateAdded"
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => formatToIndianCurrency(value)}
          />
          <Legend />
          <Bar dataKey="lossAmount" fill="#ff4d4d" name="Loss Amount" />
        </BarChart>
      </ResponsiveContainer>

      {/* Faulty Quantity by Item */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="itemName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="faultyQuantity" fill="#ffa500" name="Faulty Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const summaryCards = (data) => {
    const totalLoss = data.reduce((sum, item) => sum + item.lossAmount, 0);
    const totalFaultyItems = data.reduce(
      (sum, item) => sum + item.faultyQuantity,
      0,
    );
    const avgLossPercentage =
      data.reduce(
        (sum, item) => sum + (item.lossAmount / item.totalBatchValue) * 100,
        0,
      ) / data.length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Loss</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatToIndianCurrency(totalLoss)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Faulty Items
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {totalFaultyItems.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Average Loss %
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {avgLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <ReportLayout
      title="Stock Issues Report"
      url="/reports/stock/issues/"
      columnDefs={columnDefs}
      renderChart={renderStockIssuesChart}
      summaryComponent={summaryCards}
    />
  );
};

export default StockIssuesReport;
