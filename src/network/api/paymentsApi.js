import serverInstance from './api-config';

// Get payments with optional status filter
export async function getPayments(options = {}) {
  try {
    const params = new URLSearchParams();
    if (options.status && options.status !== 'all') params.append('status', options.status);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);

    const response = await serverInstance.get(`/internal/payments?${params}`);
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

// Update payment status
export async function updatePaymentStatus(paymentData) {
  try {
    const response = await serverInstance.patch('/internal/payments/status', paymentData);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update payment status:', error.response);
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
