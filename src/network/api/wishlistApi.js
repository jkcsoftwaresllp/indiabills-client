import serverInstance from './api-config';

// Toggle product in wishlist
export async function toggleWishlist(productId) {
  try {
    const response = await serverInstance.post('/internal/wishlist/toggle', { product_id: productId });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to toggle wishlist:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to toggle wishlist',
    };
  }
}

// Get wishlist items
export async function getWishlist(search = '', page = 1, limit = 20) {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await serverInstance.get(`/internal/wishlist?${params.toString()}`);
    return {
      status: response.status,
      data: response.data?.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch wishlist:', error.response);
    return {
      status: error.response?.status || 500,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch wishlist',
    };
  }
}

// Clear wishlist
export async function clearWishlist() {
  try {
    const response = await serverInstance.post('/internal/wishlist/clear');
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to clear wishlist:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to clear wishlist',
    };
  }
}
