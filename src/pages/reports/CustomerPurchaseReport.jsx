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
import { getCustomerPurchaseReportAPI } from "../../network/api";

const CustomerPurchaseReport = () => {
  const url = "/reports/customer-purchase";

  const columnDefs = [
    { headerName: "Customer ID", field: "customer_id" },
    { headerName: "Customer Name", field: "customer_name" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Total Orders", field: "total_orders" },
    { headerName: "Total Spent", field: "total_spent" },
    { headerName: "Total Points Earned", field: "total_points" },
    { headerName: "Current Loyalty Points", field: "current_points" },
  ];

  const renderCustomerChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="customer_name" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
        <Bar dataKey="total_spent" fill="#8884d8" name="Total Spent" />
        <Bar
          dataKey="total_orders"
          fill="#82ca9d"
          name="Total Orders"
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
      fetchFunction={getCustomerPurchaseReportAPI}
    />
  );
};

export default CustomerPurchaseReport;