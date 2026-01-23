import CartHeader from "./CartHeader";
import CartItemsList from "./CartItemsList";
import CartPriceSummary from "./CartPriceSummary.jsx";
import EmptyCartState from "./EmptyCartState";
import styles from "./styles/CartPage.module.css";

export default function CartPage({ cartItems00 = [] }) {
 const cartItems = [
  {
    id: "cart-1",
    name: "iPhone 15 Pro Max (256 GB, Natural Titanium)",
    brand: "Apple",
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3nC2qKUux8jHgT56FG6XmqIAHdyBUoqUr14lWt4FYNbOAgtqNgXwSXeZoRyrxMV6Nusxcn1G-z9oErJjcPPeoatnJe3UpGvYuHbL74P0TXPnnWSzFPSRGQ9HW08YTYm8r5LcQIh4&usqp=CAc",
    price: 134999,
    mrp: 159999,
    discount: 15,
    rating: 4.7,
    reviews: 12034,
    stock: 4,
    qty: 1,
  },
  {
    id: "cart-2",
    name: "Samsung Galaxy S24 Ultra (512 GB, Titanium Gray)",
    brand: "Samsung",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTZB7hHkMFCZ5coN1nuoJmU-580Gn6lhxt_EBSre_pGyxz3oan_K10qXJ_mch-rF3pW3fUA8l-Qmo22n7deN6pLISmt_2OsSZVP5SIVCBWsjRrbmrVa-JHs&usqp=CAc",
    price: 129999,
    mrp: 149999,
    discount: 13,
    rating: 4.6,
    reviews: 9842,
    stock: 7,
    qty: 2,
  },
  {
    id: "cart-3",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSzG0OhhtBafEngdNmmpfNgrgcVzvEEec0AK8wWCcJn9XMQ6TqPK76CriuwiqrcX0_7tJgzv66yXleIFe6Am92NPj9cwi1jpY8wlkKAyYF20avEb80UThYwkC4mPtp6szf-v24TDvU&usqp=CAc",
    price: 29999,
    mrp: 34999,
    discount: 14,
    rating: 4.8,
    reviews: 18321,
    stock: 3,
    qty: 1,
  },{
    id: "cart-1",
    name: "iPhone 15 Pro Max (256 GB, Natural Titanium)",
    brand: "Apple",
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3nC2qKUux8jHgT56FG6XmqIAHdyBUoqUr14lWt4FYNbOAgtqNgXwSXeZoRyrxMV6Nusxcn1G-z9oErJjcPPeoatnJe3UpGvYuHbL74P0TXPnnWSzFPSRGQ9HW08YTYm8r5LcQIh4&usqp=CAc",
    price: 134999,
    mrp: 159999,
    discount: 15,
    rating: 4.7,
    reviews: 12034,
    stock: 4,
    qty: 1,
  },
  {
    id: "cart-2",
    name: "Samsung Galaxy S24 Ultra (512 GB, Titanium Gray)",
    brand: "Samsung",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTZB7hHkMFCZ5coN1nuoJmU-580Gn6lhxt_EBSre_pGyxz3oan_K10qXJ_mch-rF3pW3fUA8l-Qmo22n7deN6pLISmt_2OsSZVP5SIVCBWsjRrbmrVa-JHs&usqp=CAc",
    price: 129999,
    mrp: 149999,
    discount: 13,
    rating: 4.6,
    reviews: 9842,
    stock: 7,
    qty: 2,
  },
  {
    id: "cart-3",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSzG0OhhtBafEngdNmmpfNgrgcVzvEEec0AK8wWCcJn9XMQ6TqPK76CriuwiqrcX0_7tJgzv66yXleIFe6Am92NPj9cwi1jpY8wlkKAyYF20avEb80UThYwkC4mPtp6szf-v24TDvU&usqp=CAc",
    price: 29999,
    mrp: 34999,
    discount: 14,
    rating: 4.8,
    reviews: 18321,
    stock: 3,
    qty: 1,
  },
];


  if (!cartItems.length) return <EmptyCartState />;

  return (
    <div className={styles.page}>
      <CartHeader count={cartItems.length} />

      <div className={styles.layout}>
        <CartItemsList items={cartItems} />
        <CartPriceSummary items={cartItems} />
      </div>
    </div>
  );
}
