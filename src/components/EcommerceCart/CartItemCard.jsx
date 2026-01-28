import { Trash2, Heart, Star, Minus, Plus, } from "lucide-react";
import styles from "./styles/CartItemCard.module.css";

export default function CartItemCard({ item }) {
  const totalPrice = item.price * item.qty;

  return (
    <div className={styles.card}>
      {/* Image */}
      <div className={styles.imageBox}>
        <img src={item.image} alt={item.name} />
      </div>

      {/* Details */}
      <div className={styles.details}>
        <span className={styles.brand}>{item.brand}</span>

        <h4 className={styles.title}>{item.name}</h4>

        <div className={styles.meta}>
          <span className={styles.rating}>
            <Star size={14} />
            {item.rating}
            <small>({item.reviews})</small>
          </span>

          {item.stock <= 5 && (
            <span className={styles.stock}>
              Only {item.stock} left
            </span>
          )}
        </div>

        {/* Price Row */}
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{item.price}</span>
          <span className={styles.mrp}>₹{item.mrp}</span>
          <span className={styles.discount}>
            {item.discount}% OFF
          </span>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.qty}>
            <button>
              <Minus size={14} />
            </button>
            <span>{item.qty}</span>
            <button>
              <Plus size={14} />
            </button>
          </div>

          <button className={styles.save}>
            <Heart size={16} /> Save
          </button>

          <button className={styles.remove}>
            <Trash2 size={16} /> Remove
          </button>
        </div>
      </div>

      {/* Total */}
      <div className={styles.total}>
        ₹{totalPrice}
      </div>
    </div>
  );
}
