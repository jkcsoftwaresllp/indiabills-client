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

const CustomerPurchaseReport = () => {
  const url = "/reports/customerpurchase";

  const columnDefs = [
    { headerName: "Customer ID", field: "customerId" },
    { headerName: "Customer Name", field: "customerName" },
    { headerName: "Total Orders", field: "totalOrders" },
    { headerName: "Total Purchases", field: "totalPurchases" },
    { headerName: "Total Amount", field: "totalAmount" },
    { headerName: "Average Order Value", field: "averageOrderValue" },
  ];

  const renderCustomerChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="customerName" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
        <Bar dataKey="totalPurchases" fill="#8884d8" name="Total Purchases" />
        <Bar
          dataKey="averageOrderValue"
          fill="#82ca9d"
          name="Average Order Value"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ReportLayout
      title="Customer Purchase Report"
      url={url}
      columnDefs={columnDefs}
      renderChart={renderCustomerChart}
    />
  );
};

export default CustomerPurchaseReport;