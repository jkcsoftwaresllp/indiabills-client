import serverInstance from './api-config';

// Get all warehouses
export async function getWarehouses(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options.isActive !== undefined) params.append('isActive', options.isActive);

    const response = await serverInstance.get(`/internal/warehouses?${params.toString()}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch warehouses:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

// Get warehouse by ID
export async function getWarehouseById(id) {
  try {
    const response = await serverInstance.get(`/internal/warehouses/${id}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to fetch warehouse ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Create new warehouse
export async function createWarehouse(warehouseData) {
  try {
    // Frontend validation to match backend rules
    const requiredFields = ['name', 'code', 'addressLine', 'city', 'state', 'pinCode'];
    const missingFields = requiredFields.filter(field => !warehouseData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate capacity
    if (warehouseData.capacity !== undefined && (!Number.isInteger(warehouseData.capacity) || warehouseData.capacity < 0)) {
      throw new Error('Capacity must be a non-negative integer');
    }

    // Validate PIN code (4-10 digits)
    if (!/^\d{4,10}$/.test(warehouseData.pinCode)) {
      throw new Error('PIN code must be 4-10 digits');
    }

    // Validate manager phone (if provided) - 7-15 digits with optional country code
    if (warehouseData.managerPhone) {
      const cleanPhone = warehouseData.managerPhone.replace(/[\s-]/g, '');
      if (!/^(\+)?[1-9]\d{6,14}$/.test(cleanPhone)) {
        throw new Error('Manager phone must be 7-15 digits with optional country code');
      }
    }

    // Validate warehouse code format
    if (!/^[a-zA-Z0-9-_]+$/.test(warehouseData.code)) {
      throw new Error('Warehouse code can only contain letters, numbers, hyphens, and underscores');
    }

    const response = await serverInstance.post('/internal/warehouses', warehouseData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create warehouse:', error.response || error);
    return {
      status: error.response?.status || 400,
      data: error.response?.data || { message: error.message || 'Warehouse creation failed' }
    };
  }
}

// Update warehouse
export async function updateWarehouse(id, warehouseData) {
  try {
    // Validate capacity if provided
    if (warehouseData.capacity !== undefined && (!Number.isInteger(warehouseData.capacity) || warehouseData.capacity < 0)) {
      throw new Error('Capacity must be a non-negative integer');
    }

    // Validate PIN code if provided
    if (warehouseData.pinCode && !/^\d{4,10}$/.test(warehouseData.pinCode)) {
      throw new Error('PIN code must be 4-10 digits');
    }

    // Validate manager phone if provided
    if (warehouseData.managerPhone) {
      const cleanPhone = warehouseData.managerPhone.replace(/[\s-]/g, '');
      if (!/^(\+)?[1-9]\d{6,14}$/.test(cleanPhone)) {
        throw new Error('Manager phone must be 7-15 digits with optional country code');
      }
    }

    // Validate warehouse code format if provided
    if (warehouseData.code && !/^[a-zA-Z0-9-_]+$/.test(warehouseData.code)) {
      throw new Error('Warehouse code can only contain letters, numbers, hyphens, and underscores');
    }

    const response = await serverInstance.patch(`/internal/warehouses/${id}`, warehouseData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to update warehouse ${id}:`, error.response || error);
    return {
      status: error.response?.status || 400,
      data: error.response?.data || { message: error.message || 'Warehouse update failed' }
    };
  }
}

// Delete warehouse (soft delete)
export async function deleteWarehouse(id) {
  try {
    const response = await serverInstance.delete(`/internal/warehouses/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete warehouse ${id}:`, error.response);
    return error.response?.status || 500;
  }
}