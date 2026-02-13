import serverInstance from './api-config';

// Get all customer orders with pagination and optional filters
export async function getCustomerOrders(options = {}) {
  try {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    params.append('limit', limit);
    params.append('offset', offset);
    
    // Add optional filters
    if (options.customer_id) {
      params.append('customer_id', options.customer_id);
    }
    if (options.order_status && options.order_status !== 'all') {
      params.append('order_status', options.order_status);
    }
    if (options.payment_status && options.payment_status !== 'all') {
      params.append('payment_status', options.payment_status);
    }
    if (options.start_date) {
      params.append('start_date', options.start_date);
    }
    if (options.end_date) {
      params.append('end_date', options.end_date);
    }

    const url = `/internal/customers/orders?${params}`;
    const response = await serverInstance.get(url);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch customer orders:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to fetch customer orders',
    };
  }
}

// Get a specific customer order by ID
export async function getCustomerOrderById(orderId) {
  try {
    const response = await serverInstance.get(`/internal/customers/orders/${orderId}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch customer order:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to fetch customer order',
    };
  }
}
