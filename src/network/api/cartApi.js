import serverInstance from './api-config';

// Add product to cart
export async function addToCart(productData) {
  try {
    const response = await serverInstance.post('/internal/cart/add', productData);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to add product to cart:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to add product to cart',
    };
  }
}

// Remove product from cart
export async function removeFromCart(productData) {
  try {
    const response = await serverInstance.patch('/internal/cart/remove', productData);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to remove product from cart:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to remove product from cart',
    };
  }
}

// Update cart item quantity
export async function updateCartItem(productData) {
  try {
    const response = await serverInstance.patch('/internal/cart/update', productData);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update cart item:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to update cart item',
    };
  }
}

// Get cart items
export async function getCart() {
  try {
    const response = await serverInstance.get('/internal/cart');
    return {
      status: response.status,
      data: response.data?.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch cart:', error.response);
    return {
      status: error.response?.status || 500,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch cart',
    };
  }
}

// Checkout cart
export async function checkoutCart() {
  try {
    const response = await serverInstance.post('/internal/cart/checkout');
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to checkout cart:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to checkout cart',
    };
  }
}
