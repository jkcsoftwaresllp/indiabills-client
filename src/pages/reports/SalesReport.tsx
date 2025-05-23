// SalesReport.tsx

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import ReportLayout from "./ReportLayout";
import { getData } from "../../network/api";

interface SalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
}

const SalesReport = () => {
  const fetchSalesData = () => getData<SalesData[]>("/shop/sales-report");

  const columnDefs = [
    { headerName: "Date", field: "date" },
    { headerName: "Total Sales", field: "totalSales" },
    { headerName: "Total Orders", field: "totalOrders" },
  ];

  const renderSalesChart = (data: SalesData[]) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
        <Bar dataKey="totalOrders" fill="#82ca9d" name="Total Orders" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ReportLayout
      title="Sales Report"
      fetchData={fetchSalesData}
      columnDefs={columnDefs}
      renderChart={renderSalesChart}
    />
  );
};

export default SalesReport;