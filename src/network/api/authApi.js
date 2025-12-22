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
    console.error('Login failed:', error);
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
    const response = await serverInstance.get('/organization');
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

// Check session validity
export async function checkSession() {
  try {
    const response = await serverInstance.get('/check-session');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Session check failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: { valid: false }
    };
  }
}

// Forgot password - Request OTP
export async function forgotPassword(email) {
  try {
    const response = await serverInstance.post('/forgot-password', { email });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Forgot password failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to send OTP' }
    };
  }
}

// Verify reset OTP and/or update password
// If password not provided: verifies OTP only
// If password provided: verifies OTP and resets password
export async function verifyResetOtp(email, otp, password = null, re_password = null) {
  try {
    const response = await serverInstance.post('/verify-reset-otp', {
      email,
      otp,
      ...(password && re_password && { password, re_password })
    });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Verify reset OTP failed:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to process request' }
    };
  }
}