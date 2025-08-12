import serverInstance from './api-config';

// Get all reconciliations
export async function getReconciliations() {
  try {
    const response = await serverInstance.get('/internal/inventory/reconciliations');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reconciliations:', error.response);
    return [];
  }
}

// Get reconciliation by ID
export async function getReconciliationById(id) {
  try {
    const response = await serverInstance.get(`/internal/inventory/reconciliations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch reconciliation ${id}:`, error.response);
    return null;
  }
}

// Create new reconciliation
export async function createReconciliation(reconciliationData) {
  try {
    const response = await serverInstance.post('/internal/inventory/reconciliations', reconciliationData);
    return response.status;
  } catch (error) {
    console.error('Failed to create reconciliation:', error.response);
    return error.response?.status || 500;
  }
}

// Get reconciliation details
export async function getReconciliationDetails(id) {
  try {
    const response = await serverInstance.get(`/internal/inventory/reconciliations/${id}/details`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch reconciliation details ${id}:`, error.response);
    return [];
  }
}

// Add reconciliation details
export async function addReconciliationDetails(id, detailsData) {
  try {
    const response = await serverInstance.post(`/internal/inventory/reconciliations/${id}/details`, detailsData);
    return response.status;
  } catch (error) {
    console.error(`Failed to add reconciliation details ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Update reconciliation status
export async function updateReconciliationStatus(id, statusData) {
  try {
    const response = await serverInstance.put(`/internal/inventory/reconciliations/${id}/status`, statusData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update reconciliation status ${id}:`, error.response);
    return error.response?.status || 500;
  }
}