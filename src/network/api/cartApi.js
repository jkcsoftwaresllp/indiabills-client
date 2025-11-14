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
    
    // Handle different response formats
    let cartData = [];
    if (Array.isArray(response.data)) {
      cartData = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      cartData = response.data.data;
    } else if (response.data?.items && Array.isArray(response.data.items)) {
      cartData = response.data.items;
    }
    
    // Map cart items with all necessary fields
    const cartItems = cartData.map(item => ({
      id: item.cart_id,
      product_id: item.product_id, // Backend uses this field
      productId: item.product_id,
      quantity: Number(item.quantity) || 1,
      priceAtAddition: Number(item.price_at_addition) || 0,
      price_at_addition: Number(item.price_at_addition) || 0, // Keep original too
      status: item.status,
      is_active: item.is_active,
      createdAt: item.created_at,
      created_at: item.created_at,
      updatedAt: item.updated_at,
      updated_at: item.updated_at,
      productName: item.product_name,
      name: item.product_name, // Also add as 'name' for component compatibility
      unitOfMeasure: item.unit_of_measure,
      unit_of_measure: item.unit_of_measure,
      salePrice: Number(item.sale_price) || 0,
      sale_price: Number(item.sale_price) || 0,
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
export async function checkoutCart(checkoutData = {}) {
  try {
    const response = await serverInstance.post('/internal/cart/checkout', {
      billing_address_id: checkoutData.billing_address_id,
      shipping_address_id: checkoutData.shipping_address_id,
      notes: checkoutData.notes || '',
    });
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
