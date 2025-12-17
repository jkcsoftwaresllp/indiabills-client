import { FiBox, FiCalendar, FiPlus, FiTrash2, FiShoppingBag, FiInfo, FiHeart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Modal, Box, Input } from '@mui/material';
import { motion } from 'framer-motion';
import { useStore } from '../../store/store';
import { useRoutes } from '../../hooks/useRoutes';
import { useCart } from '../../hooks/useCart';
import { removeFromCart, toggleWishlist } from '../../network/api';
import { getProductById } from '../../network/api/productsApi';
import styles from './ProductCard.module.css';

// --- Component ---
const ProductCard = ({ product, showCartControls = false }) => {
  const { getRoute } = useRoutes();
  const { cart, customerData, updateCustomerWishlist, errorPopup, successPopup } = useStore();
  const { addItemToCart, removeItemFromCart, loading } = useCart();
  const { items: cartItems } = cart;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [error, setError] = useState('');
  const [salePrice, setSalePrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const productId = product.itemId || product.id;
  const cartItem = cartItems.find(item => item.product_id === productId);
  const isInCart = !!cartItem;
  const isInWishlist = customerData.wishlist.some(item => item.product_id === productId);

  const formatNumber = (num) =>
    num % 1 === 0 ? num.toString() : (Number(num) || 0).toFixed(2);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity || 1);
    } else {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [cartItem]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoadingPrice(true);
      const productDetails = await getProductById(productId);
      if (productDetails?.sale_price) {
        setSalePrice(productDetails.sale_price);
      }
      setLoadingPrice(false);
    };
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (quantity <= 0) return setError('Quantity must be greater than zero');
    setError('');

    // If product has variants, open modal to select them
    if (product.variants && product.variants.length > 0) {
      setIsModalOpen(true);
      return;
    }

    // Otherwise, add directly to cart using the hook which refreshes cart state
    await addItemToCart(productId, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const handleConfirm = async () => {
    if (quantity <= 0) return setError('Quantity must be greater than zero');
    setError('');
    await addItemToCart(productId, quantity);
    setIsModalOpen(false);
  };

  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(productId);
    if (result.status === 200) {
      const updatedWishlist = isInWishlist
        ? customerData.wishlist.filter(item => item.product_id !== productId)
        : [...customerData.wishlist, { product_id: productId }];
      updateCustomerWishlist(updatedWishlist);
    }
  };

  const handleRemove = async () => {
    await removeItemFromCart(productId);
    setIsModalOpen(false);
    setQuantity(1);
    setSelectedVariants({});
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const days = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  };

  const isLowStock = (q) => q <= (product.reorderLevel || 5);

  return (
    <motion.div
      className={styles.cardContainer}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={styles.card}>
        <div className={styles.cardContent}>
          {/* Header: Product Name, Price, Wishlist */}
          <div className={styles.headerSection}>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.itemName}</h3>
              <p className={styles.productBrand}>{product.manufacturer || 'Unknown Brand'}</p>
            </div>

            <div className={styles.priceSection}>
              <p className={styles.price}>₹{formatNumber(salePrice || 0)}</p>
              <p className={styles.gstLabel}>Inc. GST</p>
            </div>

            <button
              onClick={handleWishlistToggle}
              className={`${styles.wishlistBtn} ${isInWishlist ? styles.active : ''}`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={styles.wishlistIcon} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Stock & Expiry Stats */}
          <div className={styles.statsSection}>
            {/* Stock */}
            <div className={styles.statItem}>
              <FiBox className={styles.statIcon} />
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Stock</p>
                <div className={styles.statValue}>
                  <span>{product.currentQuantity}</span>
                  {isLowStock(product.currentQuantity) && (
                    <span className={styles.badge + ' ' + styles.badgeWarning}>Low</span>
                  )}
                </div>
              </div>
            </div>

            {/* Expiry */}
            <div className={styles.statItem}>
              <FiCalendar className={styles.statIcon} />
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Expiry</p>
                <div className={styles.statValue}>
                  {product.expiryDate ? (
                    <>
                      <span>{new Date(product.expiryDate).toLocaleDateString()}</span>
                      {isExpiringSoon(product.expiryDate) && (
                        <span className={styles.badge + ' ' + styles.badgeError}>Soon</span>
                      )}
                    </>
                  ) : (
                    <span>No Expiry</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className={styles.detailsSection}>
            <p className={styles.detailsHeader}>
              <FiInfo className={styles.detailsHeaderIcon} /> Product Details
            </p>
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <p className={styles.detailLabel}>Dimensions</p>
                <p className={styles.detailValue}>{product.dimensions || '—'}</p>
              </div>
              {product.packSize > 1 && (
                <div className={styles.detailRow}>
                  <p className={styles.detailLabel}>Pack Size</p>
                  <p className={styles.detailValue}>{product.packSize}</p>
                </div>
              )}
              <div className={styles.detailRow}>
                <p className={styles.detailLabel}>Weight</p>
                <p className={styles.detailValue}>{product.weight}g</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsSection}>
            {/* Quantity Controls */}
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(Math.min(product.currentQuantity, quantity + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className={`${styles.addToCartBtn} ${isInCart && showCartControls ? styles.success : styles.primary}`}
              onClick={handleAddToCart}
              disabled={loading}
              aria-label={isInCart && showCartControls ? 'Update cart' : 'Add to cart'}
            >
              <FiShoppingBag style={{ display: 'inline-block', marginRight: '6px' }} />
              {loading ? 'Adding...' : (isInCart && showCartControls ? 'Update Cart' : 'Add to Cart')}
            </button>

            {isInCart && showCartControls && (
              <button
                className={styles.removeBtn}
                onClick={handleRemove}
                aria-label="Remove from cart"
              >
                <FiTrash2 style={{ display: 'inline-block', marginRight: '6px' }} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>{product.itemName}</h2>

            {/* Variants Section */}
            {product.variants && product.variants.length > 0 && (
              <div className={styles.variantsSection}>
                {product.variants.map((variant, index) => (
                  <div key={index} className={styles.variantGroup}>
                    <label className={styles.variantLabel}>{variant.key}</label>
                    <div className={styles.variantOptions}>
                      {variant.values.filter(Boolean).map((value, idx) => (
                        <button
                          key={idx}
                          className={`${styles.variantBtn} ${selectedVariants[variant.key] === value ? styles.selected : ''}`}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [variant.key]: prev[variant.key] === value ? '' : value,
                            }))
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Section */}
            <div className={styles.quantitySection}>
              <label htmlFor="quantity" className={styles.quantityLabel}>
                Quantity (Max: {product.currentQuantity})
              </label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                fullWidth
                error={!!error}
                inputProps={{
                  min: 1,
                  max: product.currentQuantity,
                  className: styles.quantityInput,
                }}
                className={styles.quantityInput}
              />
              {error && (
                <span className={styles.errorMessage}>{error}</span>
              )}
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirm}
                disabled={quantity === 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default ProductCard;
