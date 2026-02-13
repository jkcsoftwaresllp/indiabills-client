import serverInstance from './api-config';

// Get all transport partners with filters
export async function getTransportPartners(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/internal/transport-partners${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await serverInstance.get(url);
    let dataArray = [];
    if (Array.isArray(response.data)) {
      dataArray = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      dataArray = response.data.data;
    } else if (response.data && typeof response.data === 'object' && response.data.name) {
      // Single object response, wrap in array
      dataArray = [response.data];
    }
    const transformedData = dataArray.map(partner => ({
      id: partner.id,
      name: partner.name,
      businessName: partner.business_name,
      contactPerson: partner.contact_person,
      phone: partner.phone,
      alternatePhone: partner.alternate_phone,
      email: partner.email,
      addressLine: partner.address_line,
      city: partner.city,
      state: partner.state,
      pinCode: partner.pin_code,
      gstNumber: partner.gst_number,
      panNumber: partner.pan_number,
      baseRate: partner.base_rate,
      ratePerKm: partner.rate_per_km,
      vehicleDetails: Array.isArray(partner.vehicle_details?.vehicles)
        ? partner.vehicle_details.vehicles.join(', ')
        : JSON.stringify(partner.vehicle_details),
      isActive: partner.is_active,
      createdAt: partner.created_at,
      updatedAt: partner.updated_at
    }));

    return transformedData;
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

// Update transport partner (PATCH)
export async function updateTransportPartner(id, transportData) {
  try {
    const response = await serverInstance.patch(`/internal/transport-partners/${id}`, transportData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update transport partner ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete transport partner (soft delete)
export async function deleteTransportPartner(id) {
  try {
    const response = await serverInstance.delete(`/internal/transport-partners/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete transport partner ${id}:`, error.response);
    return error.response?.status || 500;
  }
}