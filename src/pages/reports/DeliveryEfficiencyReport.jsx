import ReportLayout from './ReportLayout';
import { getDeliveryEfficiencyReportAPI } from '../../network/api';

const DeliveryEfficiencyReport = () => {
  const columnDefs = [
    { headerName: 'Order ID', field: 'orderId' },
    { headerName: 'Customer Name', field: 'customerName', filter: true },
    { headerName: 'Scheduled Date', field: 'scheduledDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Actual Date', field: 'actualDate', valueFormatter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { headerName: 'Days Variance', field: 'daysVariance' },
    { headerName: 'Status', field: 'status' },
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
