import serverInstance from './api-config';

// Get products by domain (public API)
export async function getProductsByDomain(domain, params = {}) {
  try {
    const response = await serverInstance.post(`/products/${domain}`, {}, { params });
    return {
      status: response.status,
      data: response.data?.data || null
    };
  } catch (error) {
    console.error(`Failed to fetch products for domain ${domain}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Register a new customer (public API)
export async function registerCustomerByDomain(domain, userData) {
  try {
    const response = await serverInstance.post(`/users/self/add/${domain}`, userData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to register customer for domain ${domain}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Registration failed' }
    };
  }
}

// Login as customer (public API - same as regular login)
export async function loginPublic(credentials) {
  try {
    const response = await serverInstance.post('/login', credentials);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Login failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Login failed' }
    };
  }
}
