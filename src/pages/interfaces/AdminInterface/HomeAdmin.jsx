import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getStuff } from "../../../network/api";
import styles from "./styles/HomeAdmin.module.css";

const HomeAdmin = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [fiscalData, setFiscalData] = useState(null);
  const [topProductSales, setTopProductSales] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getStuff("/dashboard");

        console.log(response);

        setDashboardData({
          totalSale: parseFloat(response.totalSale),
          totalProductsShipped: parseInt(response.totalProductsShipped),
          totalFulfilledShipped: response.totalFulfilledShipped,
          totalActiveCustomers: response.totalActiveCustomers,
          totalInvoiceGenerated: response.totalInvoiceGenerated,
          productsExpiringSoon: response.productsExpiringSoon,
          lowInventory: response.lowInventory,
          topCustomersByCredit: response.topCustomersByCredit,
        });

        setFiscalData({
          totalSaleFiscalYear: parseFloat(response.totalSaleFiscalYear),
          totalPurchaseFiscalYear: parseFloat(response.totalPurchaseFiscalYear),
          totalExpenseFiscalYear: response.totalExpenseFiscalYear,
        });

        setTopProductSales(
          response.topProductsBySale.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            salePrice: parseFloat(item.salePrice),
            totalSale: parseFloat(item.totalSale),
          }))
        );

        setTopCustomers(
          response.topCustomersBySale.map((customer) => ({
            customerId: customer.customerId,
            customerName: customer.customerName,
            totalSale: parseFloat(customer.totalSale),
          }))
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = fiscalData
    ? [
        { name: "Total Sales", value: fiscalData.totalSaleFiscalYear },
        { name: "Total Purchase", value: fiscalData.totalPurchaseFiscalYear },
        { name: "Total Expense", value: fiscalData.totalExpenseFiscalYear },
      ]
    : [];

  if (loading) {
  return (
    <div className={styles.centeredMargin}>
      <p>Loading dashboard data...</p>
    </div>
  );
}

if (error) {
  return (
    <div className={styles.centeredMargin}>
      <p className={styles.errorText}>{error}</p>
    </div>
  );
}

return (
  <div className={styles.container}>
    {/* Today's Metrics Section */}
    <section className={styles.section}>
      <h2 className={styles.header}>Today's Metrics</h2>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3 className={styles.metricTitle}>Total Cash In Today</h3>
          <p className={styles.metricValue}>₹{dashboardData?.totalSale.toLocaleString()}</p>
        </div>
        <div className={styles.metricCard}>
          <h3 className={styles.metricTitle}>Products Shipped Today</h3>
          <p className={styles.metricValue}>
            {dashboardData?.totalProductsShipped.toLocaleString()}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3 className={styles.metricTitle}>Products Fulfilled Today</h3>
          <p className={styles.metricValue}>
            {dashboardData?.totalFulfilledShipped.toLocaleString()}
          </p>
        </div>
        <div className={styles.metricCard}>
          <h3 className={styles.metricTitle}>Active Customers</h3>
          <p className={styles.metricValue}>
            {dashboardData?.totalActiveCustomers.toLocaleString()}
          </p>
        </div>
      </div>
    </section>

    {/* Fiscal Overview Section */}
    <section className={styles.section}>
      <h2 className={styles.header}>Fiscal Overview</h2>
      <div className={styles.tableWrapper}>
        {pieData.length > 0 && (
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
    </section>

    {/* Top Product Sales Section */}
    <section className={styles.section}>
      <h2 className={styles.header}>Top Product Sales</h2>
      <div className={styles.topProductContainer}>
        {topProductSales.length > 0 ? (
          topProductSales.map((item) => (
            <div key={item.itemId} className={styles.topProductCard}>
              <h3 className={styles.topProductTitle}>{item.itemName}</h3>
              <p className={styles.topProductText}>Sale Price: ₹{item.salePrice.toFixed(2)}</p>
              <p className={styles.topProductText}>Total Sales: {item.totalSale.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className={styles.noDataText}>No top product sales data available.</p>
        )}
      </div>
    </section>

    {/* Products Expiring Soon Section */}
    {dashboardData?.productsExpiringSoon && (
      <section className={styles.section}>
        <h2 className={styles.header}>Products Expiring Soon</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Batch Number</th>
                <th className={styles.th}>Item Name</th>
                <th className={styles.th}>Quantity</th>
                <th className={styles.th}>Expiry Date</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {dashboardData.productsExpiringSoon.map((product) => (
                <tr key={product.batchId} className={styles.tr}>
                  <td className={styles.td}>{product.batchNumber}</td>
                  <td className={styles.td}>{product.itemName}</td>
                  <td className={styles.td}>{product.quantity}</td>
                  <td className={styles.td}>
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )}

    {/* Low Inventory Stock Section */}
    <section className={styles.section}>
      <h2 className={styles.header}>Low Inventory Stock</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Item Name</th>
              <th className={styles.th}>Current Quantity</th>
              <th className={styles.th}>Reorder Level</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {dashboardData?.lowInventoryStock?.length > 0 ? (
              dashboardData.lowInventoryStock.map((item) => (
                <tr key={item.itemId} className={styles.tr}>
                  <td className={styles.td}>{item.itemName}</td>
                  <td className={styles.td}>{item.currentQuantity}</td>
                  <td className={styles.td}>{item.reorderLevel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={`${styles.td} ${styles.textGray500}`}>
                  No low inventory items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);
};

export default HomeAdmin;
