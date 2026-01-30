import { ShieldCheck, Tag } from "lucide-react";
import styles from "./styles/CartPriceSummary.module.css";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function CartPriceSummary({ items }) {
  const navigate = useNavigate();
  const { checkout } = useCart();
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const mrpTotal = items.reduce(
    (sum, i) => sum + i.mrp * i.qty,
    0
  );

  const savings = mrpTotal - subtotal;
  const delivery = subtotal > 499 ? 0 : 40;
  const total = subtotal + delivery;

  return (
    <div className={styles.box}>
      <h3>Price Details</h3>

      {/* Coupon */}
      <div className={styles.coupon}>
        <Tag size={16} />
        <input placeholder="Apply coupon code" />
        <button>Apply</button>
      </div>

      {/* Breakdown */}
      <div className={styles.row}>
        <span>Price ({items.length} items)</span>
        <span>₹{mrpTotal}</span>
      </div>

      <div className={styles.row}>
        <span>Discount</span>
        <span className={styles.discount}>− ₹{savings}</span>
      </div>

      <div className={styles.row}>
        <span>Delivery Charges</span>
        <span>
          {delivery ? `₹${delivery}` : <b className={styles.free}>FREE</b>}
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.total}>
        <span>Total Amount</span>
        <span>₹{total}</span>
      </div>

      <p className={styles.savings}>
        You will save ₹{savings} on this order 🎉
      </p>

      <button className={styles.checkout} onClick={() => checkout().then(res => {
        if (res.success) navigate('/customer');
      })}>
        Place Order
      </button>

      <div className={styles.secure}>
        <ShieldCheck size={16} />
        <span>100% Secure Payments</span>
      </div>
    </div>
  );
}
