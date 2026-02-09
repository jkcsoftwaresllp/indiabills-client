import serverInstance from "./api-config";

export async function getCategories() {
    try {
        // const id = 3
        console.log("Category Api call")
        const response = await serverInstance.get("/internal/category" )
        console.log("category:", response.data.data.data)
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch category:", error.response);
        return [];
    }
}


export async function deleteCategory(id) {
    try {
        const response = await serverInstance.delete(`/internal/category/${id}`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(`Failed to delete category ${id}:`, error.response);
        return { status: error.response?.status || 500, data: error.response.data };
    }
}

export async function updateCategory(id, categoryData) {
    try {
        const response = await serverInstance.put(`/internal/category/${id}`, categoryData);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(`Failed to update category ${id}:`, error.response);
        return { status: error.response?.status || 500, data: error.response.data };
    }
}