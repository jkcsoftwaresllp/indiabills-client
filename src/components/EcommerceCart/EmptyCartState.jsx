import { useNavigate } from "react-router-dom";
import styles from "./styles/EmptyCartState.module.css";

export default function EmptyCartState() {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    navigate('/customer');
  };

  return (
    <div className={styles.empty}>
      <h2>Your cart is empty</h2>
      <p>Add items to place an order</p>
      <button onClick={handleStartShopping}>Start Shopping</button>
    </div>
  );
}
