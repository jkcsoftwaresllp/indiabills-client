import serverInstance from './api-config';

// Login API
export async function login(credentials) {
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

// Switch organization API
export async function switchOrganization(orgId) {
  try {
    const response = await serverInstance.post('/switch-org', { orgId });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Organization switch failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Organization switch failed' }
    };
  }
}

// Logout API
export async function logout(mode = 'ALL') {
  try {
    const response = await serverInstance.post('/logout', { mode });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Logout failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Logout failed' }
    };
  }
}

// Get user organizations
export async function getUserOrganizations() {
  try {
    const response = await serverInstance.get('/internal/org');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch user organizations:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}