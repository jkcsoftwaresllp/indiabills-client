import {
  FiHome,
  FiBarChart2,
  FiPackage,
  FiDollarSign,
  FiFileText,
  FiBox,
  FiAlertTriangle,
  FiClock,
  FiArrowRight,
  FiShoppingCart,
  FiTruck,
  FiTrendingUp,
  FiZap,
  FiSliders,
  FiCheckCircle,
  FiTag,
  FiGrid,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReportsNavbar.module.css";

const reports = [
  {
    key: "home",
    title: "All Reports",
    icon: <FiHome />,
    path: "/reports",
    category: "navigation",
  },
  // Sales & Revenue
  {
    key: "sales-summary",
    title: "Sales Summary",
    icon: <FiBarChart2 />,
    path: "/reports/sales-summary",
    category: "sales",
  },
  {
    key: "sales-by-product",
    title: "Sales by Product",
    icon: <FiPackage />,
    path: "/reports/sales-by-product",
    category: "sales",
  },
  {
    key: "revenue",
    title: "Revenue",
    icon: <FiDollarSign />,
    path: "/reports/revenue",
    category: "sales",
  },
  {
    key: "invoice-financial",
    title: "Invoice Financial",
    icon: <FiFileText />,
    path: "/reports/invoice-financial",
    category: "sales",
  },
  // Inventory & Stock
  {
    key: "stock-valuation",
    title: "Stock Valuation",
    icon: <FiBox />,
    path: "/reports/stock-valuation",
    category: "inventory",
  },
  {
    key: "low-stock",
    title: "Low Stock",
    icon: <FiAlertTriangle />,
    path: "/reports/low-stock",
    category: "inventory",
  },
  {
    key: "batch-expiry",
    title: "Batch Expiry",
    icon: <FiClock />,
    path: "/reports/batch-expiry",
    category: "inventory",
  },
  {
    key: "stock-movement-audit",
    title: "Stock Movement",
    icon: <FiArrowRight />,
    path: "/reports/stock-movement-audit",
    category: "inventory",
  },
  {
    key: "stock-sales-summary",
    title: "Stock & Sales",
    icon: <FiGrid />,
    path: "/reports/stock-sales-summary",
    category: "inventory",
  },
  // Customers & Suppliers
  {
    key: "customer-purchase",
    title: "Customer Purchase",
    icon: <FiShoppingCart />,
    path: "/reports/customer-purchase",
    category: "partners",
  },
  {
    key: "supplier-cost",
    title: "Supplier Cost",
    icon: <FiTruck />,
    path: "/reports/supplier-cost",
    category: "partners",
  },
  // Profitability & Performance
  {
    key: "profitability",
    title: "Profitability",
    icon: <FiTrendingUp />,
    path: "/reports/profitability",
    category: "profitability",
  },
  {
    key: "delivery-efficiency",
    title: "Delivery Efficiency",
    icon: <FiZap />,
    path: "/reports/delivery-efficiency",
    category: "profitability",
  },
  {
    key: "pms-sales",
    title: "PMS Sales",
    icon: <FiSliders />,
    path: "/reports/pms-sales",
    category: "profitability",
  },
  // Compliance & Tax
  {
    key: "gst-compliance",
    title: "GST Compliance",
    icon: <FiCheckCircle />,
    path: "/reports/gst-compliance",
    category: "compliance",
  },
  {
    key: "hsn-summary",
    title: "HSN Summary",
    icon: <FiTag />,
    path: "/reports/hsn-summary",
    category: "compliance",
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
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.scrollContainer}>
          {reports.map((report) => (
            <button
              key={report.key}
              className={`${styles.reportItem} ${
                isActive(report.path) ? styles.active : ""
              } ${report.category}`}
              onClick={() => handleReportClick(report.path)}
              title={report.title}
              type="button"
            >
              <div className={styles.iconWrapper}>{report.icon}</div>
              <span className={styles.title}>{report.title}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ReportsNavbar;
