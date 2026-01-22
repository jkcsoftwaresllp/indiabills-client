import styles from "./styles/EmptyOrdersState.module.css";

export function EmptyOrdersState() {
  return (
    <div className={styles.empty}>
      <h3>No orders yet 📦</h3>
      <p>Start shopping to see your orders here</p>
    </div>
  );
}
