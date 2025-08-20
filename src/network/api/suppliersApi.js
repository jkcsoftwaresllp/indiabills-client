import serverInstance from './api-config';

// Get all suppliers
export async function getSuppliers() {
  try {
    const response = await serverInstance.get('/internal/suppliers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error.response);
    return [];
  }
}

// Get supplier by ID
export async function getSupplierById(id) {
  try {
    const response = await serverInstance.get(`/internal/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch supplier ${id}:`, error.response);
    return null;
  }
}

// Create new supplier
export async function createSupplier(supplierData) {
  try {
    const response = await serverInstance.post('/internal/suppliers', supplierData);
    return response.status;
  } catch (error) {
    console.error('Failed to create supplier:', error.response);
    return error.response?.status || 500;
  }
}

// Update supplier
export async function updateSupplier(id, supplierData) {
  try {
    const response = await serverInstance.put(`/internal/suppliers/${id}`, supplierData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update supplier ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete supplier
export async function deleteSupplier(id) {
  try {
    const response = await serverInstance.delete(`/internal/suppliers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete supplier ${id}:`, error.response);
    return error.response?.status || 500;
  }
}