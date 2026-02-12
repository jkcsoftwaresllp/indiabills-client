import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsedCategories } from "../../network/api/Category";
import styles from "./styles/ProductExplorer.module.css";

// Emoji mapping for categories
const categoryEmojiMap = {
  "minutes": "🛵",
  "mobiles": "📱",
  "tv": "📺",
  "electronics": "💻",
  "fashion": "👕",
  "home": "🏠",
  "beauty": "🧸",
  "furniture": "🛋️",
  "flight": "✈️",
  "grocery": "🛒",
};

export default function ProductExplorer({
  onSearch,
  activeCategory,
  onCategoryChange,
}) {
  const [categories, setCategories] = useState([]);

  // Fetch categories that are used in products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const usedCategories = await getUsedCategories();
        // Map backend categories to include emojis
        const categoriesWithEmojis = usedCategories.map(cat => {
          // Try to match emoji by name (normalized)
          const nameLower = cat.name?.toLowerCase().replace(/\s+/g, '_') || '';
          const icon = categoryEmojiMap[cat.name?.toLowerCase()] || 
                       categoryEmojiMap[nameLower] || 
                       "📦";
          return {
            id: cat.id,
            label: cat.name,
            icon: icon
          };
        });
        setCategories(categoriesWithEmojis);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
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
            <span>{cat.label || cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
