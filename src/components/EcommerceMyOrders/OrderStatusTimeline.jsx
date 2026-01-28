import styles from "./styles/OrderStatusTimeline.module.css";

export function OrderStatusTimeline({ status }) {
  return (
    <div className={styles.timeline}>
      {["Placed", "Shipped", "Delivered"].map((step) => (
        <div
          key={step}
          className={`${styles.step} ${
            step === status ? styles.active : ""
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
