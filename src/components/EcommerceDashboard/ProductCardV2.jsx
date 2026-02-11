import { Heart, Star, CalendarDays, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuantitySelector from "./QuantitySelector";
import StockBadge from "./StockBadge";
import styles from "./styles/ProductCardV2.module.css";
import { addToCart } from "../../network/api";
import { useStore } from "../../store/store";

export default function ProductCardV2({ product, isWishlisted, onToggleWishlist, showQuantity, onAddToCart }) {
  const { successPopup, errorPopup, addCartItem } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Extract domain from URL path
  const getDomainFromPath = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    // Assuming domain is the last segment in /customer/dashboard/:domain
    return pathSegments[pathSegments.length - 1] || '';
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    const session = localStorage.getItem("session");
    if (!session) {
      const domain = getDomainFromPath();
      navigate(`/register/${domain}`);
      return;
    }

    setLoading(true);
    try {
      const result = await addToCart({ product_id: product.id, quantity });
      if (result.status === 201 || result.status === 200) {
        // Update store with new cart item
        const newCartItem = {
          id: result.data?.id || Date.now(),
          product_id: product.id,
          quantity: quantity,
          price_at_addition: product.price,
        };
        addCartItem(newCartItem);
        successPopup('Product added to cart');
        setQuantity(1);
      } else {
        errorPopup(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      errorPopup('Error adding to cart');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = () => {
    // Check if user is authenticated
    const session = localStorage.getItem("session");
    if (!session) {
      const domain = getDomainFromPath();
      navigate(`/register/${domain}`);
      return;
    }

    // Call the original wishlist toggle handler
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };
  return (
    <div className={styles.card}>
      {/* Wishlist */}
      <button
        className={`${styles.wishlist} ${isWishlisted ? styles.active : ""
          }`}
        onClick={handleToggleWishlist}
      >
        <Heart
          size={18}
          fill={isWishlisted ? "#dc2626" : "none"}
          color={isWishlisted ? "#dc2626" : "#334155"}
        />
      </button>


      {/* Image */}
      <div className={styles.imageBox}>
        <img src={product.image_url || product.image || '/placeholder-product.png'} alt={product.name} />
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
            ({(product.reviews || 0).toLocaleString()})
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
          <span>Weight: {product.weight ? parseFloat(product.weight).toFixed(2) : "—"} g</span>
        </div>

        {/* Quantity */}
        {showQuantity && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                −
              </button>
              <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <button className={styles.addBtn} onClick={handleAddToCart} disabled={loading || product.stock === 0}>
          <ShoppingCart size={16} style={{ marginRight: '6px', display: 'inline' }} />
          {loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
