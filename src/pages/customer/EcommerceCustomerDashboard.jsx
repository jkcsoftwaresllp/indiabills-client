// Main dashboard content ONLY (sidebar space reserved)
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/DashboardMain.module.css";
import { ShoppingCart, Heart, FileText, Package, User } from "lucide-react";
import DashboardHeader from "../../components/EcommerceDashboard/DashboardHeader";
import QuickActions from "../../components/EcommerceDashboard/QuickActions";
import avatar1 from "../../assets/images/avatar.jpg"
import ProductExplorer from "../../components/EcommerceDashboard/ProductExplorer";
import { useState, useEffect } from "react";
import ProductGrid from "../../components/EcommerceDashboard/ProductGrid";
import BannerSlider from "../../components/EcommerceDashboard/BannerSlider";
import DashboardTop from "../../components/EcommerceDashboard/DashboardTop";
import { getProducts, getBatches, getProductsByDomain, getBatchesByDomain, toggleWishlist } from "../../network/api";
import { useStore } from "../../store/store";

const quickActions = [
    {
        title: "My Orders",
        desc: "Track & manage orders",
        icon: Package,
        route: "/customer/orders",
    },
    {
        title: "Invoices",
        desc: "Billing & GST details",
        icon: FileText,
        route: "/customer/invoices",
    },
    {
        title: "Cart",
        desc: "Complete your purchase",
        icon: ShoppingCart,
        route: "/customer/cart",
    },
    {
        title: "Wishlist",
        desc: "Saved for later",
        icon: Heart,
        route: "/customer/wishlist",
    },
    {
        title: "Profile",
        desc: "Account settings",
        icon: User,
        route: "/customer/profile",
    },
];

const bannerImages = [
    "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/734002bea5bac800.jpg?q=60",
    "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60",
    "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1f9c9ad24c2bc37b.jpg?q=60",
    "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/c1786792b3252eb0.jpg?q=60",
    "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/66faf3950cda0b7a.png?q=60",
];







export default function EcommerceCustomerDashboard() {
    const navigate = useNavigate();
    const { domain } = useParams();
    const { customerData, updateCustomerWishlist, successPopup } = useStore();

    const [activeCategory, setActiveCategory] = useState("mobiles");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Handle wishlist toggle
    const handleToggleWishlist = async (product) => {
        const result = await toggleWishlist(product.id);
        if (result.status === 200) {
            const isCurrentlyWishlisted = customerData.wishlist.some(item => item.id === product.id);
            const updatedWishlist = isCurrentlyWishlisted
                ? customerData.wishlist.filter(item => item.id !== product.id)
                : [...customerData.wishlist, product];
            updateCustomerWishlist(updatedWishlist);
            successPopup(isCurrentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        }
    };

    // Handle add to cart
    const handleAddToCart = async (product) => {
        // onAddToCart is handled by the ProductCardV2 component via useCart hook
        // This function is here for potential future use or logging
    };

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let apiProducts = [];
                let batches = [];

                // Check if user is authenticated
                const session = localStorage.getItem("session");

                if (session) {
                    // User is authenticated - use authenticated endpoints
                    apiProducts = await getProducts();
                    batches = await getBatches();
                    console.log("Using authenticated endpoints");
                } else if (domain) {
                    // User is not authenticated but domain is available in URL - use public endpoints
                    console.log("Using public endpoints for domain:", domain);
                    const productsResult = await getProductsByDomain(domain);
                    console.log("Products result:", productsResult);
                    // productsResult.data is already the array (extracted from response.data?.data in publicApi)
                    apiProducts = Array.isArray(productsResult.data) ? productsResult.data : [];
                    const batchesResult = await getBatchesByDomain(domain);
                    console.log("Batches result:", batchesResult);
                    // batchesResult.data is already the array (extracted from response.data?.data in publicApi)
                    batches = Array.isArray(batchesResult.data) ? batchesResult.data : [];
                } else {
                    // No session and no domain available
                    console.log("No session and no domain");
                    setProducts([]);
                    setIsLoading(false);
                    return;
                }

                console.log("API Products:", apiProducts);

                if (!apiProducts || apiProducts.length === 0) {
                    setProducts([]);
                    setIsLoading(false);
                    return;
                }

                // Fetch batch data for all products
                const batchQuantityMap = {};

                if (batches && Array.isArray(batches)) {
                    batches.forEach(batch => {
                        if (!batchQuantityMap[batch.product_id]) {
                            batchQuantityMap[batch.product_id] = 0;
                        }
                        const remainingQty = parseFloat(batch.remaining_quantity) || 0;
                        batchQuantityMap[batch.product_id] += remainingQty;
                    });
                }

                const mappedProducts = apiProducts.map(product => {
                     // API returns snake_case, not camelCase
                     const salePrice = parseFloat(product.sale_price) || 0;
                     const unitMRP = parseFloat(product.unit_mrp) || salePrice;
                     const discount = unitMRP > 0 ? Math.round(((unitMRP - salePrice) / unitMRP) * 100) : 0;

                     return {
                         id: product.id,
                         name: product.name || "Unnamed Product",
                         brand: product.manufacturer || "Unknown Brand",
                         image: product.image_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800",
                         image_url: product.image_url,
                         price: Math.round(salePrice),
                         mrp: Math.round(unitMRP),
                         discount: discount,
                         rating: 4.5,
                         reviews: 0,
                         stock: Math.floor(batchQuantityMap[product.id] || 0),
                         expiry: null,
                         dimensions: product.dimensions || "N/A",
                         weight: product.weight || 0,
                     };
                 });

                console.log("Mapped Products:", mappedProducts);
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [domain]);

    return (
        <div className={styles.dashboardWrapper}>
            <DashboardTop
                user={null}
                stats={{ orders: 12, cart: 3, wishlist: customerData.wishlist?.length || 0 }}
                onSearch={(value) => console.log("Search:", value)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory} />

            {/* Quick Actions */}
            <QuickActions
                actions={quickActions}
                onNavigate={navigate}
            />

            {/* Banner */}
            <BannerSlider
                images={bannerImages}
                interval={4500}
                onClick={() => navigate("/products")}
            />

            {/* Product Preview Placeholder */}
            <div className={styles.productsSection}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p>Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <ProductGrid 
                        products={products}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        showQuantity={false}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p>No products available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

