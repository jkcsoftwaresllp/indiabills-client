import serverInstance from "./api-config";

// Get all offers with filters
export async function getOffers(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.active !== undefined) params.append("active", options.active);
    if (options.start_date) params.append("start_date", options.start_date);
    if (options.end_date) params.append("end_date", options.end_date);
    if (options.limit) params.append("limit", options.limit);
    if (options.offset) params.append("offset", options.offset);
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.sortOrder) params.append("sortOrder", options.sortOrder);

    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `/internal/offers${query}`;

    const response = await serverInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch offers:", error?.response || error);
    return [];
  }
}

// Get offer by ID
export async function getOfferById(id) {
  try {
    const response = await serverInstance.get(`/internal/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch offer ${id}:`, error?.response || error);
    return null;
  }
}

// Create new offer
export async function createOffer(offerData) {
  try {
    const response = await serverInstance.post("/internal/offers", offerData);
    return response.status;
  } catch (error) {
    console.error("Failed to create offer:", error?.response || error);
    return error.response?.status || 500;
  }
}

// Update offer (PATCH)
export async function updateOffer(id, offerData) {
  try {
    const response = await serverInstance.patch(`/internal/offers/${id}`, offerData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update offer ${id}:`, error?.response || error);
    return error.response?.status || 500;
  }
}

// Delete offer (soft delete)
export async function deleteOffer(id) {
  try {
    const response = await serverInstance.delete(`/internal/offers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete offer ${id}:`, error?.response || error);
    return error.response?.status || 500;
  }
}