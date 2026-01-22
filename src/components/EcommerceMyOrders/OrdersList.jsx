import { EmptyOrdersState } from "./EmptyOrdersState";
import OrderCard from "./OrderCard";

const mockOrders = [
  {
    id: "ORD12345",
    date: "20 Jan 2026",
    status: "Delivered",
    items: [
      { id: 1, image: "https://m.media-amazon.com/images/I/71ivYMOzncL._SY695_.jpg" },
      { id: 2, image: "https://m.media-amazon.com/images/I/51bCB4HaCWL._AC_SR250,250_QL65_.jpg" },
      { id: 3, image: "https://m.media-amazon.com/images/I/71p7aQwRECL._AC_UL480_FMwebp_QL65_.jpg" },
    ],
  },
  {
    id: "ORD12346",
    date: "18 Jan 2026",
    status: "Shipped",
    items: [
      { id: 4, image: "https://m.media-amazon.com/images/I/61AsNTuJ6mL._AC_UY327_FMwebp_QL65_.jpg" },
      { id: 5, image: "https://m.media-amazon.com/images/I/71BObKFUMZL._AC_UY327_FMwebp_QL65_.jpg" },
    ],
  },
  {
    id: "ORD12347",
    date: "15 Jan 2026",
    status: "Placed",
    items: [
      { id: 6, image: "https://m.media-amazon.com/images/I/71IdAMTOjZL._AC_UY327_FMwebp_QL65_.jpg" },
    ],
  },
];

export function OrdersList() {
  if (!mockOrders.length) return <EmptyOrdersState />;

  return (
    <>
      {mockOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}
