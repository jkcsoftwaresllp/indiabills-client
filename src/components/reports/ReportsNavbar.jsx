import {
  FiBarChart2,
  FiBox,
  FiUser,
  FiTrendingUp,
  FiAlertCircle,
  FiList,
  FiTag,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReportsNavbar.module.css";

const reports = [
  {
    key: "stock-level",
    title: "Stock & Sales",
    icon: <FiBox />,
    path: "/reports/stocklevel",
  },
  {
    key: "supplier-performance",
    title: "Supplier Performance",
    icon: <FiUser />,
    path: "/reports/supplierperformance",
  },
  {
    key: "invoice",
    title: "Invoice",
    icon: <FiBarChart2 />,
    path: "/reports/invoice",
  },
  {
    key: "customer-purchase",
    title: "Customer Purchase",
    icon: <FiUser />,
    path: "/reports/customerpurchase",
  },
  {
    key: "expense",
    title: "Expenses",
    icon: <FiTrendingUp />,
    path: "/reports/expenses",
  },
  {
    key: "stock-issue",
    title: "Stock Issues",
    icon: <FiAlertCircle />,
    path: "/reports/stockissue",
  },
  {
    key: "credits",
    title: "Credits",
    icon: <FiList />,
    path: "/reports/credits",
  },
  {
    key: "revenue",
    title: "Revenue",
    icon: <FiTrendingUp />,
    path: "/reports/revenue",
  },
  {
    key: "hsn",
    title: "HSN Report",
    icon: <FiTag />,
    path: "/reports/hsn",
  },
  {
    key: "sales",
    title: "Sales Report",
    icon: <FiBarChart2 />,
    path: "/reports/pms",
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
                isActive(report.path) ? styles.active : ""
              }`}
              onClick={() => handleReportClick(report.path)}
              title={report.title}
            >
              <div className={styles.iconWrapper}>{report.icon}</div>
              <span className={styles.title}>{report.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsNavbar;
