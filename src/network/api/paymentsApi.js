import serverInstance from './api-config';

// Get all payments with pagination and optional filters
export async function getPayments(options = {}) {
  try {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    const page = options.page || 1;
    const limit = options.limit || 20;
    params.append('page', page);
    params.append('limit', limit);
    
    // Add optional filters
    if (options.status && options.status !== 'all') {
      params.append('status', options.status);
    }
    if (options.offset) {
      params.append('offset', options.offset);
    }

    const url = `/internal/payments?${params}`;
    console.log('Fetching payments with URL:', url, 'Options:', options);
    const response = await serverInstance.get(url);
    console.log('Payments response:', response.data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch payments:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to fetch payments',
    };
  }
}

// Get a specific payment by ID
export async function getPaymentById(paymentId) {
  try {
    const response = await serverInstance.get(`/internal/payments/${paymentId}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch payment:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to fetch payment',
    };
  }
}

// Update payment status
export async function updatePaymentStatus(paymentData) {
  try {
    console.log('Sending payment status update:', paymentData);
    const response = await serverInstance.patch('/internal/payments/status', paymentData);
    console.log('Payment status update response:', response);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update payment status. Status:', error.response?.status);
    console.error('Error response data:', error.response?.data);
    console.error('Full error:', error);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to update payment status',
    };
  }
}

// Create payment
export async function createPayment(paymentData) {
  try {
    const response = await serverInstance.post('/internal/payments', paymentData);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create payment:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to create payment',
    };
  }
}

// Get invoice by identifier
export async function getInvoice(identifier) {
  try {
    const response = await serverInstance.get(`/invoices/${identifier}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch invoice:', error.response);
    return {
      status: error.response?.status || 500,
      data: null,
      error: error.response?.data?.message || 'Failed to fetch invoice',
    };
  }
}
