import styles from "./styles/DashboardTop.module.css";
import { Search, User, Heart, ShoppingCart, LogOut, } from "lucide-react";
import indiaBillsLogo from "../../assets/IndiaBills_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../store/context";
import { useStore } from "../../store/store";
import minutesImg from "../../assets/images/minutes.webp";
import mobilesImg from "../../assets/images/mobiles.webp";
import tvImg from "../../assets/images/tv.webp";
import electronicsImg from "../../assets/images/electronics.png";
import fashionImg from "../../assets/images/fashion.webp";
import homeImg from "../../assets/images/home.webp";
import beautyImg from "../../assets/images/beauty.webp";
import furnitureImg from "../../assets/images/furniture.jpg";
import flightImg from "../../assets/images/flight.webp";
import groceryImg from "../../assets/images/grocery.webp";


const categories = [
  { id: "minutes", label: "Minutes", icon: minutesImg },
  { id: "mobiles", label: "Mobiles", icon: mobilesImg },
  { id: "tv", label: "TVs & Appliances", icon: tvImg },
  { id: "electronics", label: "Electronics", icon: electronicsImg },
  { id: "fashion", label: "Fashion", icon: fashionImg },
  { id: "home", label: "Home & Kitchen", icon: homeImg },
  { id: "beauty", label: "Beauty & Toys", icon: beautyImg },
  { id: "furniture", label: "Furniture", icon: furnitureImg },
  { id: "flight", label: "Flight Bookings", icon: flightImg },
  { id: "grocery", label: "Grocery", icon: groceryImg },
];


export default function DashboardTop({
    user,
    activeCategory,
    onCategoryChange,
    onSearch,
    categoriesVisible = true,
}) {
    const navigate = useNavigate();
    const { domain: urlDomain } = useParams();
    const { user: authUser, logout } = useContext(AuthContext);
    const { customerData, cart } = useStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Extract domain from URL
    const getDomain = () => {
        // First, try to get from URL params
        if (urlDomain) {
            return urlDomain;
        }

        // If not in params, try to extract from pathname
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(p => p);
        
        // Check if first part looks like a domain (contains a dot)
        if (pathParts.length > 0 && pathParts[0].includes('.')) {
            return pathParts[0];
        }

        // Default to indiabills
        return "indiabills";
    };

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
        const domain = getDomain();
        navigate(`/register/${domain}`);
    };

    const handleWishlistClick = () => {
        if (authUser) {
            navigate('/customer/wishlist');
        } else {
            const domain = getDomain();
            navigate(`/register/${domain}`);
        }
    };

    const handleCartClick = () => {
        if (authUser) {
            navigate('/customer/cart');
        } else {
            const domain = getDomain();
            navigate(`/register/${domain}`);
        }
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
                    <button className={styles.actionBtn} onClick={handleWishlistClick}>
                        <Heart size={18} />
                        {customerData?.wishlist && customerData.wishlist.length > 0 && (
                            <span>{customerData.wishlist.length}</span>
                        )}
                    </button>

                    {/* CART - Icon only */}
                    <button className={styles.actionBtn} onClick={handleCartClick}>
                        <ShoppingCart size={18} />
                        {cart?.items && cart.items.length > 0 && (
                            <span>{cart.items.length}</span>
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
                            {/* <div className={styles.iconBox}>{cat.icon}</div> */}
                            <img className={styles.iconBox} src={cat.icon} alt={cat.label} />
                            <p>{cat.label}</p>
                        </div>
                    ))}
                </div>
            }
        </section>
    );
}
