import styles from "./styles/StockBadge.module.css";

export default function StockBadge({ stock }) {
  return (
    <span
      className={`${styles.badge} ${
        stock <= 0 ? styles.low : styles.ok
      }`}
    >
      Stock: {stock || "Low"}
    </span>
  );
}
