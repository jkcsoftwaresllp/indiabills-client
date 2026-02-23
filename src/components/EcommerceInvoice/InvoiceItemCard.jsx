import styles from "./styles/InvoiceItemCard.module.css";

export default function InvoiceItemCard({ item }) {
  const totalPrice = item.price * item.qty;
  const finalPrice = totalPrice - (item.discount || 0);

  return (
    <div className={styles.card}>
      {/* IMAGE */}
      <div className={styles.imageBox}>
        <img src={item.image} alt={item.name} />
      </div>

      {/* INFO */}
      <div className={styles.info}>
        <span className={styles.brand}>{item.brand}</span>

        <h4 className={styles.name}>{item.name}</h4>

        <p className={styles.variant}>{item.variant}</p>

        <div className={styles.meta}>
          <span>SKU: {item.sku}</span>
          <span>Qty: {item.qty}</span>
        </div>
      </div>

      {/* PRICE */}
      <div className={styles.priceBox}>
        <span className={styles.unit}>
          ₹{(item.price || 0).toLocaleString()} × {item.qty}
        </span>

        {item.discount > 0 && (
          <span className={styles.discount}>
            −₹{(item.discount || 0).toLocaleString()}
          </span>
        )}

        <span className={styles.final}>
          ₹{(finalPrice || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
