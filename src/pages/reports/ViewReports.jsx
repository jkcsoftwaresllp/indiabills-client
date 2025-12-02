import { FiBarChart2, FiBox, FiUser, FiTrendingUp, FiAlertCircle, FiList, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageAnimate from '../../components/Animate/PageAnimate';
import styles from './styles/ViewReports.module.css'; 

const reports = [
  {
    key: 'sales-summary',
    title: 'Sales Summary',
    description: 'View sales summary with trend analysis.',
    icon: <FiBarChart2 />,
    path: '/reports/sales-summary',
  },
  {
    key: 'sales-by-product',
    title: 'Sales by Product',
    description: 'Analyze sales performance by product.',
    icon: <FiBarChart2 />,
    path: '/reports/sales-by-product',
  },
  {
    key: 'customer-purchase',
    title: 'Customer Purchase Report',
    description: 'Review customer purchase reports.',
    icon: <FiUser />,
    path: '/reports/customer-purchase',
  },
  {
    key: 'profitability',
    title: 'Profitability Report',
    description: 'Monitor profitability across products.',
    icon: <FiTrendingUp />,
    path: '/reports/profitability',
  },
  {
    key: 'stock-valuation',
    title: 'Stock Valuation',
    description: 'Current stock valuation and analysis.',
    icon: <FiBox />,
    path: '/reports/stock-valuation',
  },
  {
    key: 'low-stock',
    title: 'Low Stock Report',
    description: 'Identify low stock items.',
    icon: <FiAlertCircle />,
    path: '/reports/low-stock',
  },
  {
    key: 'batch-expiry',
    title: 'Batch Expiry Report',
    description: 'Monitor batches nearing expiry.',
    icon: <FiAlertCircle />,
    path: '/reports/batch-expiry',
  },
  {
    key: 'stock-movement-audit',
    title: 'Stock Movement Audit',
    description: 'Detailed stock movement audit trail.',
    icon: <FiList />,
    path: '/reports/stock-movement-audit',
  },
  {
    key: 'supplier-cost',
    title: 'Supplier Purchase Cost',
    description: 'Analyze supplier purchase costs.',
    icon: <FiUser />,
    path: '/reports/supplier-cost',
  },
  {
    key: 'delivery-efficiency',
    title: 'Delivery Efficiency',
    description: 'Monitor delivery performance.',
    icon: <FiTrendingUp />,
    path: '/reports/delivery-efficiency',
  },
  {
    key: 'pms-sales',
    title: 'PMS Sales Report',
    description: 'View sales organized by tax slabs.',
    icon: <FiBarChart2 />,
    path: '/reports/pms-sales',
  },
  {
    key: 'revenue',
    title: 'Revenue Report',
    description: 'Track revenue over periods.',
    icon: <FiTrendingUp />,
    path: '/reports/revenue',
  },
  {
    key: 'gst-compliance',
    title: 'GST Compliance Report',
    description: 'GST compliance and tax analysis.',
    icon: <FiTag />,
    path: '/reports/gst-compliance',
  },
  {
    key: 'hsn-summary',
    title: 'HSN Summary Report',
    description: 'HSN classification and summary.',
    icon: <FiTag />,
    path: '/reports/hsn-summary',
  },
  {
    key: 'stock-sales-summary',
    title: 'Stock & Sales Summary',
    description: 'Combined stock and sales analysis.',
    icon: <FiBox />,
    path: '/reports/stock-sales-summary',
  },
  {
    key: 'invoice-financial',
    title: 'Invoice Financial Report',
    description: 'Invoice financial analysis and details.',
    icon: <FiBarChart2 />,
    path: '/reports/invoice-financial',
  },
];

const ViewReports = () => {
  const navigate = useNavigate();

  const handleReportClick = (path) => {
    navigate(path);
  };

  return (
    <PageAnimate nostyle>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* <div className={styles.header}>
            <h1 className={styles.title}>Reports Dashboard</h1>
            <p className={styles.subtitle}>
              Select a report from the navigation above or choose from the detailed view below
            </p>
          </div> */}

          <div className={styles.reportsGrid}>
            {reports.map((report) => (
              <div
                key={report.key}
                className={styles.reportCard}
                onClick={() => handleReportClick(report.path)}
              >
                <div className={styles.cardIcon}>
                  {report.icon}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{report.title}</h3>
                  <p className={styles.cardDescription}>{report.description}</p>
                </div>
                <div className={styles.cardArrow}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default ViewReports;