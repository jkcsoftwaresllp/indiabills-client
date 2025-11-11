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
    console.log('Fetching cart items...');
    const response = await serverInstance.get('/internal/cart/');
    
    console.log('Cart API Response:', response.data);
    console.log('Cart API Status:', response.status);
    
    // Backend returns data array directly
    const cartItems = (response.data?.data || []).map(item => ({
      id: item.cart_id,
      productId: item.product_id,
      quantity: item.quantity,
      priceAtAddition: item.price_at_addition,
      price_at_addition: item.price_at_addition, // Keep original too
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      productName: item.product_name,
      name: item.product_name, // Also add as 'name' for component compatibility
      unitOfMeasure: item.unit_of_measure,
      salePrice: item.sale_price,
      brand: item.brand,
      barcode: item.barcode
    }));
    
    console.log('Mapped cart items:', cartItems);
    
    return {
      status: response.status,
      data: cartItems,
    };
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
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
