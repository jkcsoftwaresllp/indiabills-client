import { Search } from "lucide-react";
import styles from "./styles/ProductExplorer.module.css";

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

export default function ProductExplorer({
  onSearch,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className={styles.wrapper}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className={styles.categories}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${styles.category} ${
              activeCategory === cat.id ? styles.active : ""
            }`}
            onClick={() => onCategoryChange?.(cat.id)}
          >
            <div className={styles.icon}>{cat.icon}</div>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
