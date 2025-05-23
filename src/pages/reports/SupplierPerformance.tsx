import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import ReportLayout from './ReportLayout';

interface SupplierData {
  supplierId: number;
  supplierName: string;
  averageDeliveryTime: number;
  orderFulfillmentRate: number;
  ratings: number;
}

const SupplierPerformanceReport = () => {
  const columnDefs = [
    { headerName: 'Supplier ID', field: 'supplierId' },
    { headerName: 'Supplier Name', field: 'supplierName', filter: true },
    { headerName: 'Product ID', field: 'productId' },
    { headerName: 'Product Name', field: 'productName', filter: true },
    { headerName: 'Quantity Delivered', field: 'quantityDelivered' },
    { headerName: 'Order Date', field: 'orderDate', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { headerName: 'Delivery Date', field: 'deliveryDate', valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { headerName: 'Order Fulfillment Rate (%)', field: 'orderFulfillmentRate' },
    { headerName: 'Defective/Return Rate (%)', field: 'defectiveReturnRate' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Total Purchase Amount', field: 'totalPurchaseAmount' },
    { headerName: 'Supplier Rating', field: 'supplierRating' },
  ];

  const renderSupplierChart = (data: SupplierData[]) => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="supplierName" />
        <PolarRadiusAxis />
        <Tooltip />
        <Radar
          name="Average Delivery Time"
          dataKey="averageDeliveryTime"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Order Fulfillment Rate"
          dataKey="orderFulfillmentRate"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Radar
          name="Quality Rating"
          dataKey="ratings"
          stroke="#ffc658"
          fill="#ffc658"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <ReportLayout
      title="Supplier Performance Report"
      url={"/reports/supplier/performance"}
      columnDefs={columnDefs}
      renderChart={renderSupplierChart}
    />
  );
};

export default SupplierPerformanceReport;
