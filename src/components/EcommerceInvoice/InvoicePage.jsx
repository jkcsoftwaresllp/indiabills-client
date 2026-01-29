import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemCard from "./InvoiceItemCard";
import InvoicePriceDetails from "./InvoicePriceDetails";
import styles from "./styles/InvoicePage.module.css";

export default function InvoicePage() {
  const invoice = {
    invoiceId: "INV-2026-0042",
    date: "25 Jan 2026",
    status: "PAID",
  };

  const items = [
    {
      id: 1,
      brand: "Apple",
      name: "iPhone 15 Pro Max",
      variant: "256 GB • Natural Titanium",
      sku: "APL-IP15PM-256",
      category: "Smartphones",
      price: 134999,
      qty: 1,
      discount: 5000,
      returnEligible: true,
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3nC2qKUux8jHgT56FG6XmqIAHdyBUoqUr14lWt4FYNbOAgtqNgXwSXeZoRyrxMV6Nusxcn1G-z9oErJjcPPeoatnJe3UpGvYuHbL74P0TXPnnWSzFPSRGQ9HW08YTYm8r5LcQIh4&usqp=CAc",
    },
    {
      id: 2,
      brand: "Samsung",
      name: "Galaxy S24 Ultra",
      variant: "512 GB • Titanium Gray",
      sku: "SMS-S24U-512",
      category: "Smartphones",
      price: 129999,
      qty: 1,
      discount: 3000,
      returnEligible: true,
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTZB7hHkMFCZ5coN1nuoJmU-580Gn6lhxt_EBSre_pGyxz3oan_K10qXJ_mch-rF3pW3fUA8l-Qmo22n7deN6pLISmt_2OsSZVP5SIVCBWsjRrbmrVa-JHs&usqp=CAc",
    },
    {
      id: 3,
      brand: "Apple",
      name: "AirPods Pro (2nd Generation)",
      variant: "USB-C Charging Case",
      sku: "APL-APP2-USBC",
      category: "Accessories",
      price: 24999,
      qty: 1,
      discount: 2000,
      returnEligible: false,
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQoQYnNP5v1N4GW4ZdvvkOFfMLGElwC3yrlkxnCiKUKRyo_tGr7QK5YOMuLp8CvAaSGyGVUPWJ0GcnQJLK_5wxTPHP3qYTu32dvSY3FU-BDtVXWKNCnjtuj_Dhfn_wyQwvtq2EjGg&usqp=CAc",
    },
  ];

  // 🔥 Calculations (REAL WORLD LOGIC)
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  const totalDiscount = items.reduce(
    (s, i) => s + (i.discount || 0),
    0
  );

  const tax = Math.round((subtotal - totalDiscount) * 0.18);
  const totalAmount = subtotal - totalDiscount + tax;

  return (
    <div className={styles.page}>
      <InvoiceHeader
        invoiceId={invoice.invoiceId}
        date={invoice.date}
        status={invoice.status}
        totalAmount={totalAmount}
      />

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
