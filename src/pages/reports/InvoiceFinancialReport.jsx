import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import ReportLayout from './ReportLayout';
import { getAllInvoiceFinancialReportAPI } from '../../network/api';

const InvoiceFinancialReport = () => {
  const columnDefs = [
    { headerName: 'Invoice Number', field: 'invoiceNumber' },
    { headerName: 'Invoice Date', field: 'invoiceDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Customer Name', field: 'customerName', filter: true },
    { headerName: 'Phone', field: 'phone' },
    { headerName: 'Total Sale Amount', field: 'totalSaleAmount' },
    { headerName: 'Tax Amount', field: 'taxAmount' },
    { headerName: 'Discount', field: 'discount' },
    { headerName: 'Shipping Cost', field: 'shippingCost' },
    { headerName: 'Total Paid', field: 'totalPaid' },
    { headerName: 'Total Due', field: 'dueAmount' },
    { headerName: 'Payment Status', field: 'paymentStatus' },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  const renderPaymentStatusChart = (data) => {
    if (!data || data.length === 0) return null;

    // Count payment statuses
    const statusCount = {
      paid: 0,
      pending: 0,
      overdue: 0,
    };

    data.forEach((item) => {
      if (item.paymentStatus === 'paid') statusCount.paid += 1;
      else if (item.paymentStatus === 'pending') statusCount.pending += 1;
      else statusCount.overdue += 1;
    });

    const chartData = [
      { name: 'Paid', value: statusCount.paid },
      { name: 'Pending', value: statusCount.pending },
      { name: 'Overdue', value: statusCount.overdue },
    ].filter((d) => d.value > 0);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} invoices`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRevenueChart = (data) => {
    if (!data || data.length === 0) return null;

    // Group by invoice date to show daily revenue
    const dailyData = {};
    data.forEach((item) => {
      const date = item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString('en-IN') : 'Unknown';
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          paid: 0,
          due: 0,
        };
      }
      dailyData[date].revenue += item.totalSaleAmount || 0;
      dailyData[date].paid += item.totalPaid || 0;
      dailyData[date].due += item.dueAmount || 0;
    });

    const chartData = Object.values(dailyData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" />
          <Bar dataKey="paid" fill="#10b981" name="Amount Paid" />
          <Bar dataKey="due" fill="#ef4444" name="Amount Due" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderCumulativeChart = (data) => {
    if (!data || data.length === 0) return null;

    // Sort by date and create cumulative revenue
    const sortedData = [...data].sort((a, b) => 
      new Date(a.invoiceDate) - new Date(b.invoiceDate)
    );

    let cumulativeRevenue = 0;
    let cumulativePaid = 0;
    let cumulativeDue = 0;

    const chartData = sortedData.map((item) => {
      cumulativeRevenue += item.totalSaleAmount || 0;
      cumulativePaid += item.totalPaid || 0;
      cumulativeDue += item.dueAmount || 0;

      return {
        date: item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString('en-IN') : 'Unknown',
        revenue: cumulativeRevenue,
        paid: cumulativePaid,
        due: cumulativeDue,
      };
    });

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Cumulative Revenue" />
          <Line type="monotone" dataKey="paid" stroke="#10b981" name="Cumulative Paid" />
          <Line type="monotone" dataKey="due" stroke="#ef4444" name="Cumulative Due" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ReportLayout
      title="Invoice Financial Report"
      url="/reports/invoices/financial"
      columnDefs={columnDefs}
      fetchFunction={getAllInvoiceFinancialReportAPI}
      renderChart={renderPaymentStatusChart}
      customChartRenderer={{
        paymentStatus: renderPaymentStatusChart,
        dailyRevenue: renderRevenueChart,
        cumulativeRevenue: renderCumulativeChart,
      }}
      totalFields={['totalSaleAmount', 'taxAmount', 'discount', 'shippingCost', 'totalPaid', 'dueAmount']}
    />
  );
};

export default InvoiceFinancialReport;
