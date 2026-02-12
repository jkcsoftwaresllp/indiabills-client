import React, { useState, useEffect } from 'react'
import styles from "./styles/EcommerceCustomerWishlist.module.css";
import DashboardTop from '../../components/EcommerceDashboard/DashboardTop';
import ProductGrid from '../../components/EcommerceDashboard/ProductGrid';
import { getWishlist, toggleWishlist, getBatches, getProducts } from '../../network/api';
import { useStore } from '../../store/store';
import { Typography } from '@mui/material';

function EcommerceCustomerWishlist() {
    const { successPopup, customerData, updateCustomerWishlist } = useStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("mobiles");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                // Fetch wishlist to get wishlisted product IDs
                const wishlistResult = await getWishlist();
                console.log('Wishlist fetch result:', wishlistResult);
                
                if (wishlistResult.status === 200 && wishlistResult.data && wishlistResult.data.length > 0) {
                    const wishlistProductIds = new Set(wishlistResult.data.map(item => item.id || item.product_id));
                    
                    // Fetch all products to get complete product details
                    const allProductsResult = await getProducts();
                    console.log('All products result:', allProductsResult);
                    
                    if (!allProductsResult || allProductsResult.length === 0) {
                        setProducts([]);
                        setLoading(false);
                        return;
                    }

                    // Filter products that are in wishlist
                    const wishlistedProducts = Array.isArray(allProductsResult) 
                        ? allProductsResult.filter(p => wishlistProductIds.has(p.id))
                        : [];

                    // Fetch batches for stock information
                    const batchesResult = await getBatches();
                    const batches = Array.isArray(batchesResult) ? batchesResult : [];
                    
                    // Build batch quantity map
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

                    // Transform products to match ProductCardV2 structure
                    const mappedProducts = wishlistedProducts.map(product => {
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

                    console.log('Mapped wishlist products:', mappedProducts);
                    setProducts(mappedProducts);
                    updateCustomerWishlist(wishlistResult.data);
                } else {
                    setProducts([]);
                    console.warn('No wishlisted items or unexpected response');
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [updateCustomerWishlist]);

    const handleToggleWishlist = async (product) => {
        const result = await toggleWishlist(product.id);
        if (result.status === 200) {
            setProducts(prev => prev.filter(p => p.id !== product.id));
            updateCustomerWishlist(customerData.wishlist.filter(item => item.id !== product.id));
            successPopup('Removed from wishlist');
        }
    };

    const handleAddToCart = async (product) => {
        // onAddToCart is handled by the ProductCardV2 component via useCart hook
    };

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div className="flex justify-center items-center h-64">
                    <Typography>Loading wishlist...</Typography>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper} >
            <DashboardTop
                user={null}
                stats={{ orders: 12, cart: 3, wishlist: products.length }}
                onSearch={(value) => console.log("Search:", value)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory} />
            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p>No wishlisted items</p>
                </div>
            ) : (
                <ProductGrid 
                    iswishlisted={true} 
                    products={products} 
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    showQuantity={false}
                />
            )}
        </div>
    )
}

export default EcommerceCustomerWishlist
