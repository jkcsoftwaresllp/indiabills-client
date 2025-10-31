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
    
    // Handle both snake_case and camelCase
    const transformedData = response.data.data?.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      businessName: supplier.business_name || supplier.businessName,
      contactPerson: supplier.contact_person || supplier.contactPerson,
      phone: supplier.phone,
      alternatePhone: supplier.alternate_phone || supplier.alternatePhone,
      email: supplier.email,
      addressLine: supplier.address_line || supplier.addressLine,
      city: supplier.city,
      state: supplier.state,
      pinCode: supplier.pin_code || supplier.pinCode,
      gstin: supplier.gstin,
      bankAccountNumber: supplier.bank_account_number || supplier.bankAccountNumber,
      ifscCode: supplier.ifsc_code || supplier.ifscCode,
      upiId: supplier.upi_id || supplier.upiId,
      creditLimit: supplier.credit_limit || supplier.creditLimit,
      paymentTerms: supplier.payment_terms || supplier.paymentTerms,
      remarks: supplier.remarks,
      rating: supplier.rating,
      isActive: supplier.is_active || supplier.isActive,
      createdAt: supplier.created_at || supplier.createdAt,
      updatedAt: supplier.updated_at || supplier.updatedAt
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
    // Transform snake_case to camelCase
    const supplier = response.data;
    return {
      id: supplier.id,
      name: supplier.name,
      businessName: supplier.business_name || supplier.businessName,
      contactPerson: supplier.contact_person || supplier.contactPerson,
      phone: supplier.phone,
      alternatePhone: supplier.alternate_phone || supplier.alternatePhone,
      email: supplier.email,
      addressLine: supplier.address_line || supplier.addressLine,
      city: supplier.city,
      state: supplier.state,
      pinCode: supplier.pin_code || supplier.pinCode,
      gstin: supplier.gstin,
      bankAccountNumber: supplier.bank_account_number || supplier.bankAccountNumber,
      ifscCode: supplier.ifsc_code || supplier.ifscCode,
      upiId: supplier.upi_id || supplier.upiId,
      creditLimit: supplier.credit_limit || supplier.creditLimit,
      paymentTerms: supplier.payment_terms || supplier.paymentTerms,
      remarks: supplier.remarks,
      rating: supplier.rating,
      isActive: supplier.is_active || supplier.isActive,
      createdAt: supplier.created_at || supplier.createdAt,
      updatedAt: supplier.updated_at || supplier.updatedAt
    };
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