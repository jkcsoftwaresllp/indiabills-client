import { useEffect } from 'react';
import { useStore } from '../store/store';
import { addToCart, removeFromCart, updateCartItem, getCart, checkoutCart } from '../network/api';

export const useCart = () => {
  const {
    cart,
    setCartLoading,
    setCartError,
    setCartItems,
    addCartItem,
    updateCartItem: updateStoreCartItem,
    removeCartItem,
    clearCart,
    successPopup,
    errorPopup,
  } = useStore();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setCartLoading(true);
    const result = await getCart();
    if (result.status === 200) {
      setCartItems(result.data);
    } else {
      setCartError(result.error);
      errorPopup(result.error);
    }
  };

  const addItemToCart = async (productId, quantity = 1) => {
    setCartLoading(true);
    const result = await addToCart({ product_id: productId, quantity });
    if (result.status === 201 || result.status === 200) {
      // Refresh cart to get updated data
      await loadCart();
      successPopup('Product added to cart');
    } else {
      setCartError(result.error);
      errorPopup(result.error);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    setCartLoading(true);
    const result = await updateCartItem({ product_id: productId, quantity });
    if (result.status === 200) {
      // Refresh cart to get updated data
      await loadCart();
      successPopup('Cart updated');
    } else {
      setCartError(result.error);
      errorPopup(result.error);
    }
  };

  const removeItemFromCart = async (productId) => {
    setCartLoading(true);
    const result = await removeFromCart({ product_id: productId });
    if (result.status === 200) {
      // Refresh cart to get updated data
      await loadCart();
      successPopup('Product removed from cart');
    } else {
      setCartError(result.error);
      errorPopup(result.error);
    }
  };

  const checkout = async () => {
    setCartLoading(true);
    const result = await checkoutCart();
    if (result.status === 201 || result.status === 200) {
      clearCart();
      successPopup('Order placed successfully!');
      return { success: true, data: result.data };
    } else {
      setCartError(result.error);
      errorPopup(result.error);
      return { success: false, error: result.error };
    }
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.price_at_addition * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems: cart.items,
    loading: cart.loading,
    error: cart.error,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    checkout,
    loadCart,
    getCartTotal,
    getCartItemCount,
  };
};
