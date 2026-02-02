import { useEffect, useState } from 'react';
import CheckoutPage from '../../components/Checkout/CheckoutPage';
import styles from "./styles/EcommerceCustomerCheckout.module.css";
import { getCart, getProducts } from '../../network/api';

function EcommerceCustomerCheckout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCartData = async () => {
            try {
                // Fetch cart items
                const cartResult = await getCart();
                if (cartResult.status !== 200 || !cartResult.data) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }

                const cartItemsData = Array.isArray(cartResult.data) ? cartResult.data : [];
                
                if (cartItemsData.length === 0) {
                    setCartItems([]);
                    setLoading(false);
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
                const transformed = cartItemsData.map(item => {
                    const product = productMap[item.product_id];
                    const salePrice = parseFloat(product?.sale_price) || item.price_at_addition || 0;
                    const unitMRP = parseFloat(product?.unit_mrp) || salePrice;

                    return {
                        id: `cart-${item.id}`,
                        productId: item.product_id,
                        name: product?.name || "Unknown Product",
                        brand: product?.manufacturer || "Unknown Brand",
                        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800",
                        price: Math.round(salePrice),
                        mrp: Math.round(unitMRP),
                        rating: 4.5,
                        reviews: 0,
                        stock: 100,
                        qty: item.quantity,
                    };
                });

                setCartItems(transformed);
            } catch (error) {
                console.error('Error loading cart data:', error);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        loadCartData();
    }, []);

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <CheckoutPage cartItems={cartItems} />
        </div>
    );
}

export default EcommerceCustomerCheckout;
