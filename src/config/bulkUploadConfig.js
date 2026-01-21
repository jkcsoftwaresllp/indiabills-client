/**
 * Bulk Upload Configuration
 * Defines all available bulk upload features with their fields and properties
 */

export const BULK_UPLOAD_FEATURES = {
  batches: {
    id: 'batches',
    label: 'Batches',
    description: 'Upload multiple batches in bulk',
    endpoint: '/internal/bulk/batches',
    dataKey: 'batches',
    icon: 'FiBox',
    status: 'active', // active, coming_soon, planned
    fields: {
      productId: {
        label: 'Product ID',
        type: 'number',
        required: true,
        description: 'The ID of the product',
        example: '1',
      },
      batchCode: {
        label: 'Batch Code',
        type: 'text',
        required: true,
        description: 'Unique batch identifier',
        example: 'B-001',
      },
      purchaseDate: {
        label: 'Purchase Date',
        type: 'date',
        required: true,
        description: 'Date of purchase (YYYY-MM-DD)',
        example: '2025-01-01',
      },
      quantity: {
        label: 'Quantity',
        type: 'number',
        required: true,
        description: 'Total quantity in batch',
        example: '100',
      },
      remainingQuantity: {
        label: 'Remaining Quantity',
        type: 'number',
        required: true,
        description: 'Available quantity (must be ≤ quantity)',
        example: '100',
      },
      unitCost: {
        label: 'Unit Cost',
        type: 'number',
        required: true,
        description: 'Cost per unit',
        example: '10.50',
      },
      warehouseId: {
        label: 'Warehouse ID',
        type: 'number',
        required: true,
        description: 'The warehouse where batch is stored',
        example: '3',
      },
      supplierId: {
        label: 'Supplier ID',
        type: 'number',
        required: false,
        description: 'The supplier of the batch',
        example: '2',
      },
      expiryDate: {
        label: 'Expiry Date',
        type: 'date',
        required: false,
        description: 'Expiry date (YYYY-MM-DD)',
        example: '2026-01-01',
      },
      remarks: {
        label: 'Remarks',
        type: 'text',
        required: false,
        description: 'Additional notes about the batch',
        example: 'Initial stock shipment',
      },
      isActive: {
        label: 'Is Active',
        type: 'boolean',
        required: false,
        description: 'Whether batch is active (true/false)',
        example: 'true',
      },
    },
  },

  products: {
    id: 'products',
    label: 'Products',
    description: 'Upload multiple products in bulk',
    endpoint: '/internal/bulk/products',
    dataKey: 'products',
    icon: 'FiList',
    status: 'coming_soon',
    fields: {
      itemName: {
        label: 'Product Name',
        type: 'text',
        required: true,
        description: 'Name of the product',
        example: 'Laptop Pro 15',
      },
      categoryId: {
        label: 'Category ID',
        type: 'number',
        required: true,
        description: 'Product category',
        example: '5',
      },
      unitMRP: {
        label: 'MRP',
        type: 'number',
        required: false,
        description: 'Maximum Retail Price',
        example: '99999',
      },
      salePrice: {
        label: 'Sale Price',
        type: 'number',
        required: true,
        description: 'Selling price',
        example: '85000',
      },
      purchasePrice: {
        label: 'Purchase Price',
        type: 'number',
        required: false,
        description: 'Cost price',
        example: '75000',
      },
      reorderLevel: {
        label: 'Reorder Level',
        type: 'number',
        required: false,
        description: 'Minimum stock level to trigger reorder',
        example: '10',
      },
      description: {
        label: 'Description',
        type: 'text',
        required: false,
        description: 'Product description',
        example: 'High performance laptop',
      },
    },
  },

  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    description: 'Upload multiple suppliers in bulk',
    endpoint: '/internal/bulk/suppliers',
    dataKey: 'suppliers',
    icon: 'FiTool',
    status: 'coming_soon',
    fields: {
      supplierName: {
        label: 'Supplier Name',
        type: 'text',
        required: true,
        description: 'Name of the supplier',
        example: 'ABC Supplies Ltd',
      },
      email: {
        label: 'Email',
        type: 'email',
        required: true,
        description: 'Supplier email address',
        example: 'contact@abc.com',
      },
      phone: {
        label: 'Phone',
        type: 'text',
        required: false,
        description: 'Contact phone number',
        example: '+91-9876543210',
      },
      city: {
        label: 'City',
        type: 'text',
        required: false,
        description: 'Supplier location city',
        example: 'Mumbai',
      },
      gstin: {
        label: 'GSTIN',
        type: 'text',
        required: false,
        description: 'GST Identification Number',
        example: '27AAFCU5055K1Z0',
      },
    },
  },

  customers: {
    id: 'customers',
    label: 'Customers',
    description: 'Upload multiple customers in bulk',
    endpoint: '/internal/bulk/customers',
    dataKey: 'customers',
    icon: 'FiUsers',
    status: 'coming_soon',
    fields: {
      customerName: {
        label: 'Customer Name',
        type: 'text',
        required: true,
        description: 'Name of the customer',
        example: 'John Doe',
      },
      email: {
        label: 'Email',
        type: 'email',
        required: false,
        description: 'Customer email address',
        example: 'john@example.com',
      },
      phone: {
        label: 'Phone',
        type: 'text',
        required: true,
        description: 'Customer phone number',
        example: '9876543210',
      },
      city: {
        label: 'City',
        type: 'text',
        required: false,
        description: 'Customer location city',
        example: 'Mumbai',
      },
      creditLimit: {
        label: 'Credit Limit',
        type: 'number',
        required: false,
        description: 'Maximum credit amount allowed',
        example: '50000',
      },
    },
  },

  warehouses: {
    id: 'warehouses',
    label: 'Warehouses',
    description: 'Upload multiple warehouses in bulk',
    endpoint: '/internal/bulk/warehouses',
    dataKey: 'warehouses',
    icon: 'FiBox',
    status: 'coming_soon',
    fields: {
      warehouseName: {
        label: 'Warehouse Name',
        type: 'text',
        required: true,
        description: 'Name of the warehouse',
        example: 'Main Warehouse',
      },
      city: {
        label: 'City',
        type: 'text',
        required: true,
        description: 'Warehouse location city',
        example: 'Mumbai',
      },
      address: {
        label: 'Address',
        type: 'text',
        required: false,
        description: 'Full address of the warehouse',
        example: '123 Industrial Park, Mumbai',
      },
      contactPerson: {
        label: 'Contact Person',
        type: 'text',
        required: false,
        description: 'Name of warehouse manager',
        example: 'Raj Kumar',
      },
    },
  },

  users: {
    id: 'users',
    label: 'Users',
    description: 'Upload multiple users in bulk',
    endpoint: '/internal/bulk/users',
    dataKey: 'users',
    icon: 'FiUsers',
    status: 'coming_soon',
    fields: {
      username: {
        label: 'Username',
        type: 'text',
        required: true,
        description: 'Unique username',
        example: 'john_doe',
      },
      email: {
        label: 'Email',
        type: 'email',
        required: true,
        description: 'User email address',
        example: 'john@company.com',
      },
      name: {
        label: 'Full Name',
        type: 'text',
        required: true,
        description: 'User full name',
        example: 'John Doe',
      },
      role: {
        label: 'Role',
        type: 'select',
        required: true,
        options: ['admin', 'operator', 'manager', 'reporter'],
        description: 'User role in system',
        example: 'operator',
      },
      phone: {
        label: 'Phone',
        type: 'text',
        required: false,
        description: 'Phone number',
        example: '9876543210',
      },
    },
  },
};

