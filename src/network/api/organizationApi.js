import serverInstance from './api-config';

// Owner signup
export async function ownerSignup(signupData) {
  try {
    const response = await serverInstance.post('/external/org/owner/signup', signupData);
    return response.status;
  } catch (error) {
    console.error('Failed to signup owner:', error.response);
    return error.response?.status || 500;
  }
}

// Create organization
export async function createOrganization(orgData) {
  try {
    const response = await serverInstance.post('/internal/org/create', orgData);
    return response.status;
  } catch (error) {
    console.error('Failed to create organization:', error.response);
    return error.response?.status || 500;
  }
}

// Get organization details
export async function getOrganization() {
  try {
    const response = await serverInstance.get('/internal/org');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organization:', error.response);
    return null;
  }
}

// Update organization
export async function updateOrganization(orgData) {
  try {
    const response = await serverInstance.put('/internal/org', orgData);
    return response.status;
  } catch (error) {
    console.error('Failed to update organization:', error.response);
    return error.response?.status || 500;
  }
}