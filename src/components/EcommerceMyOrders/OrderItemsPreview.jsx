import styles from "./styles/OrderItemsPreview.module.css";

export function OrderItemsPreview({ items }) {
  return (
    <div className={styles.items}>
      {items.map((item) => (
        <img key={item.id} src={item.image} alt="" />
      ))}
    </div>
  );
}
