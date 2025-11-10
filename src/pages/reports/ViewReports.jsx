import { FiBarChart2, FiBox, FiUser, FiTrendingUp, FiAlertCircle, FiList, FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageAnimate from '../../components/Animate/PageAnimate';
import styles from './styles/ViewReports.module.css'; 

const reports = [
  {
    key: 'stock-level',
    title: 'Stock and Sales Summary',
    description: 'View current stock levels and sales summaries.',
    icon: <FiBox />,
    path: '/reports/stocklevel',
  },
  {
    key: 'supplier-performance',
    title: 'Supplier Performance',
    description: 'Analyze performance of your suppliers.',
    icon: <FiUser />,
    path: '/reports/supplierperformance',
  },
  {
    key: 'invoice',
    title: 'Invoice Reports',
    description: 'Check invoice details and summaries.',
    icon: <FiBarChart2 />,
    path: '/reports/invoice',
  },
  {
    key: 'customer-purchase',
    title: 'Customer Purchase',
    description: 'Review customer purchase reports.',
    icon: <FiUser />,
    path: '/reports/customerpurchase',
  },
  {
    key: 'expense',
    title: 'Expense Reports',
    description: 'Monitor your expenses over time.',
    icon: <FiTrendingUp />,
    path: '/reports/expenses',
  },
  {
    key: 'stock-issue',
    title: 'Stock Issues',
    description: 'Identify and resolve stock issues.',
    icon: <FiAlertCircle />,
    path: '/reports/stockissue',
  },
  {
    key: 'credits',
    title: 'Credit Management',
    description: 'Manage credit reports and analyses.',
    icon: <FiList />,
    path: '/reports/credits',
  },
  {
    key: 'revenue',
    title: 'Revenue Reports',
    description: 'Track revenue reports over periods.',
    icon: <FiTrendingUp />,
    path: '/reports/revenue',
  },
  {
    key: 'hsn',
    title: 'HSN Reports',
    description: 'HSN classification and tax reports.',
    icon: <FiTag />,
    path: '/reports/hsn',
  },
  {
    key: 'sales',
    title: 'Sales Reports',
    description: 'View invoices organized by tax slabs.',
    icon: <FiBarChart2 />,
    path: '/reports/pms',
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