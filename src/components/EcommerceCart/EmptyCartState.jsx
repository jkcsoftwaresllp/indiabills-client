import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles/EmptyCartState.module.css";

export default function EmptyCartState() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartShopping = () => {
    // If accessed from /cart or /checkout (admin shop), go to /shop
    // If accessed from /customer/cart or /customer/checkout, go to /customer
    if (location.pathname === '/cart' || location.pathname === '/checkout') {
      navigate('/shop');
    } else {
      navigate('/customer');
    }
  };

  return (
    <div className={styles.empty}>
      <h2>Your cart is empty</h2>
      <p>Add items to place an order</p>
      <button onClick={handleStartShopping}>Start Shopping</button>
    </div>
  );
}
