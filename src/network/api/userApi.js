import serverInstance from './api-config';

// Get all users in organization
export async function getUsers() {
  try {
    const response = await serverInstance.get('/users');
    return {
      status: response.status,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Failed to fetch users:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const response = await serverInstance.get(`/users/id/${id}`);
    return {
      status: response.status,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Get user by username
export async function getUserByUsername(username) {
  try {
    const response = await serverInstance.get(`/users/username/${username}`);
    return {
      status: response.status,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error(`Failed to fetch user ${username}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Get users by role
export async function getUsersByRole(role) {
  try {
    const response = await serverInstance.get(`/users/role/${role}`);
    return {
      status: response.status,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error(`Failed to fetch users with role ${role}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

// Create new user
export async function createUser(userData) {
  try {
    const response = await serverInstance.post('/users/add', userData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create user:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'User creation failed' }
    };
  }
}

// Update user
export async function updateUser(id, userData) {
  try {
    const response = await serverInstance.patch(`/users/${id}`, userData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'User update failed' }
    };
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    const response = await serverInstance.delete(`/users/delete/${id}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'User deletion failed' }
    };
  }
}

// Upload user image
export async function uploadUserImage(imageFile, userId) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (userId) {
      formData.append('userId', userId);
    }
    
    const response = await serverInstance.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to upload user image:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Image upload failed' }
    };
  }
}