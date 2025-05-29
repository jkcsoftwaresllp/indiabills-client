// SalesSummary.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import ReportLayout from './ReportLayout';

const SalesSummary = () => {
  const url = '/reports/sales/summary';

  const columnDefs = [
    { headerName: 'Date', field: 'date' },
    { headerName: 'Item', field: 'itemName' },
    { headerName: 'Total Sales', field: 'totalSales' },
    { headerName: 'Total Orders', field: 'totalOrders' },
    { headerName: 'Average Order Value', field: 'averageOrderValue' },
    { headerName: 'Total Returns', field: 'totalReturns' },
  ];

  const renderSalesChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
        <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
        <Line type="monotone" dataKey="averageOrderValue" stroke="#ffc658" />
        <Line type="monotone" dataKey="totalReturns" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <ReportLayout
      title="Sales Summary Report"
      url={url}
      columnDefs={columnDefs}
      renderChart={renderSalesChart}
    />
  );
};

export default SalesSummary;