/**
 * Get all features
 */
export const getAllFeatures = () => {
  return Object.values(BULK_UPLOAD_FEATURES);
};

/**
 * Get active features only
 */
export const getActiveFeatures = () => {
  return Object.values(BULK_UPLOAD_FEATURES).filter(
    (feature) => feature.status === 'active'
  );
};

/**
 * Get feature by ID
 */
export const getFeatureById = (featureId) => {
  return BULK_UPLOAD_FEATURES[featureId];
};

/**
 * Get required fields for a feature
 */
export const getRequiredFields = (featureId) => {
  const feature = getFeatureById(featureId);
  if (!feature) return [];
  return Object.entries(feature.fields)
    .filter(([, field]) => field.required)
    .map(([key, field]) => ({ key, ...field }));
};

/**
 * Get all fields for a feature
 */
export const getAllFields = (featureId) => {
  const feature = getFeatureById(featureId);
  if (!feature) return [];
  return Object.entries(feature.fields).map(([key, field]) => ({
    key,
    ...field,
  }));
};

/**
 * Get fields by keys
 */
export const getFieldsByKeys = (featureId, fieldKeys) => {
  const feature = getFeatureById(featureId);
  if (!feature) return [];
  return fieldKeys
    .filter((key) => feature.fields[key])
    .map((key) => ({
      key,
      ...feature.fields[key],
    }));
};
