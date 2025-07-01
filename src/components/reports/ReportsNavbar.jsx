import { useNavigate, useLocation } from 'react-router-dom';
import {
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugReportIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import styles from './ReportsNavbar.module.css';

const reports = [
  {
    key: 'stock-level',
    title: 'Stock & Sales',
    icon: <InventoryIcon />,
    path: '/reports/stocklevel',
  },
  {
    key: 'supplier-performance',
    title: 'Supplier Performance',
    icon: <PersonIcon />,
    path: '/reports/supplierperformance',
  },
  {
    key: 'invoice',
    title: 'Invoice',
    icon: <AssessmentIcon />,
    path: '/reports/invoice',
  },
  {
    key: 'customer-purchase',
    title: 'Customer Purchase',
    icon: <PersonIcon />,
    path: '/reports/customerpurchase',
  },
  {
    key: 'expense',
    title: 'Expenses',
    icon: <TrendingUpIcon />,
    path: '/reports/expenses',
  },
  {
    key: 'stock-issue',
    title: 'Stock Issues',
    icon: <BugReportIcon />,
    path: '/reports/stockissue',
  },
  {
    key: 'credits',
    title: 'Credits',
    icon: <CategoryIcon />,
    path: '/reports/credits',
  },
  {
    key: 'revenue',
    title: 'Revenue',
    icon: <TrendingUpIcon />,
    path: '/reports/revenue',
  },
  {
    key: 'hsn',
    title: 'HSN Report',
    icon: <LocalOfferIcon />,
    path: '/reports/hsn',
  },
  {
    key: 'sales',
    title: 'Sales Report',
    icon: <AssessmentIcon />,
    path: '/reports/pms',
  },
];

const ReportsNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReportClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.scrollContainer}>
          {reports.map((report) => (
            <div
              key={report.key}
              className={`${styles.reportItem} ${
                isActive(report.path) ? styles.active : ''
              }`}
              onClick={() => handleReportClick(report.path)}
              title={report.title}
            >
              <div className={styles.iconWrapper}>
                {report.icon}
              </div>
              <span className={styles.title}>{report.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsNavbar;