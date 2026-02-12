import { Trash2, Heart, Star, Minus, Plus, } from "lucide-react";
import { useState } from "react";
import styles from "./styles/CartItemCard.module.css";
import { toggleWishlist, removeFromCart, updateCartItem } from "../../network/api";
import { useStore } from "../../store/store";

export default function CartItemCard({ item, onItemUpdated }) {
  const totalPrice = item.price * item.qty;
  const [loading, setLoading] = useState(false);
  const { customerData, updateCustomerWishlist, successPopup, errorPopup } = useStore();
  const isWishlisted = customerData.wishlist.some(w => w.id === item.productId);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const result = await removeFromCart({ product_id: item.productId });
      if (result.status === 200) {
        successPopup('Item removed from cart');
        onItemUpdated?.();
      } else {
        errorPopup('Failed to remove item');
      }
    } catch (error) {
      errorPopup('Error removing item');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (newQty) => {
    if (newQty > 0 && newQty <= item.stock) {
      setLoading(true);
      try {
        const result = await updateCartItem({ product_id: item.productId, quantity: newQty });
        if (result.status === 200) {
          successPopup('Cart updated');
          onItemUpdated?.();
        } else {
          errorPopup('Failed to update quantity');
        }
      } catch (error) {
        errorPopup('Error updating quantity');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveWishlist = async () => {
    const result = await toggleWishlist(item.productId);
    if (result.status === 200) {
      const updatedWishlist = isWishlisted
        ? customerData.wishlist.filter(w => w.id !== item.productId)
        : [...customerData.wishlist, { id: item.productId }];
      updateCustomerWishlist(updatedWishlist);
      successPopup(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    }
  };

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
            <button onClick={() => handleQuantityChange(item.qty - 1)}>
              <Minus size={14} />
            </button>
            <span>{item.qty}</span>
            <button onClick={() => handleQuantityChange(item.qty + 1)}>
              <Plus size={14} />
            </button>
          </div>

          <button className={styles.save} onClick={handleSaveWishlist}>
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} /> {isWishlisted ? 'Saved' : 'Save'}
          </button>

          <button className={styles.remove} onClick={handleRemove}>
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
