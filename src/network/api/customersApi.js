import serverInstance from './api-config';

// Get all customers
export async function getCustomers(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await serverInstance.get(`/internal/customers?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error.response);
    return [];
  }
}

// Get customer by ID
export async function getCustomerById(id) {
  try {
    const response = await serverInstance.get(`/internal/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer ${id}:`, error.response);
    return null;
  }
}

// Create new customer
export async function createCustomer(customerData) {
  try {
    const response = await serverInstance.post('/internal/customers', customerData);
    return response.status;
  } catch (error) {
    console.error('Failed to create customer:', error.response);
    return error.response?.status || 500;
  }
}

// Update customer
export async function updateCustomer(id, customerData) {
  try {
    const response = await serverInstance.put(`/internal/customers/${id}`, customerData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update customer ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete customer
export async function deleteCustomer(id) {
  try {
    const response = await serverInstance.delete(`/internal/customers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete customer ${id}:`, error.response);
    return error.response?.status || 500;
  }
}