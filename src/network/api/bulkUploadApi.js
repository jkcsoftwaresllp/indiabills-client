import serverInstance from './api-config';

// Bulk create batches
export async function bulkCreateBatches(batchesData) {
  try {
    if (!Array.isArray(batchesData) || batchesData.length === 0) {
      throw new Error('Batches array is required');
    }

    const response = await serverInstance.post('/internal/bulk/batches', {
      batches: batchesData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create batches:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create batches',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}
