import serverInstance from './api-config';

// Create new inventory movement
export async function createInventoryMovement(movementData) {
  try {
    const response = await serverInstance.post('/internal/inventory-movements', movementData);
    return response.status;
  } catch (error) {
    console.error('Failed to create inventory movement:', error.response);
    return error.response?.status || 500;
  }
}

// Get all inventory movements
export async function getInventoryMovements(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.warehouse_id) params.append('warehouse_id', options.warehouse_id);
    if (options.product_id) params.append('product_id', options.product_id);
    if (options.movement_type) params.append('movement_type', options.movement_type);
    if (options.from_date) params.append('from_date', options.from_date);
    if (options.to_date) params.append('to_date', options.to_date);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const url = `/internal/inventory-movements${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await serverInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch inventory movements:', error.response);
    return [];
  }
}

// Get inventory movement by ID
export async function getInventoryMovementById(id) {
  try {
    const response = await serverInstance.get(`/internal/inventory-movements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch inventory movement ${id}:`, error.response);
    return null;
  }
}