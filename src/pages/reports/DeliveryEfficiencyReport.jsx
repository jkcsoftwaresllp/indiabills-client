import ReportLayout from './ReportLayout';
import { getDeliveryEfficiencyReportAPI } from '../../network/api';

const DeliveryEfficiencyReport = () => {
  const columnDefs = [
    { headerName: 'Delivery ID', field: 'delivery_id' },
    { headerName: 'Delivery Date', field: 'delivery_date', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Delivery Cost', field: 'delivery_cost' },
    { headerName: 'Reference No', field: 'reference_no' },
    { headerName: 'Order ID', field: 'order_id' },
    { headerName: 'Invoice Number', field: 'invoice_number' },
    { headerName: 'Sale Value', field: 'sale_value' },
    { headerName: 'Warehouse Name', field: 'warehouse_name', filter: true },
    { headerName: 'Courier Name', field: 'courier_name', filter: true },
    { headerName: 'Total Items', field: 'total_items' },
    { headerName: 'Delivery Cost %', field: 'delivery_cost_pct' },
    { headerName: 'Cost per Item', field: 'cost_per_item' },
  ];

  return (
    <ReportLayout
      title="Delivery Efficiency Report"
      url="/reports/delivery-efficiency"
      columnDefs={columnDefs}
      fetchFunction={getDeliveryEfficiencyReportAPI}
    />
  );
};

export default DeliveryEfficiencyReport;
