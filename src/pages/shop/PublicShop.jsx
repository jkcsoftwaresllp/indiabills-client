import { FiShoppingCart, FiPackage, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from '../../components/LayoutComponent/SearchBar';
import PageAnimate from '../../components/Animate/PageAnimate';
import PublicProductCard from '../../components/shop/PublicProductCard';
import { getProductsByDomain } from '../../network/api/publicApi';
import { useStore } from '../../store/store';
import styles from './Shop.module.css';

const PublicShop = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  const { errorPopup } = useStore();

  // Remove trailing slash if present (from splat route)
  const cleanDomain = domain?.replace(/\/$/, '') || '';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFieldByName, setSearchFieldByName] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Fetch products by domain
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProductsByDomain(cleanDomain, {
          page: pagination.page,
          limit: pagination.limit,
          name: searchFieldByName || undefined,
          isActive: true
        });

        if (response.status === 200 && response.data) {
          const mappedProducts = response.data.products.map(product => ({
            id: product.id,
            itemId: product.id,
            itemName: product.name,
            price: product.sale_price || product.unit_mrp,
            salePrice: product.sale_price || product.unit_mrp,
            description: product.description,
            manufacturer: product.manufacturer,
            currentQuantity: 0, // Public users don't see real stock
            imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800',
            unitMRP: product.unit_mrp,
            brand: product.brand,
            sku: product.sku,
            isActive: product.is_active,
            dimensions: product.dimensions,
            weight: product.weight,
            packSize: product.pack_size || 1
          }));

          setProducts(mappedProducts);
          setPagination(prev => ({
            ...prev,
            total: response.data.total,
            totalPages: response.data.totalPages
          }));
        } else {
          errorPopup(response.data?.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        errorPopup('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    if (cleanDomain) {
      fetchProducts();
    }
  }, [cleanDomain, pagination.page, searchFieldByName]);

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
              : 'No products available at the moment.'}
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
              <PublicProductCard product={product} domain={cleanDomain} />
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

            <div className={styles.authButtonsWrapper}>
              <motion.button
                className={styles.loginButton}
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign in to your account"
              >
                <FiLogIn size={18} />
                <span>Sign In</span>
              </motion.button>

              <motion.button
                className={styles.signupButton}
                onClick={() => navigate(`/register/${domain}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Create a new account"
              >
                <FiUserPlus size={18} />
                <span>Sign Up</span>
              </motion.button>
            </div>
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

export default PublicShop;
