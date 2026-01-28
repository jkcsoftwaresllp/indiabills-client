import { Package, RefreshCcw, HelpCircle } from "lucide-react";
import styles from "./styles/MyOrders.module.css";

export function OrdersHeader() {
  return (
    <div className={styles.header}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.iconBox}>
          <Package size={22} />
        </div>

        <div>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>
            Track, manage and reorder your purchases
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.actions}>
        <button className={styles.secondaryBtn}>
          <HelpCircle size={16} />
          Help
        </button>

        <button className={styles.primaryBtn}>
          <RefreshCcw size={16} />
          Reorder
        </button>
      </div>
    </div>
  );
}
