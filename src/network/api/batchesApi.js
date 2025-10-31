import serverInstance from './api-config';

// Get all batches
export async function getBatches(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options.warehouseId) params.append('warehouseId', options.warehouseId);
    if (options.productId) params.append('productId', options.productId);

    const response = await serverInstance.get(`/internal/batches?${params.toString()}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch batches:', error.response);
    return [];
  }
}

// Get batch by ID
export async function getBatchById(id) {
  try {
    const response = await serverInstance.get(`/internal/batches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch batch ${id}:`, error.response);
    return null;
  }
}

// Create new batch
export async function createBatch(batchData) {
  try {
    // Frontend validation to match backend rules
    const requiredFields = ['productId', 'batchCode', 'purchaseDate', 'quantity', 'remainingQuantity', 'unitCost', 'warehouseId'];
    const missingFields = requiredFields.filter(field => !batchData[field] && batchData[field] !== 0);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Numeric validation
    if (batchData.quantity < 0 || batchData.remainingQuantity < 0 || batchData.unitCost < 0) {
      throw new Error('Quantity, remaining quantity, and unit cost must be non-negative');
    }

    if (batchData.remainingQuantity > batchData.quantity) {
      throw new Error('Remaining quantity cannot exceed total quantity');
    }

    // Validate dates
    const purchaseDate = new Date(batchData.purchaseDate);
    if (isNaN(purchaseDate.getTime())) {
      throw new Error('Invalid purchase date');
    }

    if (batchData.expiryDate) {
      const expiryDate = new Date(batchData.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        throw new Error('Invalid expiry date');
      }
      if (expiryDate <= purchaseDate) {
        throw new Error('Expiry date must be after purchase date');
      }
    }

    // Validate batch code format
    if (!/^[a-zA-Z0-9-_]+$/.test(batchData.batchCode)) {
      throw new Error('Batch code can only contain letters, numbers, hyphens, and underscores');
    }

    const response = await serverInstance.post('/internal/batches', batchData);
    return response.status;
  } catch (error) {
    console.error('Failed to create batch:', error.response || error);
    return error.response?.status || 400;
  }
}

// Update batch
export async function updateBatch(id, batchData) {
  try {
    // Validate numeric values if provided
    if (batchData.quantity !== undefined && batchData.quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }
    if (batchData.remainingQuantity !== undefined && batchData.remainingQuantity < 0) {
      throw new Error('Remaining quantity must be non-negative');
    }
    if (batchData.unitCost !== undefined && batchData.unitCost < 0) {
      throw new Error('Unit cost must be non-negative');
    }
    if (batchData.quantity !== undefined && batchData.remainingQuantity !== undefined && 
        batchData.remainingQuantity > batchData.quantity) {
      throw new Error('Remaining quantity cannot exceed total quantity');
    }

    // Validate dates if provided
    if (batchData.purchaseDate) {
      const purchaseDate = new Date(batchData.purchaseDate);
      if (isNaN(purchaseDate.getTime())) {
        throw new Error('Invalid purchase date');
      }
    }

    if (batchData.expiryDate) {
      const expiryDate = new Date(batchData.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        throw new Error('Invalid expiry date');
      }
      if (batchData.purchaseDate && expiryDate <= new Date(batchData.purchaseDate)) {
        throw new Error('Expiry date must be after purchase date');
      }
    }

    // Validate batch code format if provided
    if (batchData.batchCode && !/^[a-zA-Z0-9-_]+$/.test(batchData.batchCode)) {
      throw new Error('Batch code can only contain letters, numbers, hyphens, and underscores');
    }

    const response = await serverInstance.patch(`/internal/batches/${id}`, batchData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update batch ${id}:`, error.response || error);
    return error.response?.status || 400;
  }
}

// Delete batch (soft delete)
export async function deleteBatch(id) {
  try {
    const response = await serverInstance.delete(`/internal/batches/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete batch ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Get batches by warehouse ID
export async function getBatchesByWarehouse(warehouseId) {
  try {
    const response = await serverInstance.get(`/internal/batches/warehouse/${warehouseId}`);
    // API returns { success, count, data: [...] }
    return response.data?.data || [];
  } catch (error) {
    console.error(`Failed to fetch batches for warehouse ${warehouseId}:`, error.response);
    return [];
  }
}