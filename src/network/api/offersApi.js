import serverInstance from './api-config';

// Get all offers
export async function getOffers() {
  try {
    const response = await serverInstance.get('/internal/offers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch offers:', error.response);
    return [];
  }
}

// Get offer by ID
export async function getOfferById(id) {
  try {
    const response = await serverInstance.get(`/internal/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch offer ${id}:`, error.response);
    return null;
  }
}

// Create new offer
export async function createOffer(offerData) {
  try {
    const response = await serverInstance.post('/internal/offers', offerData);
    return response.status;
  } catch (error) {
    console.error('Failed to create offer:', error.response);
    return error.response?.status || 500;
  }
}

// Update offer
export async function updateOffer(id, offerData) {
  try {
    const response = await serverInstance.put(`/internal/offers/${id}`, offerData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update offer ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete offer
export async function deleteOffer(id) {
  try {
    const response = await serverInstance.delete(`/internal/offers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete offer ${id}:`, error.response);
    return error.response?.status || 500;
  }
}