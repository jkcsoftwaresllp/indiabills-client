import { useEffect, useState } from "react";
import { getData } from "../../network/api";
import ProductCard from "../../components/shop/ProductCard";
import SearchBar from "../../components/LayoutComponent/SearchBar";
import PageAnimate from "../../components/Animate/PageAnimate";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from './styles/ShopPage.module.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({});

  const { selectedProducts } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("channel/announcements/shop");
      if (data.length > 0) {
        setAnnouncement(data[0]);
      }
    };
    fetchData().then();
  }, []);

  const ShowCart = () => {
    if (selectedProducts) {
      navigate("/cart");
    }
  };

  const ShowOrders = () => {
    navigate("/orders");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("/shop/products");
      if (data.length > 0) {
        setProducts(data);
      }
    };
    fetchData().then(() => setIsLoading(false));
  }, []);

  const [searchFieldByName, setSearchFieldByName] = useState("");

  const filteredData = products.filter((dataItem) => {
    return (
      dataItem["itemName"] &&
      dataItem["itemName"]
        .toLowerCase()
        .includes(searchFieldByName.toLowerCase())
    );
  });

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

 const Catalogue = () => {
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={styles.catalogueGrid}>
      <AnimatePresence>
        {filteredData.map((product, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <ProductCard key={index} product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

if (products.length === 0) {
  return <p>No Product available in stock</p>;
}

return (
  <PageAnimate>
    <div className={styles.container}>
      <section className={styles.shopSection}>
        <div className={styles.shopImageWrapper}>
          <img
            src={
              "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/cf8c5599420499.5f09d760d115b.jpg"
            }
            alt={"shop"}
            className={styles.shopImage}
          />
        </div>
      </section>
      {announcement.message && (
        <marquee className={styles.marquee}>
          <span className={styles.marqueeStrong}>
            <b>Announcement:</b>
          </span>{" "}
          {announcement.message}
        </marquee>
      )}
      <section className={styles.searchSection}>
        <SearchBar
          className={styles.searchBar}
          title={"product by name"}
          value={searchFieldByName}
          setSearchFieldByName={setSearchFieldByName}
        />

        <div className={styles.cartIconWrapper}>
          <ShoppingCartIcon />
          <p className={styles.cartCount}>
            {Object.keys(selectedProducts).length > 0 &&
              Object.keys(selectedProducts).length}
          </p>
        </div>
        <div
          onClick={ShowCart}
          className={styles.checkoutBtn}
        >
          <p className={styles.noWrap}>Checkout</p>
        </div>
      </section>

      <main>
        <Catalogue />
      </main>
    </div>
  </PageAnimate>
);
};

export default ShopPage;
