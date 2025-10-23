import serverInstance from './api-config';

// Get all customers
export async function getCustomers(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.customer_type) params.append('customer_type', options.customer_type);
    if (options.is_active !== undefined) params.append('is_active', options.is_active);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/internal/customers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await serverInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers:', error.response);
    return [];
  }
}

// Get logged-in customer's own profile
export async function getCustomerProfile() {
  try {
    const response = await serverInstance.get('/internal/customers/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customer profile:', error.response);
    return null;
  }
}

// Get any customer's profile (admin/manager/operator only)
export async function getCustomerProfileById(id) {
  try {
    const response = await serverInstance.get(`/internal/customers/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer profile ${id}:`, error.response);
    return null;
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
    // Frontend validation
    const errors = [];
    
    // Required fields
    if (!customerData.first_name || customerData.first_name.length < 2) {
      errors.push('First name is required (min 2 characters)');
    }
    if (!customerData.last_name || customerData.last_name.length < 2) {
      errors.push('Last name is required (min 2 characters)');
    }
    if (!customerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.push('Valid email is required');
    }
    if (!customerData.phone || !/^\+?[0-9]{7,15}$/.test(customerData.phone.replace(/\s/g, ''))) {
      errors.push('Valid phone number is required (7-15 digits)');
    }
    if (!customerData.password || customerData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (customerData.password !== customerData.confirm_password) {
      errors.push('Passwords do not match');
    }
    
    // Business validation
    if (customerData.customer_type === 'business') {
      if (!customerData.business_name) {
        errors.push('Business name is required for business customers');
      }
      if (!customerData.gstin || !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(customerData.gstin)) {
        errors.push('Valid GSTIN is required for business customers');
      }
    }
    
    // Optional field validations
    if (customerData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan_number)) {
      errors.push('Invalid PAN format (e.g., ABCDE1234F)');
    }
    if (customerData.aadhar_number && !/^[0-9]{12}$/.test(customerData.aadhar_number)) {
      errors.push('Invalid Aadhaar number (must be 12 digits)');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const response = await serverInstance.post('/internal/customers', customerData);
    return response.status;
  } catch (error) {
    console.error('Failed to create customer:', error.response || error);
    throw error;
  }
}

// Update customer
export async function updateCustomer(id, customerData) {
  try {
    // Frontend validation for provided fields
    const errors = [];
    
    if (customerData.first_name && customerData.first_name.length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (customerData.last_name && customerData.last_name.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (customerData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.push('Invalid email format');
    }
    if (customerData.phone && !/^\+?[0-9]{7,15}$/.test(customerData.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number');
    }
    if (customerData.customer_type === 'business') {
      if (customerData.business_name !== undefined && !customerData.business_name) {
        errors.push('Business name is required for business customers');
      }
      if (customerData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(customerData.gstin)) {
        errors.push('Invalid GSTIN format');
      }
    }
    if (customerData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan_number)) {
      errors.push('Invalid PAN format');
    }
    if (customerData.aadhar_number && !/^[0-9]{12}$/.test(customerData.aadhar_number)) {
      errors.push('Invalid Aadhaar number');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const response = await serverInstance.patch(`/internal/customers/${id}`, customerData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update customer ${id}:`, error.response || error);
    throw error;
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