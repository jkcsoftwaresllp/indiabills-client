import styles from "./styles/OrderCard.module.css";

export default function OrderCard({ order }) {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h4>Order #{order.id}</h4>
          <span className={styles.date}>{order.date}</span>
        </div>
        <span className={styles.status}>{order.status}</span>
      </div>

      {/* Items Preview */}
      <div className={styles.items}>
        {order.items.map((item) => (
          <img key={item.id} src={item.image} alt="" />
        ))}
      </div>

      {/* Status Timeline */}
      <div className={styles.timeline}>
        {["Placed", "Shipped", "Delivered"].map((step) => (
          <div
            key={step}
            className={`${styles.step} ${
              step === order.status ? styles.active : ""
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.secondary}>View Details</button>
        <button className={styles.primary}>Reorder</button>
      </div>
    </div>
  );
}
