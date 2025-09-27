import serverInstance from './api-config';

// Get all products
export async function getProducts() {
  try {
    const response = await serverInstance.get('/internal/products');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch products:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const response = await serverInstance.get(`/internal/products/${id}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: null
    };
  }
}

// Create new product
export async function createProduct(productData) {
  try {
    // Map frontend data to backend API format
    const apiData = {
      name: productData.name || productData.itemName,
      description: productData.description,
      categoryId: productData.categoryId || 1,
      manufacturer: productData.manufacturer,
      brand: productData.brand || productData.manufacturer,
      barcode: productData.barcode || productData.upc,
      dimensions: productData.dimensions,
      weight: productData.weight,
      unitMrp: productData.unitMrp || productData.unitMRP,
      purchasePrice: productData.purchasePrice,
      salePrice: productData.salePrice,
      reorderLevel: productData.reorderLevel,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      unitOfMeasure: productData.unitOfMeasure || 'pieces',
      maxStockLevel: productData.maxStockLevel || (productData.reorderLevel * 10),
      hsn: productData.hsn,
      upc: productData.upc,
      taxes: {
        cgst: productData.cgst || 0,
        sgst: productData.sgst || 0,
        cess: productData.cess || 0
      },
      variants: productData.variants || []
    };

    const response = await serverInstance.post('/internal/products', apiData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create product:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Product creation failed' }
    };
  }
}

// Update product
export async function updateProduct(id, productData) {
  try {
    // Map frontend data to backend API format
    const apiData = {
      name: productData.name || productData.itemName,
      description: productData.description,
      categoryId: productData.categoryId,
      manufacturer: productData.manufacturer,
      brand: productData.brand || productData.manufacturer,
      barcode: productData.barcode || productData.upc,
      dimensions: productData.dimensions,
      weight: productData.weight,
      unitMrp: productData.unitMrp || productData.unitMRP,
      purchasePrice: productData.purchasePrice,
      salePrice: productData.salePrice,
      reorderLevel: productData.reorderLevel,
      isActive: productData.isActive,
      unitOfMeasure: productData.unitOfMeasure,
      maxStockLevel: productData.maxStockLevel,
      hsn: productData.hsn,
      upc: productData.upc,
      taxes: {
        cgst: productData.cgst || 0,
        sgst: productData.sgst || 0,
        cess: productData.cess || 0
      },
      variants: productData.variants || []
    };

    const response = await serverInstance.patch(`/internal/products/${id}`, apiData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Product update failed' }
    };
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const response = await serverInstance.delete(`/internal/products/${id}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Product deletion failed' }
    };
  }
}