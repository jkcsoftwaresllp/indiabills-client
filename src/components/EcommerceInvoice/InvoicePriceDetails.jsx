import styles from "./styles/InvoicePriceDetails.module.css";
import { useParams } from "react-router-dom";
import InvoiceDownload from "./InvoiceDownload";

export default function InvoicePriceDetails({ items, invoiceData }) {
  const { id } = useParams();
  
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  const discount = items.reduce(
    (s, i) => s + (i.discount || 0),
    0
  );

  const deliveryCharges = 0;
  const total = subtotal - discount + deliveryCharges;

  return (
    <div className={styles.box}>
      <h3 className={styles.heading}>Price Details</h3>

      <div className={styles.row}>
        <span>Price ({items.length} items)</span>
        <span>₹{(subtotal || 0).toLocaleString()}</span>
      </div>

      {discount > 0 && (
        <div className={styles.row}>
          <span>Discount</span>
          <span className={styles.discount}>−₹{(discount || 0).toLocaleString()}</span>
        </div>
      )}

      <div className={styles.row}>
        <span>Delivery Charges</span>
        <span className={styles.free}>FREE</span>
      </div>

      <div className={styles.total}>
        <span>Total Amount</span>
        <span>₹{(total || 0).toLocaleString()}</span>
      </div>

      {discount > 0 && (
        <div className={styles.savings}>
          You saved ₹{(discount || 0).toLocaleString()} on this order 🎉
        </div>
      )}

      {/* 🔥 Download Invoice Badge */}
      <InvoiceDownload items={items} invoiceData={invoiceData} invoiceId={id} />

      <div className={styles.secureNote}>
        🔒 This invoice is digitally signed & GST compliant
      </div>
    </div>
  );
}
