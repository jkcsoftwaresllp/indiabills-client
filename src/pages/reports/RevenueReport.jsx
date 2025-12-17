import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';
import ReportLayout from './ReportLayout';
import { getRevenueReportAPI } from '../../network/api';

const RevenueReport = () => {
  const columnDefs = [
    { headerName: 'Date of Sale', field: 'dateOfSale', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Quantity Sold', field: 'quantitySold' },
    { headerName: 'Unit Price', field: 'salePrice' },
    { headerName: 'Total Sale Amount', field: 'totalSaleAmount' },
    { headerName: 'Discounts Applied', field: 'discountsApplied' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Shipping Charges', field: 'shippingCharges' },
    { headerName: 'Net Revenue', field: 'netRevenue' },
  ];

  const renderRevenueChart = (data) => {
    if (!data || data.length === 0) return null;

    // Group data by date to show daily revenue trend
    const dailyData = {};
    data.forEach((item) => {
      const date = item.dateOfSale ? new Date(item.dateOfSale).toLocaleDateString('en-IN') : 'Unknown';
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          totalRevenue: 0,
          totalTax: 0,
          totalDiscount: 0,
          count: 0,
        };
      }
      dailyData[date].totalRevenue += item.netRevenue || 0;
      dailyData[date].totalTax += item.taxAmount || 0;
      dailyData[date].totalDiscount += item.discountsApplied || 0;
      dailyData[date].count += 1;
    });

    const chartData = Object.values(dailyData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Net Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderRevenueBreakdown = (data) => {
    if (!data || data.length === 0) return null;

    // Group data by date to show breakdown
    const dailyData = {};
    data.forEach((item) => {
      const date = item.dateOfSale ? new Date(item.dateOfSale).toLocaleDateString('en-IN') : 'Unknown';
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          sales: 0,
          tax: 0,
          discount: 0,
          shipping: 0,
        };
      }
      dailyData[date].sales += item.totalSaleAmount || 0;
      dailyData[date].tax += item.taxAmount || 0;
      dailyData[date].discount += item.discountsApplied || 0;
      dailyData[date].shipping += item.shippingCharges || 0;
    });

    const chartData = Object.values(dailyData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Bar dataKey="sales" fill="#3b82f6" name="Sale Amount" />
          <Bar dataKey="tax" fill="#10b981" name="Tax" />
          <Bar dataKey="discount" fill="#ef4444" name="Discount" />
          <Bar dataKey="shipping" fill="#f59e0b" name="Shipping" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ReportLayout
      title="Revenue Report"
      url={"/reports/revenue"}
      columnDefs={columnDefs}
      fetchFunction={getRevenueReportAPI}
      renderChart={renderRevenueChart}
      customChartRenderer={{
        revenueChart: renderRevenueChart,
        breakdownChart: renderRevenueBreakdown,
      }}
      totalFields={['quantitySold', 'totalSaleAmount', 'discountsApplied', 'taxAmount', 'shippingCharges', 'netRevenue']}
    />
  );
};

export default RevenueReport;
