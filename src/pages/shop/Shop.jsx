// import { useEffect, useState } from "react";
// import { getData } from "../../network/api";
// import ProductCard from "../../components/shop/ProductCard";
// import SearchBar from "../../components/LayoutComponent/SearchBar";
// import PageAnimate from "../../components/Animate/PageAnimate";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useStore } from "../../store/store";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const ShopPage = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [announcement, setAnnouncement] = useState({});

//   const { selectedProducts } = useStore();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getData("channel/announcements/shop");
//       if (data.length > 0) {
//         setAnnouncement(data[0]);
//       }
//     };
//     fetchData().then();
//   }, []);

//   const ShowCart = () => {
//     if (selectedProducts) {
//       navigate("/cart");
//     }
//   };

//   const ShowOrders = () => {
//     navigate("/orders");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getData("/shop/products");
//       if (data.length > 0) {
//         setProducts(data);
//       }
//     };
//     fetchData().then(() => setIsLoading(false));
//   }, []);

//   const [searchFieldByName, setSearchFieldByName] = useState("");

//   const filteredData = products.filter((dataItem) => {
//     return (
//       dataItem["itemName"] &&
//       dataItem["itemName"]
//         .toLowerCase()
//         .includes(searchFieldByName.toLowerCase())
//     );
//   });

//   const itemVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: 20 },
//   };

//   const Catalogue = () => {
//     if (isLoading) {
//       return (
//         <div className="w-full grid place-items-center">
//           <CircularProgress />
//         </div>
//       );
//     }
//     return (
//       <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
//         <AnimatePresence>
//           {filteredData.map((product, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               layout
//             >
//               <ProductCard key={index} product={product} />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     );
//   };

//   if (products.length === 0) {
//     return <p>No Product available in stock</p>;
//   }

//   return (
//     <PageAnimate>
//       <div className={"p-6 flex flex-col gap-4 "}>
//         <section className={"flex gap-4"}>
//           <div className={"w-full idms-shop-bg"}>
//             <img
//               src={
//                 "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/cf8c5599420499.5f09d760d115b.jpg"
//               }
//               alt={"shop"}
//               className={"w-full h-60 object-cover rounded-xl"}
//             />
//           </div>
//         </section>
//         {announcement.message && (
//           <marquee className={"bg-primary py-2 px-px rounded-xl text-slate-400"}>
//             <span className={"text-yellow-200 font-semibold"}>
//               <b>Announcement:</b>
//             </span>{" "}
//             {announcement.message}
//           </marquee>
//         )}
//         <section
//           className={"p-2 w-full flex justify-between gap-4 items-center"}
//         >
//           <SearchBar
//             className={"w-full"}
//             title={"product by name"}
//             value={searchFieldByName}
//             setSearchFieldByName={setSearchFieldByName}
//           />

//           <div className={"p-2 rounded-xl idms-transparent-control relative"}>
//             <ShoppingCartIcon />
//             <p className={"absolute top-0 right-0 bg-rose-500 outline-none border-none text-slate-200 px-1 rounded-full text-xs"}>
//               {Object.keys(selectedProducts).length > 0 &&
//                 Object.keys(selectedProducts).length}
//             </p>
//           </div>
//           <div
//             onClick={ShowCart}
//             className={
//               "p-2 cursor-pointer hover:shadow-md transition rounded-xl idms-transparent-control relative"
//             }
//           >
//             <p className={"text-nowrap font-medium px-2"}>Checkout</p>
//           </div>
//         </section>

//         <main>
//           <Catalogue />
//         </main>
//       </div>
//     </PageAnimate>
//   );
// };

// export default ShopPage;


import { useEffect, useState } from 'react';
import ProductCard from '../../components/shop/ProductCard';
import SearchBar from '../../components/LayoutComponent/SearchBar';
import PageAnimate from '../../components/Animate/PageAnimate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CircularProgress from '@mui/material/CircularProgress';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutes } from '../../hooks/useRoutes';

// 👇 Mocked getData function with demo products and announcement
const getData = async (endpoint) => {
  if (endpoint === "/shop/products") {
    return [
      {
        id: 1,
        itemName: "Wireless Headphones",
        price: 1999,
        description: "High-quality over-ear wireless headphones.",
        imageUrl:
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800",
      },
      {
        id: 2,
        itemName: "Smart Watch",
        price: 2999,
        description: "Track your fitness and get notifications on the go.",
        imageUrl:
          "https://images.unsplash.com/photo-1516573982172-c5b7f43a4a16?auto=format&fit=crop&w=800",
      },
      {
        id: 3,
        itemName: "Gaming Keyboard",
        price: 1499,
        description: "RGB mechanical keyboard with fast switches.",
        imageUrl:
          "https://images.unsplash.com/photo-1587202372775-98973b6ba519?auto=format&fit=crop&w=800",
      },
    ];
  } else if (endpoint === "channel/announcements/shop") {
    return [
      {
        message: "⚡ Summer Sale! Get 20% off on selected items until July 31st.",
      },
    ];
  }
  return [];
};

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({});

  const { selectedProducts } = useStore();
  const { getRoute } = useRoutes();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData('channel/announcements/shop');
      if (data.length > 0) {
        setAnnouncement(data[0]);
      }
    };
    fetchData().then();
  }, []);

  const ShowCart = () => {
    if (selectedProducts) {
      navigate(getRoute('/cart'));
    }
  };

  const ShowOrders = () => {
    navigate(getRoute('/orders'));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData('/shop/products');
      if (data.length > 0) {
        setProducts(data);
      }
    };
    fetchData().then(() => setIsLoading(false));
  }, []);

  const [searchFieldByName, setSearchFieldByName] = useState('');

  const filteredData = products.filter((dataItem) => {
    return (
      dataItem['itemName'] &&
      dataItem['itemName']
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
        <div className="w-full grid place-items-center">
          <CircularProgress />
        </div>
      );
    }

    if (filteredData.length === 0) {
      return <p className="text-center text-gray-500">No matching products found.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

  if (products.length === 0 && !isLoading) {
    return <p className="text-center mt-10 text-gray-500">No Product available in stock</p>;
  }

  return (
    <PageAnimate>
      <div className="p-6 flex flex-col gap-4">
        <section className="flex gap-4">
          <div className="w-full idms-shop-bg">
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/cf8c5599420499.5f09d760d115b.jpg"
              alt="shop"
              className="w-full h-60 object-cover rounded-xl"
            />
          </div>
        </section>

        {announcement.message && (
          <marquee className="bg-primary py-2 px-px rounded-xl text-slate-400">
            <span className="text-yellow-200 font-semibold">
              <b>Announcement:</b>
            </span>{' '}
            {announcement.message}
          </marquee>
        )}

        <section className="p-2 w-full flex justify-between gap-4 items-center">
          <SearchBar
            className="w-full"
            title="product by name"
            value={searchFieldByName}
            setSearchFieldByName={setSearchFieldByName}
          />

          <div className="p-2 rounded-xl idms-transparent-control relative">
            <ShoppingCartIcon />
            <p className="absolute top-0 right-0 bg-rose-500 text-slate-200 px-1 rounded-full text-xs">
              {Object.keys(selectedProducts).length > 0 &&
                Object.keys(selectedProducts).length}
            </p>
          </div>

          <div
            onClick={ShowCart}
            className="p-2 cursor-pointer hover:shadow-md transition rounded-xl idms-transparent-control relative"
          >
            <p className="text-nowrap font-medium px-2">Checkout</p>
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
