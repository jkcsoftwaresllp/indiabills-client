import serverInstance from './api-config';

// Get all inventory movements
export async function getInventoryMovements() {
  try {
    const response = await serverInstance.get('/internal/inventory-movements');
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