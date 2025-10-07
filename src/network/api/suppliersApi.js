import serverInstance from './api-config';

// Get all suppliers
export async function getSuppliers(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/internal/suppliers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await serverInstance.get(url);
    
    // Transform snake_case to camelCase
    const transformedData = response.data.data?.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      businessName: supplier.business_name,
      contactPerson: supplier.contact_person,
      phone: supplier.phone,
      alternatePhone: supplier.alternate_phone,
      email: supplier.email,
      addressLine: supplier.address_line,
      city: supplier.city,
      state: supplier.state,
      pinCode: supplier.pin_code,
      gstin: supplier.gstin,
      bankAccountNumber: supplier.bank_account_number,
      ifsccode: supplier.ifsc_code,
      upiid: supplier.upi_id,
      creditLimit: supplier.credit_limit,
      paymentTerms: supplier.payment_terms,
      remarks: supplier.remarks,
      rating: supplier.rating,
      isActive: supplier.is_active,
      createdAt: supplier.created_at,
      updatedAt: supplier.updated_at
    })) || [];
    
    return transformedData;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error.response);
    return [];
  }
}

// Get supplier by ID
export async function getSupplierById(id) {
  try {
    const response = await serverInstance.get(`/internal/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch supplier ${id}:`, error.response);
    return null;
  }
}

// Create new supplier
export async function createSupplier(supplierData) {
  try {
    const response = await serverInstance.post('/internal/suppliers', supplierData);
    return response.status;
  } catch (error) {
    console.error('Failed to create supplier:', error.response);
    return error.response?.status || 500;
  }
}

// Update supplier
export async function updateSupplier(id, supplierData) {
  try {
    const response = await serverInstance.patch(`/internal/suppliers/${id}`, supplierData);
    return response.status;
  } catch (error) {
    console.error(`Failed to update supplier ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Delete supplier
export async function deleteSupplier(id) {
  try {
    const response = await serverInstance.delete(`/internal/suppliers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete supplier ${id}:`, error.response);
    return error.response?.status || 500;
  }
}