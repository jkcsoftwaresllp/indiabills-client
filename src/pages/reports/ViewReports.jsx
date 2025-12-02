import { FiHome, FiBarChart2, FiPackage, FiDollarSign, FiFileText, FiBox, FiAlertTriangle, FiClock, FiArrowRight, FiShoppingCart, FiTruck, FiTrendingUp, FiZap, FiSliders, FiCheckCircle, FiTag, FiGrid } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageAnimate from '../../components/Animate/PageAnimate';
import styles from './styles/ViewReports.module.css';

const reportCategories = [
  {
    category: 'Sales & Revenue',
    categoryKey: 'sales',
    color: '#3b82f6',
    description: 'Analyze your sales performance and revenue trends',
    reports: [
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
        icon: <FiPackage />,
        path: '/reports/sales-by-product',
      },
      {
        key: 'revenue',
        title: 'Revenue Report',
        description: 'Track revenue over periods.',
        icon: <FiDollarSign />,
        path: '/reports/revenue',
      },
      {
        key: 'invoice-financial',
        title: 'Invoice Financial Report',
        description: 'Invoice financial analysis and details.',
        icon: <FiFileText />,
        path: '/reports/invoice-financial',
      },
    ],
  },
  {
    category: 'Inventory & Stock',
    categoryKey: 'inventory',
    color: '#10b981',
    description: 'Monitor stock levels, valuations, and movement',
    reports: [
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
        icon: <FiAlertTriangle />,
        path: '/reports/low-stock',
      },
      {
        key: 'batch-expiry',
        title: 'Batch Expiry Report',
        description: 'Monitor batches nearing expiry.',
        icon: <FiClock />,
        path: '/reports/batch-expiry',
      },
      {
        key: 'stock-movement-audit',
        title: 'Stock Movement Audit',
        description: 'Detailed stock movement audit trail.',
        icon: <FiArrowRight />,
        path: '/reports/stock-movement-audit',
      },
      {
        key: 'stock-sales-summary',
        title: 'Stock & Sales Summary',
        description: 'Combined stock and sales analysis.',
        icon: <FiGrid />,
        path: '/reports/stock-sales-summary',
      },
    ],
  },
  {
    category: 'Customers & Suppliers',
    categoryKey: 'partners',
    color: '#f59e0b',
    description: 'Track customer purchases and supplier costs',
    reports: [
      {
        key: 'customer-purchase',
        title: 'Customer Purchase Report',
        description: 'Review customer purchase reports.',
        icon: <FiShoppingCart />,
        path: '/reports/customer-purchase',
      },
      {
        key: 'supplier-cost',
        title: 'Supplier Purchase Cost',
        description: 'Analyze supplier purchase costs.',
        icon: <FiTruck />,
        path: '/reports/supplier-cost',
      },
    ],
  },
  {
    category: 'Profitability & Performance',
    categoryKey: 'profitability',
    color: '#8b5cf6',
    description: 'Assess profitability and operational efficiency',
    reports: [
      {
        key: 'profitability',
        title: 'Profitability Report',
        description: 'Monitor profitability across products.',
        icon: <FiTrendingUp />,
        path: '/reports/profitability',
      },
      {
        key: 'delivery-efficiency',
        title: 'Delivery Efficiency',
        description: 'Monitor delivery performance.',
        icon: <FiZap />,
        path: '/reports/delivery-efficiency',
      },
      {
        key: 'pms-sales',
        title: 'PMS Sales Report',
        description: 'View sales organized by tax slabs.',
        icon: <FiSliders />,
        path: '/reports/pms-sales',
      },
    ],
  },
  {
    category: 'Compliance & Tax',
    categoryKey: 'compliance',
    color: '#ef4444',
    description: 'Monitor tax compliance and regulatory requirements',
    reports: [
      {
        key: 'gst-compliance',
        title: 'GST Compliance Report',
        description: 'GST compliance and tax analysis.',
        icon: <FiCheckCircle />,
        path: '/reports/gst-compliance',
      },
      {
        key: 'hsn-summary',
        title: 'HSN Summary Report',
        description: 'HSN classification and summary.',
        icon: <FiTag />,
        path: '/reports/hsn-summary',
      },
    ],
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
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Reports & Analytics</h1>
              <p className={styles.subtitle}>
                Access comprehensive insights across your business operations
              </p>
            </div>
          </div>

          <div className={styles.categoriesContainer}>
            {reportCategories.map((category) => (
              <div key={category.categoryKey} className={styles.categorySection}>
                <div className={styles.categoryHeader} style={{ borderTopColor: category.color }}>
                  <div>
                    <h2 className={styles.categoryTitle}>{category.category}</h2>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                <div className={styles.reportsGrid}>
                  {category.reports.map((report) => (
                    <div
                      key={report.key}
                      className={styles.reportCard}
                      onClick={() => handleReportClick(report.path)}
                      style={{ '--accent-color': category.color }}
                    >
                      <div className={styles.cardHeader}>
                        <div
                          className={styles.cardIcon}
                          style={{ backgroundColor: category.color }}
                        >
                          {report.icon}
                        </div>
                        <FiArrowRight className={styles.cardArrowIcon} />
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{report.title}</h3>
                        <p className={styles.cardDescription}>{report.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default ViewReports;