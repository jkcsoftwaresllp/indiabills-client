import { Search } from "lucide-react";
import { useState } from "react";
import styles from "./styles/OrdersFilterBar.module.css";

export function OrdersFilterBar() {
  const statuses = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];
  const [active, setActive] = useState("All");

  return (
    <div className={styles.bar}>
      {/* Search */}
      <div className={styles.searchBox}>
        <Search size={16} />
        <input
          className={styles.search}
          placeholder="Search by product name or order ID"
        />
      </div>

      {/* Status Chips */}
      <div className={styles.chips}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`${styles.chip} ${
              active === s ? styles.active : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
