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
import { getSalesSummaryReport } from '../../network/api';

const SalesSummaryReport = () => {
  const columnDefs = [
    { headerName: 'Total Orders', field: 'total_orders' },
    { headerName: 'Total Revenue', field: 'total_revenue' },
    { headerName: 'Total Paid', field: 'total_paid' },
    { headerName: 'Total Unpaid', field: 'total_unpaid' },
  ];

  const renderChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="total_orders" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_revenue" stroke="#8884d8" name="Revenue" />
        <Line type="monotone" dataKey="total_paid" stroke="#82ca9d" name="Paid" />
        <Line type="monotone" dataKey="total_unpaid" stroke="#ff7300" name="Unpaid" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <ReportLayout
      title="Sales Summary Report"
      url="/reports/sales-summary"
      columnDefs={columnDefs}
      renderChart={renderChart}
      fetchFunction={getSalesSummaryReport}
    />
  );
};

export default SalesSummaryReport;
