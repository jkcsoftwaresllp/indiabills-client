import styles from "./styles/DashboardTop.module.css";
import {
    Search,
    User,
    Heart,
    ShoppingCart,
    LogOut,
} from "lucide-react";
import indiaBillsLogo from "../../assets/IndiaBills_logo.png";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../store/context";

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
    categoriesVisible = true,
}) {
    const navigate = useNavigate();
    const { user: authUser, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAuthClick = () => {
        // Get domain from URL or use default
        const domain = window.location.hostname.split(".")[0] || "indiabills";
        navigate(`/register/${domain}`);
    };

    const handleUserMenuClick = () => {
        if (authUser) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            handleAuthClick();
        }
    };

    const handleMenuOption = (action) => {
        setIsDropdownOpen(false);
        switch (action) {
            case 'orders':
                navigate('/customer/orders');
                break;
            case 'invoices':
                navigate('/customer/invoices');
                break;
            case 'cart':
                navigate('/customer/cart');
                break;
            case 'wishlist':
                navigate('/customer/wishlist');
                break;
            case 'profile':
                navigate('/customer/profile');
                break;
            case 'logout':
                logout();
                navigate('/login');
                break;
            default:
                break;
        }
    };

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
                    {/* USER / LOGIN BUTTON WITH DROPDOWN */}
                    <div className={styles.userMenuContainer} ref={dropdownRef}>
                        <button className={styles.actionBtn} onClick={handleUserMenuClick}>
                            <User size={18} />
                            <span>{authUser?.name?.split(' ')[0] || "Login/Signup"}</span>
                        </button>

                        {/* DROPDOWN MENU */}
                        {isDropdownOpen && authUser && (
                            <div className={styles.dropdownMenu}>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => handleMenuOption('orders')}
                                >
                                    My Orders
                                </button>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => handleMenuOption('invoices')}
                                >
                                    Invoices
                                </button>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => handleMenuOption('cart')}
                                >
                                    Cart
                                </button>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => handleMenuOption('wishlist')}
                                >
                                    Wishlist
                                </button>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => handleMenuOption('profile')}
                                >
                                    Profile
                                </button>
                                <div className={styles.dropdownDivider}></div>
                                <button
                                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                                    onClick={() => handleMenuOption('logout')}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* WISHLIST - Icon only */}
                    <button className={styles.actionBtn} onClick={handleAuthClick}>
                        <Heart size={18} />
                        {authUser?.wishlistCount && (
                            <span>{authUser.wishlistCount}</span>
                        )}
                    </button>

                    {/* CART - Icon only */}
                    <button className={styles.actionBtn} onClick={handleAuthClick}>
                        <ShoppingCart size={18} />
                        {authUser?.cartCount && (
                            <span>{authUser.cartCount}</span>
                        )}
                    </button>
                </div>

            </div>

            {/* CATEGORIES */}
            {categoriesVisible &&
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
            }
        </section>
    );
}
