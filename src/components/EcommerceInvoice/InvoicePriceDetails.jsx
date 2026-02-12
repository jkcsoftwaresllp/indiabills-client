import styles from "./styles/InvoicePriceDetails.module.css";

export default function InvoicePriceDetails({ items }) {
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  const discount = items.reduce(
    (s, i) => s + (i.discount || 0),
    0
  );

  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  return (
    <div className={styles.box}>
      <h3 className={styles.heading}>Price Details</h3>

      <div className={styles.row}>
        <span>Price ({items.length} items)</span>
        <span>₹{subtotal}</span>
      </div>

      {discount > 0 && (
        <div className={styles.row}>
          <span>Discount</span>
          <span className={styles.discount}>−₹{discount}</span>
        </div>
      )}

      <div className={styles.row}>
        <span>Delivery Charges</span>
        <span className={styles.free}>FREE</span>
      </div>

      <div className={styles.row}>
        <span>Tax (GST 18%)</span>
        <span>₹{tax}</span>
      </div>

      <div className={styles.total}>
        <span>Total Amount</span>
        <span>₹{total}</span>
      </div>

      {discount > 0 && (
        <div className={styles.savings}>
          You saved ₹{discount} on this order 🎉
        </div>
      )}

      {/* 🔥 Download Invoice Badge */}
      <button className={styles.downloadBadge}>
        ⬇ Download Invoice
      </button>

      <div className={styles.secureNote}>
        🔒 This invoice is digitally signed & GST compliant
      </div>
    </div>
  );
}
