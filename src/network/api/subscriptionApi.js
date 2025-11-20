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

// Get current active subscription
export async function getCurrentSubscription() {
  try {
    const response = await serverInstance.get('/internal/subscriptions/current');
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

// Create partial payment order
export async function createPartialPaymentOrder(planId, amount, cycle) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/plans/${planId}/create-partial-order`,
      { amount, cycle }
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

// Verify partial payment
export async function verifyPartialPayment(paymentData) {
  try {
    const response = await serverInstance.post(
      `/internal/subscriptions/plans/${paymentData.planId}/verify-partial-payment`,
      {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        cycle: paymentData.cycle,
        amountPaid: paymentData.amountPaid
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
