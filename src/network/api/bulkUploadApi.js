import serverInstance from './api-config';

// Bulk create batches
export async function bulkCreateBatches(batchesData) {
  try {
    if (!Array.isArray(batchesData) || batchesData.length === 0) {
      throw new Error('Batches array is required');
    }

    const response = await serverInstance.post('/internal/bulk/batches', {
      batches: batchesData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create batches:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create batches',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create products
export async function bulkCreateProducts(productsData) {
  try {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new Error('Products array is required');
    }

    const response = await serverInstance.post('/internal/bulk/products', {
      products: productsData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create products:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create products',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create suppliers
export async function bulkCreateSuppliers(suppliersData) {
  try {
    if (!Array.isArray(suppliersData) || suppliersData.length === 0) {
      throw new Error('Suppliers array is required');
    }

    const response = await serverInstance.post('/internal/bulk/suppliers', {
      suppliers: suppliersData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create suppliers:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create suppliers',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create customers
export async function bulkCreateCustomers(customersData) {
  try {
    if (!Array.isArray(customersData) || customersData.length === 0) {
      throw new Error('Customers array is required');
    }

    const response = await serverInstance.post('/internal/bulk/customers', {
      customers: customersData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create customers:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create customers',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create customer addresses
export async function bulkCreateCustomerAddresses(addressesData) {
  try {
    if (!Array.isArray(addressesData) || addressesData.length === 0) {
      throw new Error('Addresses array is required');
    }

    const response = await serverInstance.post('/internal/bulk/customers/address', {
      addresses: addressesData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create customer addresses:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create customer addresses',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create transport partners
export async function bulkCreateTransportPartners(transportPartnersData) {
  try {
    if (!Array.isArray(transportPartnersData) || transportPartnersData.length === 0) {
      throw new Error('Transport partners array is required');
    }

    const response = await serverInstance.post('/internal/bulk/transport-partners', {
      transport_partners: transportPartnersData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create transport partners:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create transport partners',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create inventory movements
export async function bulkCreateInventoryMovements(movementsData) {
  try {
    if (!Array.isArray(movementsData) || movementsData.length === 0) {
      throw new Error('Movements array is required');
    }

    const response = await serverInstance.post('/internal/bulk/inventory-movements', {
      movements: movementsData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create inventory movements:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create inventory movements',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create promotional offers
export async function bulkCreatePromotionalOffers(offersData) {
  try {
    if (!Array.isArray(offersData) || offersData.length === 0) {
      throw new Error('Promotional offers array is required');
    }

    const response = await serverInstance.post('/internal/bulk/promotional-offers', {
      promotional_offers: offersData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create promotional offers:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create promotional offers',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create inventory stock
export async function bulkCreateInventoryStock(stocksData) {
  try {
    if (!Array.isArray(stocksData) || stocksData.length === 0) {
      throw new Error('Inventory stock array is required');
    }

    const response = await serverInstance.post('/internal/bulk/inventory-stock', {
      stocks: stocksData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create inventory stock:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create inventory stock',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create users
export async function bulkCreateUsers(usersData) {
  try {
    if (!Array.isArray(usersData) || usersData.length === 0) {
      throw new Error('Users array is required');
    }

    const response = await serverInstance.post('/internal/bulk/users', {
      users: usersData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create users:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create users',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}

// Bulk create warehouses
export async function bulkCreateWarehouses(warehousesData) {
  try {
    if (!Array.isArray(warehousesData) || warehousesData.length === 0) {
      throw new Error('Warehouses array is required');
    }

    const response = await serverInstance.post('/internal/bulk/warehouses', {
      warehouses: warehousesData
    });
    
    return {
      status: response.status,
      message: response.data?.message,
      count: response.data?.count,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to bulk create warehouses:', error.response || error);
    return {
      status: error.response?.status || 400,
      message: error.response?.data?.message || 'Failed to create warehouses',
      errors: error.response?.data?.errors || [],
      data: error.response?.data
    };
  }
}
