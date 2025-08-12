import serverInstance from './api-config';

// Get all inventory stock
export async function getInventoryStock() {
  try {
    const response = await serverInstance.get('/internal/inventory-stock');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch inventory stock:', error.response);
    return [];
  }
}

// Get inventory stock by ID
export async function getInventoryStockById(id) {
  try {
    const response = await serverInstance.get(`/internal/inventory-stock/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch inventory stock ${id}:`, error.response);
    return null;
  }
}