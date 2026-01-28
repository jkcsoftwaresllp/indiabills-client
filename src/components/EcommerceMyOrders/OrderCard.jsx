import styles from "./styles/OrderCard.module.css";

const STATUS_STEPS = ["Placed", "Shipped", "Delivered"];

export default function OrderCard({ order }) {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h4 className={styles.orderId}>Order #{order.id}</h4>
          <span className={styles.date}>{order.date}</span>
        </div>

        <span
          className={`${styles.status} ${styles[order.status.toLowerCase()]}`}
        >
          {order.status}
        </span>
      </div>

      {/* Items Preview */}
      <div className={styles.items}>
        {order.items.map((item) => (
          <img key={item.id} src={item.image} alt="" />
        ))}

        {order.items.length > 4 && (
          <span className={styles.more}>
            +{order.items.length - 4}
          </span>
        )}
      </div>

      {/* Status Timeline */}
      <div className={styles.timeline}>
        {STATUS_STEPS.map((step, index) => {
          const isActive =
            STATUS_STEPS.indexOf(order.status) >= index;

          return (
            <div
              key={step}
              className={`${styles.step} ${isActive ? styles.activeStep : ""
                }`}
            >
              {step}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.secondary}>View Details</button>
        <button className={styles.primary}>Reorder</button>
      </div>
    </div>
  );
}
