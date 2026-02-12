import styles from "./styles/CartHeader.module.css";
import indiaBillsLogo from "../../assets/IndiaBills_logo.png";
import { ShieldCheck, Truck } from "lucide-react";

export default function CartHeader({ count }) {
  return (
    <div className={styles.wrapper}>
      {/* Left Section */}
      <div className={styles.left}>
        <img src={indiaBillsLogo} alt="IndiaBills" className={styles.logo} />

        <div className={styles.text}>
          <h2>My Cart</h2>
          <span>{count} items ready to checkout</span>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        <div className={styles.badge}>
          <ShieldCheck size={16} />
          <span>100% Secure</span>
        </div>

        <div className={styles.badge}>
          <Truck size={16} />
          <span>Fast Delivery</span>
        </div>
      </div>
    </div>
  );
}
