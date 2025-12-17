import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ReportLayout from './ReportLayout';
import { getSalesByProductReport } from '../../network/api';

const SalesByProductReport = () => {
  const columnDefs = [
    { headerName: 'Product Name', field: 'product_name', filter: true },
    { headerName: 'Total Quantity', field: 'total_quantity' },
    { headerName: 'Total Sales', field: 'total_sales' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

  const renderBarChart = (data) => {
    if (!data || data.length === 0) return null;
    
    const chartData = data.map((item) => ({
      ...item,
      name: item.product_name.length > 15 ? item.product_name.substring(0, 15) + '...' : item.product_name,
      fullName: item.product_name,
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => value.toLocaleString('en-IN')}
            labelFormatter={(label) => {
              const fullItem = data.find(d => d.product_name.substring(0, 15) === label || d.product_name === label);
              return fullItem ? fullItem.product_name : label;
            }}
          />
          <Legend />
          <Bar dataKey="total_quantity" fill="#3b82f6" name="Quantity Sold" />
          <Bar dataKey="total_sales" fill="#10b981" name="Total Sales (₹)" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = (data) => {
    if (!data || data.length === 0) return null;
    
    const pieData = data.slice(0, 8).map((item) => ({
      name: item.product_name.length > 20 ? item.product_name.substring(0, 20) + '...' : item.product_name,
      value: item.total_sales,
      fullName: item.product_name,
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            labelFormatter={(label) => label}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ReportLayout
      title="Sales by Product Report"
      url="/reports/sales-by-product"
      columnDefs={columnDefs}
      fetchFunction={getSalesByProductReport}
      renderChart={renderBarChart}
      customChartRenderer={{
        barChart: renderBarChart,
        pieChart: renderPieChart,
      }}
      totalFields={['total_quantity', 'total_sales']}
    />
  );
};

export default SalesByProductReport;
