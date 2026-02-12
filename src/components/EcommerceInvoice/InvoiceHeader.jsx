import styles from "./styles/InvoiceHeader.module.css";

export default function InvoiceHeader({
  invoiceId,
  date,
  totalAmount,
  status,
}) {
  const isPaid = status === "PAID";

  return (
    <div className={styles.header}>
      {/* Left */}
      <div className={styles.left}>
        <h2 className={styles.title}>Invoice</h2>

        <div className={styles.meta}>
          <span>
            <strong>Invoice ID:</strong> {invoiceId}
          </span>
          <span>
            <strong>Date:</strong> {date}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        <span className={styles.amount}>₹{totalAmount}</span>

        <span
          className={`${styles.status} ${
            isPaid ? styles.paid : styles.pending
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
