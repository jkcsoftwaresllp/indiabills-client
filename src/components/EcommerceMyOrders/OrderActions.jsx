import styles from "./styles/OrderActions.module.css";

export function OrderActions() {
  return (
    <div className={styles.actions}>
      <button className={styles.secondary}>View Details</button>
      <button className={styles.primary}>Reorder</button>
    </div>
  );
}
