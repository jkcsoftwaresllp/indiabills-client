import styles from './styles/OrderSummary.module.css';

export default function OrderSummary({ items = [] }) {
  // MRP subtotal (original price)
  const mrpSubtotal = items.reduce((sum, i) => sum + (i.mrp * i.qty), 0);
  // Sale price subtotal (discounted price)
  const saleSubtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  // Discount amount
  const discount = mrpSubtotal - saleSubtotal;
  // Delivery charges
  const delivery = saleSubtotal > 499 ? 0 : 40;
  // Total with delivery and taxes (including all taxes)
  const total = saleSubtotal + delivery;

  return (
    <div className={styles.summary}>
      <h3>Order Summary</h3>

      {/* Items List */}
      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemQty}>Qty: {item.qty}</p>
            </div>
            <p className={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Price Breakdown */}
      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span>Price ({items.length} items)</span>
          <span>₹{mrpSubtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className={styles.row}>
            <span>Discount</span>
            <span className={styles.discount}>− ₹{discount.toLocaleString()}</span>
          </div>
        )}

        <div className={styles.row}>
          <span>Subtotal</span>
          <span>₹{saleSubtotal.toLocaleString()}</span>
        </div>

        <div className={styles.row}>
          <span>Delivery Charges</span>
          <span className={delivery === 0 ? styles.free : ''}>
            {delivery === 0 ? 'FREE' : `₹${delivery}`}
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Total */}
      <div className={styles.total}>
        <span>Total Amount (Incl. all taxes)</span>
        <span className={styles.totalPrice}>₹{total.toLocaleString()}</span>
      </div>

      {discount > 0 && (
        <p className={styles.savingsMsg}>
          You save ₹{discount.toLocaleString()} on this order
        </p>
      )}

      {/* Security Badge */}
      <div className={styles.secure}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>100% Secure Payments</span>
      </div>
    </div>
  );
}
