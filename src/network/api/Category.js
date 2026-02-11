import serverInstance from "./api-config";

export async function getCategories() {
    try {
        const response = await serverInstance.get("/internal/category");
        return response.data?.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch category:", error.response);
        return [];
    }
}

export async function createCategory(categoryData) {
    try {
        const response = await serverInstance.post("/internal/category", categoryData);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Failed to create category:", error.response);
        return { status: error.response?.status || 500, data: error.response?.data };
    }
}

export async function deleteCategory(id) {
    try {
        const response = await serverInstance.delete(`/internal/category/${id}`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(`Failed to delete category ${id}:`, error.response);
        return { status: error.response?.status || 500, data: error.response?.data };
    }
}

export async function updateCategory(id, categoryData) {
    try {
        const response = await serverInstance.patch(`/internal/category/${id}`, categoryData);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(`Failed to update category ${id}:`, error.response);
        return { status: error.response?.status || 500, data: error.response?.data };
    }
}

export async function getUsedCategories() {
    try {
        // Get domain from URL or use default
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const domain = pathParts.length > 0 && pathParts[0].includes('.') ? pathParts[0] : 'indiabills';
        
        const response = await serverInstance.get(`/category/${domain}`);
        return response.data?.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch used categories:", error.response);
        return [];
    }
}