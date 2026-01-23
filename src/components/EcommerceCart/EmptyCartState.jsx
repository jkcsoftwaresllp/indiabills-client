import styles from "./styles/EmptyCartState.module.css";

export default function EmptyCartState() {
  return (
    <div className={styles.empty}>
      <h2>Your cart is empty</h2>
      <p>Add items to place an order</p>
      <button>Start Shopping</button>
    </div>
  );
}
