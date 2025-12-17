import serverInstance from "./api-config";

// Get all customers
export async function getCustomers(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.search) params.append("search", options.search);
    if (options.customer_type)
      params.append("customer_type", options.customer_type);
    if (options.is_active !== undefined)
      params.append("is_active", options.is_active);
    if (options.page) params.append("page", options.page);
    if (options.limit) params.append("limit", options.limit);
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.sortOrder) params.append("sortOrder", options.sortOrder);

    const url = `/internal/customers${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await serverInstance.get(url);
    return response.data.data.data || [];
  } catch (error) {
    console.error("Failed to fetch customers:", error.response);
    return [];
  }
}

// Get logged-in customer's own profile
export async function getCustomerProfile() {
  try {
    const response = await serverInstance.get("/internal/customers/profile");
    // Handle different response structures
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch customer profile:", error.response);
    // If profile endpoint doesn't exist, return null
    if (error.response?.status === 404) {
      console.warn(
        "Profile endpoint not found, customer profile may not be available"
      );
    }
    return null;
  }
}

// Get any customer's profile (admin/manager/operator only)
export async function getCustomerProfileById(id) {
  try {
    const response = await serverInstance.get(
      `/internal/customers/profile/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer profile ${id}:`, error.response);
    return null;
  }
}

// Get customer by ID
export async function getCustomerById(id) {
  try {
    const response = await serverInstance.get(`/internal/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer ${id}:`, error.response);
    return null;
  }
}

// Create new customer
export async function createCustomer(customerData) {
  try {
    // Frontend validation
    const errors = [];

    // Required fields
    if (!customerData.first_name || customerData.first_name.length < 2) {
      errors.push("First name is required (min 2 characters)");
    }
    if (!customerData.last_name || customerData.last_name.length < 2) {
      errors.push("Last name is required (min 2 characters)");
    }
    if (
      !customerData.email ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerData.email)
    ) {
      errors.push("Valid email is required");
    }
    const normalizedPhone = customerData.phone
      ? customerData.phone.replace(/[\s\-()]/g, "")
      : "";

    if (!normalizedPhone || !/^\+?[1-9][0-9]{6,14}$/.test(normalizedPhone)) {
      errors.push(
        "Valid phone number is required (7–15 digits, may start with +)"
      );
    } else {
      customerData.phone = normalizedPhone; // replace original with cleaned version
    }
    if (!customerData.password || customerData.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (customerData.password !== customerData.confirm_password) {
      errors.push("Passwords do not match");
    }

    // Business validation
    if (customerData.customer_type === "business") {
      if (!customerData.business_name) {
        errors.push("Business name is required for business customers");
      }
      if (
        !customerData.gstin ||
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          customerData.gstin
        )
      ) {
        errors.push("Valid GSTIN is required for business customers");
      }
    }

    // Optional field validations
    if (
      customerData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan_number)
    ) {
      errors.push("Invalid PAN format (e.g., ABCDE1234F)");
    }
    if (
      customerData.aadhar_number &&
      !/^[0-9]{12}$/.test(customerData.aadhar_number)
    ) {
      errors.push("Invalid Aadhaar number (must be 12 digits)");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const response = await serverInstance.post(
      "/internal/customers",
      customerData
    );
    return response.status;
  } catch (error) {
    console.error("Failed to create customer:", error.response || error);
    throw error;
  }
}

// Update customer
export async function updateCustomer(id, customerData) {
  try {
    // Frontend validation for provided fields
    const errors = [];

    if (customerData.first_name && customerData.first_name.length < 2) {
      errors.push("First name must be at least 2 characters");
    }
    if (customerData.last_name && customerData.last_name.length < 2) {
      errors.push("Last name must be at least 2 characters");
    }
    if (
      customerData.email &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerData.email)
    ) {
      errors.push("Invalid email format");
    }
    if (
      customerData.phone &&
      !/^\+?[0-9]{7,15}$/.test(customerData.phone.replace(/\s/g, ""))
    ) {
      errors.push("Invalid phone number");
    }
    if (customerData.customer_type === "business") {
      if (
        customerData.business_name !== undefined &&
        !customerData.business_name
      ) {
        errors.push("Business name is required for business customers");
      }
      if (
        customerData.gstin &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          customerData.gstin
        )
      ) {
        errors.push("Invalid GSTIN format");
      }
    }
    if (
      customerData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan_number)
    ) {
      errors.push("Invalid PAN format");
    }
    if (
      customerData.aadhar_number &&
      !/^[0-9]{12}$/.test(customerData.aadhar_number)
    ) {
      errors.push("Invalid Aadhaar number");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const response = await serverInstance.patch(
      `/internal/customers/${id}`,
      customerData
    );
    return response.status;
  } catch (error) {
    console.error(`Failed to update customer ${id}:`, error.response || error);
    throw error;
  }
}

// Delete customer
export async function deleteCustomer(id) {
  try {
    const response = await serverInstance.delete(`/internal/customers/${id}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to delete customer ${id}:`, error.response);
    return error.response?.status || 500;
  }
}

// Update authenticated customer's own profile
export async function updateCustomerSelf(customerData) {
  try {
    // Frontend validation for provided fields
    const errors = [];

    if (customerData.first_name && customerData.first_name.length < 2) {
      errors.push("First name must be at least 2 characters");
    }
    if (customerData.last_name && customerData.last_name.length < 2) {
      errors.push("Last name must be at least 2 characters");
    }
    if (
      customerData.email &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerData.email)
    ) {
      errors.push("Invalid email format");
    }
    if (
      customerData.phone &&
      !/^\+?[0-9]{7,15}$/.test(customerData.phone.replace(/\s/g, ""))
    ) {
      errors.push("Phone must be 7-15 digits");
    }
    if (customerData.gstin && customerData.gstin.length !== 15) {
      errors.push("GSTIN must be 15 characters");
    }
    if (
      customerData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan_number)
    ) {
      errors.push("Invalid PAN format (e.g., ABCDE1234F)");
    }
    if (
      customerData.credit_limit !== undefined &&
      customerData.credit_limit < 0
    ) {
      errors.push("Credit limit must be non-negative");
    }
    if (
      customerData.loyalty_points !== undefined &&
      customerData.loyalty_points < 0
    ) {
      errors.push("Loyalty points must be non-negative");
    }
    if (
      customerData.is_active !== undefined &&
      typeof customerData.is_active !== "boolean"
    ) {
      errors.push("is_active must be a boolean");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const response = await serverInstance.patch(
      "/internal/customers/self",
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update customer self:", error.response || error);
    throw error;
  }
}

// Create new address for authenticated customer
export async function createCustomerAddress(addressData) {
  try {
    // Frontend validation
    const errors = [];

    if (!addressData.address_line1 || !addressData.address_line1.trim()) {
      errors.push("Address line 1 is required");
    }
    if (!addressData.city || !addressData.city.trim()) {
      errors.push("City is required");
    }
    if (!addressData.state || !addressData.state.trim()) {
      errors.push("State is required");
    }
    if (!addressData.pin_code || !addressData.pin_code.trim()) {
      errors.push("Pin code is required");
    }
    if (
      addressData.pin_code &&
      !/^[a-zA-Z0-9]{3,10}$/.test(addressData.pin_code)
    ) {
      errors.push("Pin code must be 3-10 alphanumeric characters");
    }
    if (
      addressData.contact_phone &&
      !/^\+?[0-9]{7,15}$/.test(addressData.contact_phone.replace(/\s/g, ""))
    ) {
      errors.push("Contact phone must be 7-15 digits");
    }
    if (
      addressData.contact_email &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addressData.contact_email)
    ) {
      errors.push("Invalid contact email format");
    }
    if (
      addressData.address_type &&
      !["billing", "shipping", "other"].includes(addressData.address_type)
    ) {
      errors.push("Address type must be billing, shipping, or other");
    }
    if (
      addressData.is_default !== undefined &&
      typeof addressData.is_default !== "boolean"
    ) {
      errors.push("is_default must be a boolean");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const response = await serverInstance.post(
      "/internal/customers/address",
      addressData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create customer address:",
      error.response || error
    );
    throw error;
  }
}

// Get all addresses for authenticated customer
export async function getCustomerAddresses() {
  try {
    const response = await serverInstance.get("/internal/customers/address");
    // Handle different response structures
    if (response.data?.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch customer addresses:", error.response);
    return [];
  }
}

// Get single address by ID for authenticated customer
export async function getCustomerAddress(id) {
  try {
    const response = await serverInstance.get(
      `/internal/customers/address/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch customer address ${id}:`, error.response);
    return null;
  }
}

// Update address by ID for authenticated customer
export async function updateCustomerAddress(id, addressData) {
  try {
    // Frontend validation for provided fields
    const errors = [];

    if (addressData.address_line1 && !addressData.address_line1.trim()) {
      errors.push("Address line 1 cannot be empty");
    }
    if (addressData.city && !addressData.city.trim()) {
      errors.push("City cannot be empty");
    }
    if (addressData.state && !addressData.state.trim()) {
      errors.push("State cannot be empty");
    }
    if (addressData.pin_code && !addressData.pin_code.trim()) {
      errors.push("Pin code cannot be empty");
    }
    if (
      addressData.pin_code &&
      !/^[a-zA-Z0-9]{3,10}$/.test(addressData.pin_code)
    ) {
      errors.push("Pin code must be 3-10 alphanumeric characters");
    }
    if (
      addressData.contact_phone &&
      !/^\+?[0-9]{7,15}$/.test(addressData.contact_phone.replace(/\s/g, ""))
    ) {
      errors.push("Contact phone must be 7-15 digits");
    }
    if (
      addressData.contact_email &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addressData.contact_email)
    ) {
      errors.push("Invalid contact email format");
    }
    if (
      addressData.address_type &&
      !["billing", "shipping", "other"].includes(addressData.address_type)
    ) {
      errors.push("Address type must be billing, shipping, or other");
    }
    if (
      addressData.is_default !== undefined &&
      typeof addressData.is_default !== "boolean"
    ) {
      errors.push("is_default must be a boolean");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const response = await serverInstance.patch(
      `/internal/customers/address/${id}`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update customer address ${id}:`,
      error.response || error
    );
    throw error;
  }
}

// Delete address by ID for authenticated customer (soft delete)
export async function deleteCustomerAddress(id) {
  try {
    const response = await serverInstance.delete(
      `/internal/customers/address/${id}`
    );
    return response.status;
  } catch (error) {
    console.error(`Failed to delete customer address ${id}:`, error.response);
    return error.response?.status || 500;
  }
}
