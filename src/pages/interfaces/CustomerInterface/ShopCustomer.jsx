import { useEffect, useState } from "react";
import { getData } from "../../../network/api";
import ProductCard from "../../../components/shop/ProductCard";
import SearchBar from "../../../components/LayoutComponent/SearchBar";
import PageAnimate from "../../../components/Animate/PageAnimate";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import { useStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import styles from './styles/ShopCustomer.module.css';

const ShopCustomer = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedProducts } = useStore();
  const navigate = useNavigate();

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
    fetchData().then(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
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

  const Catalogue = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <PageAnimate>
        <div className={styles.container}>
          <marquee className={styles.marquee}>
            <b>Announcement:</b>
            <span> The Shop</span> is in early development stage, please report any bugs or issues to the developer.
          </marquee>

          <section className={styles.sectionHeader}>
            <SearchBar
              className={styles.searchBarFullWidth}
              title="product by name"
              value={searchFieldByName}
              setSearchFieldByName={setSearchFieldByName}
            />

            <div onClick={ShowCart} className={styles.cartIconWrapper}>
              <ShoppingCartIcon />
              {Object.keys(selectedProducts).length > 0 && (
                <p className={styles.cartCountBadge}>
                  {Object.keys(selectedProducts).length}
                </p>
              )}
            </div>
          </section>

          <main>
            <div className={styles.productsWrapper}>
              {filteredData.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            {products.length === 0 && <p>No Product available in stock</p>}
          </main>
        </div>
      </PageAnimate>
    );
  };
}

export default ShopCustomer;