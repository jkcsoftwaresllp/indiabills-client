import CartItemCard from "./CartItemCard";
import styles from "./styles/CartItemsList.module.css";

export default function CartItemsList({ items }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
