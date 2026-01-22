import styles from "./styles/MyOrders.module.css";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { OrdersList } from "./OrdersList";
import DashboardTop from "../EcommerceDashboard/DashboardTop";
import { useState } from "react";
import avatar1 from "../../assets/images/avatar.jpg"

export default function MyOrders() {
    const [activeCategory, setActiveCategory] = useState("mobiles");
    return (
        <>
            <DashboardTop
                user={{ name: "Joy", avatar: avatar1, wishlistCount: 3, cartCount: 5, }}
                stats={{ orders: 12, cart: 3, wishlist: 5 }}
                onSearch={(value) => console.log("Search:", value)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categoriesVisible={false} />
            <div className={styles.container}>
                <OrdersHeader />
                <OrdersFilterBar />
                <OrdersList />
            </div>
        </>
    );
}
