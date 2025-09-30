import serverInstance from './api-config';

// Get all products
export async function getProducts() {
  try {
    const response = await serverInstance.get('/internal/products');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch products:', error.response);
    return [];
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const response = await serverInstance.get(`/internal/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error.response);
    return null;
  }
}

// Create new product
export async function createProduct(productData) {
  try {
    const response = await serverInstance.post('/internal/products', productData);
    return response.status;
  } catch (error) {
    console.error('Failed to create product:', error.response);
    return error.response?.status || 500;
  }
}

// Update product
export async function updateProduct(id, productData) {
  try {
    const response = await serverInstance.patch(`/internal/products/${id}`, productData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const response = await serverInstance.delete(`/internal/products/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error.response);
    return error.response?.status || 500;
  }
}