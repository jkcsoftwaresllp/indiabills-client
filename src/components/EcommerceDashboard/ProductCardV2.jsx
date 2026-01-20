import { Heart, Star, CalendarDays } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import StockBadge from "./StockBadge";
import styles from "./styles/ProductCardV2.module.css";

export default function ProductCardV2({ product }) {
  return (
    <div className={styles.card}>
      {/* Wishlist */}
      <button className={styles.wishlist}>
        <Heart size={18} />
      </button>

      {/* Image */}
      <div className={styles.imageBox}>
        <img src={product.image} alt={product.name} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.title} title={product.name}>{product.name}</h3>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <span className={styles.rating}>
            <Star size={14} /> {product.rating}
          </span>
          <span className={styles.reviews}>
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price}</span>
          <span className={styles.mrp}>₹{product.mrp}</span>
          <span className={styles.discount}>{product.discount}% OFF</span>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <StockBadge stock={product.stock} />
          <div className={styles.metaItem}>
            <CalendarDays size={14} />
            <span>{product.expiry || "No Expiry"}</span>
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          <span>Dimensions: {product.dimensions || "—"}</span>
          <span>Weight: {product.weight || "—"} g</span>
        </div>

        {/* Quantity */}
        <QuantitySelector />

        {/* CTA */}
        <button className={styles.addBtn}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
