import { FiBox, FiCalendar, FiShoppingBag, FiInfo, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const PublicProductCard = ({ product, domain }) => {
  const navigate = useNavigate();

  const formatNumber = (num) =>
    num % 1 === 0 ? num.toString() : (Number(num) || 0).toFixed(2);

  const handleAddToCart = () => {
    navigate(`/register/${domain}`);
  };

  const handleWishlistToggle = () => {
    navigate(`/register/${domain}`);
  };

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
              <p className={styles.price}>₹{formatNumber(product.salePrice || product.unitMRP || 0)}</p>
              <p className={styles.gstLabel}>Inc. GST</p>
            </div>

            <button
              onClick={handleWishlistToggle}
              className={styles.wishlistBtn}
              aria-label="Add to wishlist"
              title="Add to wishlist"
            >
              <FiHeart className={styles.wishlistIcon} />
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
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Expiry */}
            <div className={styles.statItem}>
              <FiCalendar className={styles.statIcon} />
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Expiry</p>
                <div className={styles.statValue}>
                  <span>No Expiry</span>
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
                <p className={styles.detailValue}>{product.weight || '—'}g</p>
              </div>
            </div>
          </div>

          {/* Action Button - Only Add to Cart */}
          <div className={styles.actionsSection}>
            <button
              className={`${styles.addToCartBtn} ${styles.primary}`}
              onClick={handleAddToCart}
              aria-label="Sign up to purchase"
            >
              <FiShoppingBag style={{ display: 'inline-block', marginRight: '6px' }} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProductCard;
