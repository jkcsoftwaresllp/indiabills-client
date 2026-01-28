import styles from "./styles/InvoiceHeader.module.css";

export default function InvoiceHeader() {
  return (
    <div className={styles.header}>
      <div>
        <h2>Invoice</h2>
        <p>Invoice #INV-2026-0042</p>
      </div>

      <span className={styles.status}>PAID</span>
    </div>
  );
}
