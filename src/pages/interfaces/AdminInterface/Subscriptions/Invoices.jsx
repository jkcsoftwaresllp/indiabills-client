import { useMemo, useState, useEffect } from "react";
import InvoiceOrderCard from "../../../../components/EcommerceInvoice/InvoiceOrderCard";
import styles from "../../../../components/EcommerceInvoice/styles/InvoiceListPage.module.css";
import {
  getSubscriptionHistory,
  getSubscriptionPayments,
} from "../../../../network/api/subscriptionApi";

const Invoices = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch subscription history and payments to build invoice list
      const historyResponse = await getSubscriptionHistory();
      const paymentsResponse = await getSubscriptionPayments();

      const invoiceList = [];

      // Add subscription invoices
      if (
        historyResponse.status === 200 &&
        historyResponse.data.success &&
        historyResponse.data.data
      ) {
        historyResponse.data.data.forEach((subscription) => {
          invoiceList.push({
            id: subscription.subscription_id,
            invoiceId: `SUB-${subscription.subscription_id}`,
            paymentId: null,
            date: subscription.start_date
              ? new Date(subscription.start_date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A",
            itemsCount: 1,
            total: subscription.total_amount || 0,
            status:
              subscription.subscription_status?.toLowerCase() === "active"
                ? "PAID"
                : "PENDING",
            paymentMethod: subscription.plan_name || "Subscription",
            orderStatus: subscription.subscription_status,
          });
        });
      }

      // Add payment invoices
      if (
        paymentsResponse.status === 200 &&
        paymentsResponse.data.success &&
        paymentsResponse.data.data
      ) {
        paymentsResponse.data.data.forEach((payment) => {
          invoiceList.push({
            id: payment.id,
            invoiceId: null,
            paymentId: `PAY-${payment.id}`,
            date: payment.created_at
              ? new Date(payment.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A",
            itemsCount: 1,
            total: payment.amount || 0,
            status: payment.status?.toLowerCase() === "completed" ? "PAID" : "PENDING",
            paymentMethod: "Payment",
            orderStatus: payment.status,
          });
        });
      }

      // Sort by date descending
      invoiceList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setOrders(invoiceList);
    } catch (err) {
      setError(err.message || "Error fetching invoices");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔥 FILTER LOGIC */
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = (order.id?.toString() || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus = statusFilter === "ALL" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const totalAmount = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h2>Invoices</h2>
              <p>Billing & GST details</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p>Loading your invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h2>Invoices</h2>
              <p>Billing & GST details</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#d32f2f" }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* 🔥 HEADER */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h2>Invoices</h2>
            <p>Billing & GST details</p>
          </div>

          <input
            className={styles.search}
            placeholder="Search by Invoice ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.headerBottom}>
          {/* FILTERS */}
          <div className={styles.filters}>
            {["ALL", "PAID", "PENDING"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`${styles.chip} ${
                  statusFilter === s ? styles.active : ""
                }`}
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>

          {/* STATS */}
          <div className={styles.stats}>
            <div>
              <span>Total Invoices</span>
              <strong>{filteredOrders.length}</strong>
            </div>
            <div>
              <span>Total Amount</span>
              <strong>₹{totalAmount.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {filteredOrders.length === 0 ? (
          <div className={styles.empty}>
            {orders.length === 0
              ? "No invoices yet"
              : "No invoices found"}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <InvoiceOrderCard
              key={order.id}
              order={order}
              invoiceId={order.invoiceId}
              paymentId={order.paymentId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Invoices;
