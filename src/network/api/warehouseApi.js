import serverInstance from './api-config';

// Get all warehouses
export async function getWarehouses() {
  try {
    const response = await serverInstance.get('/internal/warehouses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch warehouses:', error.response);
    return [];
  }
}

// Get warehouse by ID
export async function getWarehouseById(id) {
  try {
    const response = await serverInstance.get(`/internal/warehouses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch warehouse ${id}:`, error.response);
    return null;
  }
}

// Create new warehouse
export async function createWarehouse(warehouseData) {
  try {
    const response = await serverInstance.post('/internal/warehouses', warehouseData);
    return response.status;
  } catch (error) {
    console.error('Failed to create warehouse:', error.response);
    return error.response?.status || 500;
  }
}

// Update warehouse
export async function updateWarehouse(id, warehouseData) {
  try {
    const response = await serverInstance.put(`/internal/warehouses/${id}`, warehouseData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update warehouse ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete warehouse
export async function deleteWarehouse(id) {
  try {
    const response = await serverInstance.delete(`/internal/warehouses/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete warehouse ${id}:`, error.response);
    return error.response?.status || 500;
  }
}