import { useNavigate } from "react-router-dom";
import styles from "./styles/InvoiceOrderCard.module.css";

export default function InvoiceOrderCard({ order, invoiceId, paymentId }) {
  const navigate = useNavigate();
  const isPaid = order.status === "PAID";

  // Use invoiceId if available, otherwise use order ID
  const navId = invoiceId || paymentId || order.id;

  return (
    <div className={styles.card}>
      {/* Accent strip */}
      <div
        className={`${styles.accent} ${
          isPaid ? styles.accentPaid : styles.accentPending
        }`}
      />

      {/* LEFT */}
      <div className={styles.left}>
        <h4>Invoice #{order.id}</h4>

        <p className={styles.meta}>
          {order.itemsCount} items • {order.date}
        </p>

        {/* Product preview dots */}
        <div className={styles.preview}>
          {[...Array(Math.min(order.itemsCount, 3))].map((_, i) => (
            <span key={i} />
          ))}
          {order.itemsCount > 3 && (
            <small>+{order.itemsCount - 3}</small>
          )}
        </div>
      </div>

      {/* CENTER */}
      <div className={styles.center}>
        <span className={styles.amount}>₹{order.total.toLocaleString()}</span>

        <span
          className={`${styles.status} ${
            isPaid ? styles.paid : styles.pending
          }`}
        >
          {order.status}
        </span>

        <span className={styles.payment}>
          Payment: {order.paymentMethod}
        </span>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <button
          className={styles.viewBtn}
          onClick={() =>
            navigate(
              `/customer/invoices/${navId}`
            )
          }
        >
          View & Download Invoice
        </button>

        <span className={styles.subAction}>
         {order.status === "PAID" ? "Order completed successfully" : "Order pending"}
        </span>
      </div>
    </div>
  );
}
