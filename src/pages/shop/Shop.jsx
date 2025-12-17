import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/shop/ProductCard';
import SearchBar from '../../components/LayoutComponent/SearchBar';
import PageAnimate from '../../components/Animate/PageAnimate';
import CircularProgress from '@mui/material/CircularProgress';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutes } from '../../hooks/useRoutes';
import { useCart } from '../../hooks/useCart';
import { getProducts, getBatches } from '../../network/api';
import { getShopAnnouncements } from '../../network/api/channelApi';
import { socket } from '../../network/websocket';
import styles from './Shop.module.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({});
  const [searchFieldByName, setSearchFieldByName] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  const { selectedProducts, cart } = useStore();
  const { getCartItemCount } = useCart();
  const { getRoute } = useRoutes();
  const navigate = useNavigate();

  // Update cart count whenever cart changes
  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [cart.items, getCartItemCount]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getShopAnnouncements();
        if (response.status === 200 && response.data.length > 0) {
          setAnnouncement(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();

    // Listen for real-time announcements
    const handleNewAnnouncement = (announcement) => {
      if (announcement.location === 'shop') {
        setAnnouncement(announcement);
      }
    };

    socket.on('newAnnouncement', handleNewAnnouncement);

    return () => {
      socket.off('newAnnouncement', handleNewAnnouncement);
    };
  }, []);

  // Fetch products with batch and tax data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();

        // Fetch batch data for all products
        const batches = await getBatches();
        const batchQuantityMap = {};

        if (batches && Array.isArray(batches)) {
          batches.forEach(batch => {
            if (!batchQuantityMap[batch.product_id]) {
              batchQuantityMap[batch.product_id] = 0;
            }
            // Sum remaining quantity from all batches for this product
            // Parse string to float since remaining_quantity comes as string from backend
            const remainingQty = parseFloat(batch.remaining_quantity) || 0;
            batchQuantityMap[batch.product_id] += remainingQty;
          });
        }

        const mappedProducts = products.map(product => ({
          id: product.id,
          itemId: product.id,
          itemName: product.name,
          price: product.purchasePrice,
          salePrice: product.purchasePrice,
          description: product.description,
          manufacturer: product.manufacturer,
          // Fetch remaining quantity from batches
          currentQuantity: Math.floor(batchQuantityMap[product.id] || 0),
          imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800',
          // Fetch tax from backend, with fallback to 0
          cgst: product.cgst || (product.taxes?.cgst || 0),
          sgst: product.sgst || (product.taxes?.sgst || 0),
          cess: product.cess || (product.taxes?.cess || 0),
          hsn: product.barcode || '',
          unitMRP: product.unitMRP,
          dimensions: product.dimensions,
          weight: product.weight,
          reorderLevel: product.reorderLevel
        }));
        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredData = products.filter((dataItem) => {
    return (
      dataItem['itemName'] &&
      dataItem['itemName']
        .toLowerCase()
        .includes(searchFieldByName.toLowerCase())
    );
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const ShowCart = () => {
    navigate(getRoute('/cart'));
  };

  const renderCatalogueContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <CircularProgress size={50} />
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateIcon}>
            <FiPackage />
          </div>
          <div className={styles.emptyStateTitle}>No Products Found</div>
          <div className={styles.emptyStateDescription}>
            {searchFieldByName
              ? `No products match "${searchFieldByName}". Try searching with different keywords.`
              : 'No products available in stock at the moment.'}
          </div>
        </div>
      );
    }

    return (
      <motion.div
        className={styles.catalogueSection}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {filteredData.map((product, index) => (
            <motion.div
              key={product.itemId || index}
              variants={itemVariants}
              exit="exit"
              layout
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <PageAnimate>
      <div className={styles.shopContainer}>
        <div className={styles.shopContent}>
          {/* Hero Banner */}
          <motion.div
            className={styles.heroBannerWrapper}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/cf8c5599420499.5f09d760d115b.jpg"
              alt="shop"
              className={styles.heroBanner}
            />
            <div className={styles.bannerOverlay} />
          </motion.div>

          {/* Announcement Banner */}
          {announcement.message && (
            <motion.div
              className={styles.announcementBanner}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.announcementIcon}>📢</span>
              <div className={styles.announcementText}>
                <strong>Announcement:</strong> {announcement.message}
              </div>
            </motion.div>
          )}

          {/* Controls Section */}
          <motion.div
            className={styles.controlsSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.searchWrapper}>
              <SearchBar
                title="products by name"
                value={searchFieldByName}
                setSearchFieldByName={setSearchFieldByName}
              />
            </div>

            <motion.button
              className={styles.cartIconWrapper}
              onClick={cartItemCount > 0 ? ShowCart : null}
              whileHover={cartItemCount > 0 ? { scale: 1.1 } : {}}
              whileTap={cartItemCount > 0 ? { scale: 0.95 } : {}}
              title={cartItemCount > 0 ? 'Go to cart' : 'Cart is empty'}
              disabled={cartItemCount === 0}
              style={{
                opacity: cartItemCount === 0 ? 0.5 : 1,
                cursor: cartItemCount === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <FiShoppingCart size={22} />
              {cartItemCount > 0 && (
                <div className={styles.cartBadge}>{cartItemCount}</div>
              )}
            </motion.button>
          </motion.div>

          {/* Main Catalogue */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderCatalogueContent()}
          </motion.section>
        </div>
      </div>
    </PageAnimate>
  );
};

export default ShopPage;
