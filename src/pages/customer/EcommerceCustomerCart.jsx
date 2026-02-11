import React, { useEffect, useState, useRef, useCallback } from 'react'
import CartPage from '../../components/EcommerceCart/CartPage'
import styles from "./styles/EcommerceCustomerCart.module.css";
import { getCart, getProducts } from '../../network/api';

function EcommerceCustomerCart() {
    const [displayItems, setDisplayItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingRef = useRef(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const loadCartData = useCallback(async () => {
        // Prevent multiple simultaneous requests
        if (loadingRef.current) return;
        loadingRef.current = true;

        try {
            // Fetch cart items
            const cartResult = await getCart();
            if (cartResult.status !== 200 || !cartResult.data) {
                setDisplayItems([]);
                setLoading(false);
                loadingRef.current = false;
                return;
            }

            const cartItems = Array.isArray(cartResult.data) ? cartResult.data : [];
            
            if (cartItems.length === 0) {
                setDisplayItems([]);
                setLoading(false);
                loadingRef.current = false;
                return;
            }

            // Fetch all products to get complete product details
            const allProducts = await getProducts();
            const productMap = {};
            
            if (Array.isArray(allProducts)) {
                allProducts.forEach(product => {
                    productMap[product.id] = product;
                });
            }

            // Transform cart items to display format
             const transformed = cartItems.map(item => {
                 const product = productMap[item.product_id];
                 const salePrice = parseFloat(product?.sale_price) || item.price_at_addition || 0;
                 const unitMRP = parseFloat(product?.unit_mrp) || salePrice;
                 const discount = unitMRP > 0 ? Math.round(((unitMRP - salePrice) / unitMRP) * 100) : 0;

                 return {
                     id: `cart-${item.id}`,
                     productId: item.product_id,
                     name: product?.name || "Unknown Product",
                     brand: product?.manufacturer || "Unknown Brand",
                     image: product?.image_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800",
                     image_url: product?.image_url,
                     price: Math.round(salePrice),
                     mrp: Math.round(unitMRP),
                     discount: discount,
                     rating: 4.5,
                     reviews: 0,
                     stock: 100,
                     qty: item.quantity,
                 };
             });

            setDisplayItems(transformed);
            setLoading(false);
            loadingRef.current = false;
        } catch (error) {
            console.error('Error loading cart data:', error);
            setDisplayItems([]);
            setLoading(false);
            loadingRef.current = false;
        }
    }, []);

    useEffect(() => {
        loadCartData();
    }, [refreshTrigger, loadCartData]);

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p>Loading cart...</p>
                </div>
            </div>
        );
    }

    const handleItemUpdated = () => {
        // Trigger cart reload by incrementing refresh counter
        loadingRef.current = false;
        setLoading(true);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className={styles.wrapper}>
            <CartPage cartItems={displayItems} onItemUpdated={handleItemUpdated} />
        </div>
    )
}

export default EcommerceCustomerCart
