import styles from "./styles/InvoicePriceDetails.module.css";

export default function InvoicePriceDetails({ items }) {
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  return (
    <div className={styles.box}>
      <h3>Price Details</h3>

      <div className={styles.row}>
        <span>Price</span>
        <span>₹{subtotal}</span>
      </div>

      <div className={styles.row}>
        <span>Delivery</span>
        <span className={styles.free}>FREE</span>
      </div>

      <div className={styles.total}>
        <span>Total Amount</span>
        <span>₹{subtotal}</span>
      </div>

      {/* 🔥 Download Badge Button */}
      <button className={styles.downloadBadge}>
        ⬇ Download Invoice
      </button>
    </div>
  );
}
