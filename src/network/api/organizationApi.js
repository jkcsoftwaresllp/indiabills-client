import serverInstance from './api-config';

// Owner signup
export async function ownerSignup(signupData) {
  try {
    const response = await serverInstance.post('/external/org/owner/signup', signupData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to signup owner:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Signup failed' }
    };
  }
}

// Create organization (for users with no org)
export async function createFirstTimeOrganization(orgData, token) {
  try {
    const response = await serverInstance.post('/internal/org/create-first-time', orgData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create first-time organization:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Organization creation failed' }
    };
  }
}

// Create organization (for existing users)
export async function createOrganization(orgData) {
  try {
    const response = await serverInstance.post('/internal/org/create', orgData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create organization:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Organization creation failed' }
    };
  }
}

// Get organization details by ID
export async function getOrganizationById(id) {
  try {
    const response = await serverInstance.get(`/internal/org/${id}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch organization:', error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Get current organization details
export async function getOrganization() {
  try {
    const response = await serverInstance.get('/internal/org/current');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch current organization:', error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Update organization
export async function updateOrganization(orgData) {
  try {
    const response = await serverInstance.patch(`/organization/edit/${orgData.id}`, orgData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to update organization:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Update failed' }
    };
  }
}