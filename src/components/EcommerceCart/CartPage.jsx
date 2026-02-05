import CartHeader from "./CartHeader";
import CartItemsList from "./CartItemsList";
import CartPriceSummary from "./CartPriceSummary.jsx";
import EmptyCartState from "./EmptyCartState";
import styles from "./styles/CartPage.module.css";

export default function CartPage({ cartItems = [], onItemUpdated }) {


  if (!cartItems.length) return <EmptyCartState />;

  return (
    <div className={styles.page}>
      <CartHeader count={cartItems.length} />

      <div className={styles.layout}>
        <CartItemsList items={cartItems} onItemUpdated={onItemUpdated} />
        <CartPriceSummary items={cartItems} />
      </div>
    </div>
  );
}
