import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemCard from "./InvoiceItemCard";
import InvoicePriceDetails from "./InvoicePriceDetails";
import styles from "./styles/InvoicePage.module.css";

export default function InvoicePage() {
  const items = [
    {
      id: 1,
      brand: "Apple",
      name: "iPhone 15 Pro Max (256 GB)",
      price: 134999,
      qty: 1,
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3nC2qKUux8jHgT56FG6XmqIAHdyBUoqUr14lWt4FYNbOAgtqNgXwSXeZoRyrxMV6Nusxcn1G-z9oErJjcPPeoatnJe3UpGvYuHbL74P0TXPnnWSzFPSRGQ9HW08YTYm8r5LcQIh4&usqp=CAc",
    },
    {
      id: 2,
      brand: "Samsung",
      name: "Galaxy S24 Ultra (512 GB)",
      price: 129999,
      qty: 2,
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTZB7hHkMFCZ5coN1nuoJmU-580Gn6lhxt_EBSre_pGyxz3oan_K10qXJ_mch-rF3pW3fUA8l-Qmo22n7deN6pLISmt_2OsSZVP5SIVCBWsjRrbmrVa-JHs&usqp=CAc",
    },
  ];

  return (
    <div className={styles.page}>
      <InvoiceHeader />

      <div className={styles.body}>
        <div className={styles.items}>
          {items.map((item) => (
            <InvoiceItemCard key={item.id} item={item} />
          ))}
        </div>

        <InvoicePriceDetails items={items} />
      </div>
    </div>
  );
}
