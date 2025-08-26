import serverInstance from './api-config';

// Get all batches
export async function getBatches(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await serverInstance.get(`/internal/batches?${params.toString()}`);
    return response.data;
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
    const response = await serverInstance.post('/internal/batches', batchData);
    return response.status;
  } catch (error) {
    console.error('Failed to create batch:', error.response);
    return error.response?.status || 500;
  }
}

// Update batch
export async function updateBatch(id, batchData) {
  try {
    const response = await serverInstance.put(`/internal/batches/${id}`, batchData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update batch ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete batch
export async function deleteBatch(id) {
  try {
    const response = await serverInstance.delete(`/internal/batches/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete batch ${id}:`, error.response);
    return error.response?.status || 500;
  }
}