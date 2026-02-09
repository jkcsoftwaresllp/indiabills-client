import serverInstance from "./api-config";

// Get all products
export async function getProducts() {
  try {
    const response = await serverInstance.get("/internal/products");
    // normalize always to array
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error.response);
    return [];
  }
}
///////

// Get product by ID
export async function getProductById(id) {
  try {
    const response = await serverInstance.get(`/internal/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error.response);
    return null;
  }
}

// Create new product
export async function createProduct(productData) {
  try {
    const response = await serverInstance.post(
      "/internal/products",
      productData
    );
    return response.status;
  } catch (error) {
    console.error("Failed to create product:", error.response);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(", ") ||
      error.message ||
      "Failed to create product";
    throw new Error(errorMessage);
  }
}

// Update product
export async function updateProduct(id, productData) {
  try {
    const response = await serverInstance.patch(
      `/internal/products/${id}`,
      productData
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data,
    };
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const response = await serverInstance.delete(`/internal/products/${id}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data,
    };
  }
}
