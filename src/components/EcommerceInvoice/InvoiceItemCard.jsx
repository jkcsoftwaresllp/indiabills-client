import styles from "./styles/InvoiceItemCard.module.css";

export default function InvoiceItemCard({ item }) {
  return (
    <div className={styles.card}>
      <img src={item.image} alt={item.name} />

      <div className={styles.info}>
        <span className={styles.brand}>{item.brand}</span>
        <h4>{item.name}</h4>
        <p>Qty: {item.qty}</p>
      </div>

      <div className={styles.price}>
        ₹{item.price * item.qty}
      </div>
    </div>
  );
}
