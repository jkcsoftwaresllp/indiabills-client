// HomeAdmin.tsx

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getStuff } from "../../../network/api";
import {
  DashboardData,
  FiscalData,
  TopProductSale,
  TopCustomerSale,
  DashboardResponse,
} from "./DashboardData";

const HomeAdmin: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [fiscalData, setFiscalData] = useState<FiscalData | null>(null);
  const [topProductSales, setTopProductSales] = useState<TopProductSale[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomerSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: DashboardResponse = await getStuff("/dashboard");

        console.log(response);

        // Parse and set the data
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
            salePrice: parseFloat(item.salePrice), // Assuming salePrice is added
            totalSale: parseFloat(item.totalSale),
          })),
        );

        setTopCustomers(
          response.topCustomersBySale.map((customer) => ({
            customerId: customer.customerId,
            customerName: customer.customerName,
            totalSale: parseFloat(customer.totalSale),
          })),
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
      <div className="m-5 text-center">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col m-5 space-y-10">
      {/* Today's Metrics Section */}
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Today's Metrics</h2>
        <div className="flex flex-wrap gap-5">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5 flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold">Total Cash In Today</h3>
            <p className="mt-2 text-xl">
              ₹{dashboardData?.totalSale.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5 flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold">Products Shipped Today</h3>
            <p className="mt-2 text-xl">
              {dashboardData?.totalProductsShipped.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5 flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold">Products Fulfilled Today</h3>
            <p className="mt-2 text-xl">
              {dashboardData?.totalFulfilledShipped.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5 flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold">Active Customers</h3>
            <p className="mt-2 text-xl">
              {dashboardData?.totalActiveCustomers.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Fiscal Overview Section */}
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Fiscal Overview</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
          {pieData.length > 0 && (
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>
      </section>

      {/* Top Product Sales Section */}
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Top Product Sales</h2>
        <div className="flex space-x-5 overflow-x-auto">
          {topProductSales.length > 0 ? (
            topProductSales.map((item) => (
              <div
                key={item.itemId}
                className="bg-gray-200 border border-gray-300 rounded-lg p-5 min-w-[250px] flex-shrink-0"
              >
                <h3 className="text-lg font-semibold mb-2">{item.itemName}</h3>
                <p className="text-sm text-gray-700">
                  {" "}
                  Sale Price: ₹{item.salePrice.toFixed(2)}{" "}
                </p>
                <p className="text-sm text-gray-700">
                  {" "}
                  Total Sales: {item.totalSale.toLocaleString()}{" "}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              {" "}
              No top product sales data available.{" "}
            </p>
          )}
        </div>
      </section>

      {/* Products Expiring Soon Section */}
      {dashboardData?.productsExpiringSoon && (
        <section className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-2xl font-bold mb-5">Products Expiring Soon</h2>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {" "}
                    Batch Number{" "}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {" "}
                    Item Name{" "}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {" "}
                    Quantity{" "}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {" "}
                    Expiry Date{" "}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.productsExpiringSoon.map((product) => (
                  <tr key={product.batchId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.batchNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Low Inventory Stock</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Current Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reorder Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.lowInventory.map((item) => (
                <tr key={item.itemId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.itemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.reorderLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customers with Dues Section */}
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Customers with Dues</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.topCustomersByCredit.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{customer.totalCredit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Customers by Sales Section */}
      <section className="bg-gray-50 p-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Top Customers by Sales</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
          {topCustomers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCustomers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.customerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{customer.totalSale.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No top customers data available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeAdmin;
