import serverInstance from './api-config';

// Get all subscription plans
export async function getSubscriptionPlans() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/plans');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch subscription plans:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch subscription plans' }
    };
  }
}

// Get specific subscription plan
export async function getSubscriptionPlan(planId) {
  try {
    const response = await serverInstance.get(`/internal/subscriptions/plans/${planId}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`Failed to fetch subscription plan ${planId}:`, error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch subscription plan' }
    };
  }
}

// Create Razorpay order for a plan
export async function createSubscriptionOrder(planId, cycle, amount) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/plans/${planId}/create-order`,
      { cycle, amount }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create subscription order:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to create subscription order' }
    };
  }
}

// Verify payment and activate subscription
export async function verifySubscriptionPayment(paymentData) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/plans/${paymentData.planId}/verify-payment`,
      {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        cycle: paymentData.cycle
      }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to verify subscription payment:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to verify subscription payment' }
    };
  }
}

// Get subscription history
export async function getSubscriptionHistory() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/history');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch subscription history:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch subscription history' }
    };
  }
}

// Get current active subscription (returns active_subscription in data)
export async function getCurrentSubscription() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch current subscription:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch current subscription' }
    };
  }
}

// Create partial payment order for pending subscription
export async function createPartialPaymentOrder(subscriptionId, amount) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/payments/partial`,
      { 
        subscription_id: subscriptionId, 
        amount 
      }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create partial payment order:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to create partial payment order' }
    };
  }
}

// Verify partial payment (uses same endpoint as full payment verification)
export async function verifyPartialPayment(paymentData) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/plans/${paymentData.planId}/verify-payment`,
      {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        cycle: paymentData.cycle
      }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to verify partial payment:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to verify partial payment' }
    };
  }
}

// Get remaining amount for a plan subscription
export async function getRemainingAmount(planId) {
  try {
    const response = await serverInstance.get(
      `/internal/subscriptions/remaining/${planId}`
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch remaining amount:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch remaining amount' }
    };
  }
}

// Get subscription payments list
export async function getSubscriptionPayments() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/payments');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch subscription payments:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch subscription payments' }
    };
  }
}

// Get payment invoices list
export async function getPaymentInvoices() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/payments');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch payment invoices:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch payment invoices' }
    };
  }
}

// Get subscription invoices list
export async function getSubscriptionInvoices() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/history');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch subscription invoices:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to fetch subscription invoices' }
    };
  }
}
