import styles from "./styles/OrderHeader.module.css";

export function OrderHeader({ order }) {
  return (
    <div className={styles.header}>
      <div>
        <h4>Order #{order.id}</h4>
        <span>{order.date}</span>
      </div>
      <span className={styles.status}>{order.status}</span>
    </div>
  );
}
