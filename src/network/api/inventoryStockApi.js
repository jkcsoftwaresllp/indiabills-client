import serverInstance from './api-config';

// Create or update inventory stock
export async function createInventoryStock(stockData) {
  try {
    const response = await serverInstance.post('/internal/inventory-stock', stockData);
    return response.status;
  } catch (error) {
    console.error('Failed to create inventory stock:', error.response);
    return error.response?.status || 500;
  }
}

// Get all inventory stock
export async function getInventoryStock(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.warehouse_id) params.append('warehouse_id', options.warehouse_id);
    if (options.product_id) params.append('product_id', options.product_id);
    if (options.batch_id) params.append('batch_id', options.batch_id);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const url = `/internal/inventory-stock${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await serverInstance.get(url);
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