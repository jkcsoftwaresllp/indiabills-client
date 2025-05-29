import { useEffect, useState } from "react";
import { getData } from "../../../network/api";
import ProductCard from "../../../components/shop/ProductCard";
import SearchBar from "../../../components/LayoutComponent/SearchBar";
import PageAnimate from "../../../components/Animate/PageAnimate";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import { useStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";

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
        <div className="w-full grid place-items-center">
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={"flex gap-4"}>
        {filteredData.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    );
  };

  if (products.length === 0) {
    return <p>No Product available in stock</p>;
  }

  return (
    <PageAnimate>
      <div className={"p-6 flex flex-col gap-4"}>
        <marquee className={"bg-primary py-2 px-px rounded-xl text-slate-400"}>
          <b>Announcement:</b>
          <span className={"text-yellow-200 font-semibold"}> The Shop</span> is
          in early development stage, please report any bugs or issues to the
          developer.
        </marquee>
        <section
          className={"p-2 w-full flex justify-between gap-4 items-center"}
        >
          <SearchBar
            className={"w-full"}
            title={"product by name"}
            value={searchFieldByName}
            setSearchFieldByName={setSearchFieldByName}
          />

          <div
            onClick={ShowCart}
            className={
              "p-2 cursor-pointer rounded-xl idms-transparent-control relative"
            }
          >
            <ShoppingCartIcon />
            <p
              className={
                "absolute top-0 right-0 bg-rose-500 outline-none border-none text-slate-200 px-1 rounded-full text-xs"
              }
            >
              {Object.keys(selectedProducts).length > 0 &&
                Object.keys(selectedProducts).length}
            </p>
          </div>
        </section>

        <main>
          <Catalogue />
        </main>
      </div>
    </PageAnimate>
  );
};

export default ShopCustomer;