import { useState } from "react";
import styles from "./styles/QuantitySelector.module.css";

export default function QuantitySelector() {
  const [qty, setQty] = useState(1);

  return (
    <div className={styles.qtyBox}>
      <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
      <span>{qty}</span>
      <button onClick={() => setQty(qty + 1)}>+</button>
    </div>
  );
}
