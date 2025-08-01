import serverInstance from './api-config';

// Get all transport partners
export async function getTransportPartners() {
  try {
    const response = await serverInstance.get('/internal/transport-partners');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transport partners:', error.response);
    return [];
  }
}

// Get transport partner by ID
export async function getTransportPartnerById(id) {
  try {
    const response = await serverInstance.get(`/internal/transport-partners/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch transport partner ${id}:`, error.response);
    return null;
  }
}

// Create new transport partner
export async function createTransportPartner(transportData) {
  try {
    const response = await serverInstance.post('/internal/transport-partners', transportData);
    return response.status;
  } catch (error) {
    console.error('Failed to create transport partner:', error.response);
    return error.response?.status || 500;
  }
}

// Update transport partner
export async function updateTransportPartner(id, transportData) {
  try {
    const response = await serverInstance.put(`/internal/transport-partners/${id}`, transportData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update transport partner ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete transport partner
export async function deleteTransportPartner(id) {
  try {
    const response = await serverInstance.delete(`/internal/transport-partners/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete transport partner ${id}:`, error.response);
    return error.response?.status || 500;
  }
}