import serverInstance from "./api-config";
import { convertImageUrlsToAbsolute, getBasePath } from "./imageUrlHelper";

// Get all products
export async function getProducts() {
  try {
    const response = await serverInstance.get("/internal/products");
    // normalize always to array and convert image URLs
    const data = response.data?.data || [];
    return convertImageUrlsToAbsolute(data);
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
    return convertImageUrlsToAbsolute(response.data);
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

// Upload product image
export async function uploadProductImage(file, productId = null) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (productId) {
      formData.append("productId", productId);
    }
    const response = await serverInstance.post(
      "/internal/products/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Construct absolute URL for the image
    const basePath = getBasePath();
    const imageUrl = response.data.imageUrl || response.data.url;
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${basePath}${imageUrl}`;
    
    return {
      status: response.status,
      data: {
        ...response.data,
        imageUrl: absoluteImageUrl,
        url: absoluteImageUrl
      },
    };
  } catch (error) {
    console.error("Failed to upload product image:", error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data,
    };
  }
}
