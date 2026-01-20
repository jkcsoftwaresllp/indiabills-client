import styles from "./styles/DashboardTop.module.css";
import {
    Search,
    User,
    Heart,
    ShoppingCart,
} from "lucide-react";
import indiaBillsLogo from "../../assets/IndiaBills_logo.png";

const categories = [
    { id: "minutes", label: "Minutes", icon: "🛵" },
    { id: "mobiles", label: "Mobiles", icon: "📱" },
    { id: "tv", label: "TVs & Appliances", icon: "📺" },
    { id: "electronics", label: "Electronics", icon: "💻" },
    { id: "fashion", label: "Fashion", icon: "👕" },
    { id: "home", label: "Home & Kitchen", icon: "🏠" },
    { id: "beauty", label: "Beauty & Toys", icon: "🧸" },
    { id: "furniture", label: "Furniture", icon: "🛋️" },
    { id: "flight", label: "Flight Bookings", icon: "✈️" },
    { id: "grocery", label: "Grocery", icon: "🛒" },
];

export default function DashboardTop({
    user,
    activeCategory,
    onCategoryChange,
    onSearch,
}) {
    return (
        <section className={styles.container}>
            {/* HEADER */}
            <div className={styles.header}>
                {/* LOGO */}
                <img
                    src={indiaBillsLogo}
                    alt="IndiaBills"
                    className={styles.logo}
                />

                {/* SEARCH */}
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search for products, brands & more"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>

                {/* ACTIONS */}
                <div className={styles.actions}>
                    {/* USER */}
                    <button className={styles.actionBtn}>
                        <User size={18} />
                        <span>{user ? user.name : "Login"}</span>
                    </button>

                    {/* SHOW ONLY IF USER LOGGED IN */}
                    {user && (
                        <>
                            {/* WISHLIST */}
                            <button className={styles.actionBtn}>
                                <Heart size={18} />
                                <span>{user.wishlistCount}</span>
                            </button>

                            {/* CART */}
                            <button className={styles.actionBtn}>
                                <ShoppingCart size={18} />
                                <span>{user.cartCount}</span>
                            </button>
                        </>
                    )}
                </div>

            </div>

            {/* CATEGORIES */}
            <div className={styles.categories}>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`${styles.category} ${activeCategory === cat.id ? styles.active : ""
                            }`}
                        onClick={() => onCategoryChange?.(cat.id)}
                    >
                        <div className={styles.iconBox}>{cat.icon}</div>
                        <p>{cat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
